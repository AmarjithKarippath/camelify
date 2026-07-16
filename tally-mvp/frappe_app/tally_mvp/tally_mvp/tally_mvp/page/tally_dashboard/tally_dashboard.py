import frappe
from frappe.utils import today, flt


@frappe.whitelist()
def get_dashboard_data():
    company = frappe.defaults.get_user_default("Company") or frappe.db.get_single_value(
        "Global Defaults", "default_company"
    )

    return {
        "today_sales": _today_sales(company),
        "outstanding_receivables": _outstanding_receivables(company),
        "cash_and_bank": _cash_and_bank(company),
        "low_stock_items": _low_stock_items(company),
    }


def _today_sales(company):
    return flt(
        frappe.db.sql(
            """
            SELECT COALESCE(SUM(grand_total), 0)
            FROM `tabSales Invoice`
            WHERE docstatus = 1 AND posting_date = %s AND company = %s
            """,
            (today(), company),
        )[0][0]
    )


def _outstanding_receivables(company):
    return flt(
        frappe.db.sql(
            """
            SELECT COALESCE(SUM(outstanding_amount), 0)
            FROM `tabSales Invoice`
            WHERE docstatus = 1 AND outstanding_amount > 0 AND company = %s
            """,
            (company,),
        )[0][0]
    )


def _cash_and_bank(company):
    accounts = frappe.get_all(
        "Account",
        filters={
            "company": company,
            "account_type": ["in", ["Cash", "Bank"]],
            "is_group": 0,
        },
        pluck="name",
    )
    if not accounts:
        return 0

    total = frappe.db.sql(
        """
        SELECT COALESCE(SUM(debit - credit), 0)
        FROM `tabGL Entry`
        WHERE account IN %(accounts)s AND company = %(company)s AND is_cancelled = 0
        """,
        {"accounts": accounts, "company": company},
    )[0][0]
    return flt(total)


def _low_stock_items(company):
    return frappe.db.sql(
        """
        SELECT i.item_code, i.item_name, b.actual_qty, i.reorder_level
        FROM `tabBin` b
        INNER JOIN `tabItem` i ON i.name = b.item_code
        WHERE b.actual_qty < COALESCE(i.reorder_level, 0)
          AND i.reorder_level > 0
          AND i.is_stock_item = 1
        ORDER BY b.actual_qty ASC
        LIMIT 10
        """,
        as_dict=True,
    )


def has_permission():
    return frappe.has_permission("Sales Invoice", "read")
