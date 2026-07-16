import frappe
from frappe.utils import today, add_months, get_first_day, get_last_day


def setup_company(company_name=None):
    """Configure India GST company defaults. Callable via bench execute."""
    company_name = company_name or _get_default_company()
    if not company_name:
        company_name = _create_demo_company()

    _enable_india_localization(company_name)
    _configure_gst_settings(company_name)
    _setup_tax_templates(company_name)

    frappe.db.commit()
    return {"company": company_name, "status": "configured"}


def _get_default_company():
    return frappe.db.get_value("Company", {"is_group": 0}, "name")


def _create_demo_company():
    if frappe.db.exists("Company", "Tally MVP Demo"):
        return "Tally MVP Demo"

    doc = frappe.get_doc(
        {
            "doctype": "Company",
            "company_name": "Tally MVP Demo",
            "abbr": "TMVP",
            "default_currency": "INR",
            "country": "India",
            "enable_perpetual_inventory": 1,
        }
    )
    doc.insert(ignore_permissions=True)
    return doc.company_name


def _enable_india_localization(company_name):
    frappe.db.set_value("Company", company_name, "country", "India")
    frappe.db.set_value("Company", company_name, "default_currency", "INR")

    if not frappe.db.exists("GST Settings", {"company": company_name}):
        gst = frappe.get_doc(
            {
                "doctype": "GST Settings",
                "company": company_name,
                "enable_reverse_charge_in_sales": 0,
                "enable_reverse_charge_in_purchases": 0,
            }
        )
        gst.insert(ignore_permissions=True)


def _configure_gst_settings(company_name):
    company = frappe.get_doc("Company", company_name)
    if not company.gstin:
        company.gstin = "29AABCT1332L000"  # demo GSTIN
    company.save(ignore_permissions=True)


def _setup_tax_templates(company_name):
    """Ensure basic GST tax accounts exist via ERPNext India setup."""
    try:
        from erpnext.regional.india.setup import setup

        setup(company_name, patch=False)
    except Exception:
        frappe.log_error("India regional setup skipped — may already exist")
