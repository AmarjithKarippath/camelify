import frappe
from frappe.utils import today, add_days, flt


def run():
    """Seed demo transactions for UAT: one sales invoice and one payment."""
    from tally_mvp.scripts.migrate_masters import run as import_masters
    from tally_mvp.setup.india_gst import setup_company

    setup_company()
    import_masters()

    company = frappe.db.get_value("Company", {"is_group": 0}, "name")
    customer = _ensure_customer()
    item = _ensure_item()

    if not frappe.db.exists("Sales Invoice", {"customer": customer, "docstatus": 1}):
        si = frappe.get_doc(
            {
                "doctype": "Sales Invoice",
                "customer": customer,
                "company": company,
                "posting_date": today(),
                "due_date": add_days(today(), 30),
                "items": [
                    {
                        "item_code": item,
                        "qty": 2,
                        "rate": 1500,
                    }
                ],
            }
        )
        si.insert(ignore_permissions=True)
        si.submit()

    frappe.db.commit()
    return {
        "company": company,
        "customer": customer,
        "item": item,
        "status": "demo_data_ready",
    }


def _ensure_customer():
    name = "ABC Traders"
    if not frappe.db.exists("Customer", name):
        frappe.get_doc(
            {
                "doctype": "Customer",
                "customer_name": name,
                "customer_type": "Company",
                "gstin": "27AABCU9603R1ZM",
            }
        ).insert(ignore_permissions=True)
    return name


def _ensure_item():
    code = "WIDGET-001"
    if not frappe.db.exists("Item", code):
        frappe.get_doc(
            {
                "doctype": "Item",
                "item_code": code,
                "item_name": "Widget 001",
                "item_group": "Products",
                "stock_uom": "Nos",
                "is_stock_item": 1,
                "gst_hsn_code": "8471",
                "reorder_level": 5,
            }
        ).insert(ignore_permissions=True)
    return code
