import frappe
from frappe import _


def validate_gst_fields(doc, method=None):
    if doc.get("is_return"):
        return

    for row in doc.get("items") or []:
        if not row.get("gst_hsn_code") and row.get("item_code"):
            hsn = frappe.db.get_value("Item", row.item_code, "gst_hsn_code")
            if hsn:
                row.gst_hsn_code = hsn
            elif frappe.db.get_value("Item", row.item_code, "is_stock_item"):
                frappe.throw(
                    _("HSN/SAC code required for item {0}").format(row.item_code)
                )

    if not doc.customer:
        return

    gstin = frappe.db.get_value("Customer", doc.customer, "gstin")
    if gstin and not doc.billing_address_gstin:
        doc.billing_address_gstin = gstin
