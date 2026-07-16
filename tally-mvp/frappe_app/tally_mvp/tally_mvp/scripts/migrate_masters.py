import csv
import os

import frappe
from frappe.utils import get_site_path


def run(csv_path=None):
    """Import customers, suppliers, and items from CSV files in data/."""
    data_dir = _data_dir()
    results = {}

    for filename, importer in [
        ("sample_customers.csv", _import_customers),
        ("sample_items.csv", _import_items),
        ("sample_suppliers.csv", _import_suppliers),
    ]:
        path = csv_path or os.path.join(data_dir, filename)
        if os.path.exists(path):
            results[filename] = importer(path)
        else:
            results[filename] = {"skipped": True, "reason": "file not found"}

    frappe.db.commit()
    return results


def _data_dir():
    candidates = [
        "/home/frappe/tally-mvp-data",
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "..", "data"),
        os.path.join(os.path.dirname(__file__), "..", "..", "data"),
    ]
    for path in candidates:
        if os.path.isdir(path):
            return path
    return candidates[0]


def _import_customers(path):
    count = 0
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            name = row["customer_name"].strip()
            if frappe.db.exists("Customer", name):
                continue
            doc = frappe.get_doc(
                {
                    "doctype": "Customer",
                    "customer_name": name,
                    "customer_type": row.get("customer_type", "Company"),
                    "gstin": row.get("gstin") or None,
                    "customer_group": row.get("customer_group", "All Customer Groups"),
                    "territory": row.get("territory", "All Territories"),
                }
            )
            doc.insert(ignore_permissions=True)
            count += 1
    return {"imported": count}


def _import_suppliers(path):
    count = 0
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            name = row["supplier_name"].strip()
            if frappe.db.exists("Supplier", name):
                continue
            doc = frappe.get_doc(
                {
                    "doctype": "Supplier",
                    "supplier_name": name,
                    "supplier_type": row.get("supplier_type", "Company"),
                    "gstin": row.get("gstin") or None,
                    "supplier_group": row.get("supplier_group", "All Supplier Groups"),
                }
            )
            doc.insert(ignore_permissions=True)
            count += 1
    return {"imported": count}


def _import_items(path):
    company = frappe.db.get_value("Company", {"is_group": 0}, "name")
    count = 0
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            code = row["item_code"].strip()
            if frappe.db.exists("Item", code):
                continue
            doc = frappe.get_doc(
                {
                    "doctype": "Item",
                    "item_code": code,
                    "item_name": row.get("item_name", code),
                    "item_group": row.get("item_group", "Products"),
                    "stock_uom": row.get("stock_uom", "Nos"),
                    "is_stock_item": int(row.get("is_stock_item", 1)),
                    "gst_hsn_code": row.get("hsn") or None,
                    "reorder_level": float(row.get("reorder_level", 0) or 0),
                }
            )
            doc.insert(ignore_permissions=True)
            count += 1
    return {"imported": count, "company": company}
