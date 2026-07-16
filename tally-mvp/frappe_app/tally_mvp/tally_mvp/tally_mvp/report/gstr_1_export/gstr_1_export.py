# Copyright (c) 2026, Tally MVP and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.utils import getdate, get_first_day, get_last_day


def execute(filters=None):
    filters = frappe._dict(filters or {})
    columns = get_columns()
    data = get_data(filters)
    return columns, data


def get_columns():
    return [
        {"label": _("Invoice No"), "fieldname": "invoice_no", "fieldtype": "Link", "options": "Sales Invoice", "width": 140},
        {"label": _("Date"), "fieldname": "posting_date", "fieldtype": "Date", "width": 100},
        {"label": _("Customer"), "fieldname": "customer", "fieldtype": "Link", "options": "Customer", "width": 160},
        {"label": _("GSTIN"), "fieldname": "gstin", "fieldtype": "Data", "width": 150},
        {"label": _("HSN/SAC"), "fieldname": "hsn", "fieldtype": "Data", "width": 100},
        {"label": _("Taxable Value"), "fieldname": "taxable_value", "fieldtype": "Currency", "width": 120},
        {"label": _("CGST"), "fieldname": "cgst", "fieldtype": "Currency", "width": 100},
        {"label": _("SGST"), "fieldname": "sgst", "fieldtype": "Currency", "width": 100},
        {"label": _("IGST"), "fieldname": "igst", "fieldtype": "Currency", "width": 100},
        {"label": _("Total"), "fieldname": "total", "fieldtype": "Currency", "width": 120},
    ]


def get_data(filters):
    from_date = filters.get("from_date") or get_first_day(getdate())
    to_date = filters.get("to_date") or get_last_day(getdate())

    invoices = frappe.db.sql(
        """
        SELECT
            si.name AS invoice_no,
            si.posting_date,
            si.customer,
            COALESCE(si.billing_address_gstin, c.gstin) AS gstin,
            sii.gst_hsn_code AS hsn,
            sii.taxable_value,
            sii.cgst_amount AS cgst,
            sii.sgst_amount AS sgst,
            sii.igst_amount AS igst,
            sii.amount AS total
        FROM `tabSales Invoice` si
        INNER JOIN `tabSales Invoice Item` sii ON sii.parent = si.name
        LEFT JOIN `tabCustomer` c ON c.name = si.customer
        WHERE si.docstatus = 1
          AND si.is_return = 0
          AND si.posting_date BETWEEN %(from_date)s AND %(to_date)s
        ORDER BY si.posting_date, si.name
        """,
        {"from_date": from_date, "to_date": to_date},
        as_dict=True,
    )

    return invoices
