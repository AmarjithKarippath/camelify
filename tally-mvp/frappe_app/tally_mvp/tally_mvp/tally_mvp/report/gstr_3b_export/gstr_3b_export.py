# Copyright (c) 2026, Tally MVP and contributors

import frappe
from frappe import _
from frappe.utils import getdate, get_first_day, get_last_day


def execute(filters=None):
    filters = frappe._dict(filters or {})
    return get_columns(), get_data(filters)


def get_columns():
    return [
        {"label": _("Description"), "fieldname": "description", "fieldtype": "Data", "width": 260},
        {"label": _("CGST"), "fieldname": "cgst", "fieldtype": "Currency", "width": 120},
        {"label": _("SGST"), "fieldname": "sgst", "fieldtype": "Currency", "width": 120},
        {"label": _("IGST"), "fieldname": "igst", "fieldtype": "Currency", "width": 120},
        {"label": _("Total Tax"), "fieldname": "total_tax", "fieldtype": "Currency", "width": 140},
    ]


def get_data(filters):
    from_date = filters.get("from_date") or get_first_day(getdate())
    to_date = filters.get("to_date") or get_last_day(getdate())

    outward = frappe.db.sql(
        """
        SELECT
            COALESCE(SUM(sii.cgst_amount), 0) AS cgst,
            COALESCE(SUM(sii.sgst_amount), 0) AS sgst,
            COALESCE(SUM(sii.igst_amount), 0) AS igst
        FROM `tabSales Invoice` si
        INNER JOIN `tabSales Invoice Item` sii ON sii.parent = si.name
        WHERE si.docstatus = 1 AND si.is_return = 0
          AND si.posting_date BETWEEN %(from_date)s AND %(to_date)s
        """,
        {"from_date": from_date, "to_date": to_date},
        as_dict=True,
    )[0]

    inward = frappe.db.sql(
        """
        SELECT
            COALESCE(SUM(pii.cgst_amount), 0) AS cgst,
            COALESCE(SUM(pii.sgst_amount), 0) AS sgst,
            COALESCE(SUM(pii.igst_amount), 0) AS igst
        FROM `tabPurchase Invoice` pi
        INNER JOIN `tabPurchase Invoice Item` pii ON pii.parent = pi.name
        WHERE pi.docstatus = 1 AND pi.is_return = 0
          AND pi.posting_date BETWEEN %(from_date)s AND %(to_date)s
        """,
        {"from_date": from_date, "to_date": to_date},
        as_dict=True,
    )[0]

    def row(desc, vals):
        total = (vals.cgst or 0) + (vals.sgst or 0) + (vals.igst or 0)
        return {
            "description": desc,
            "cgst": vals.cgst,
            "sgst": vals.sgst,
            "igst": vals.igst,
            "total_tax": total,
        }

    return [
        row(_("3.1 Outward taxable supplies (other than zero rated, nil rated)"), outward),
        row(_("4. Eligible ITC — inward supplies"), inward),
        row(
            _("Net tax payable (outward - ITC, simplified)"),
            frappe._dict(
                cgst=(outward.cgst or 0) - (inward.cgst or 0),
                sgst=(outward.sgst or 0) - (inward.sgst or 0),
                igst=(outward.igst or 0) - (inward.igst or 0),
            ),
        ),
    ]
