import csv
import os

import frappe
from frappe.utils import flt, today


def run(csv_path=None):
    """Import opening balances via Journal Entry."""
    from tally_mvp.scripts.migrate_masters import _data_dir

    path = csv_path or os.path.join(_data_dir(), "sample_opening_balances.csv")

    if not os.path.exists(path):
        return {"error": f"File not found: {path}"}

    company = frappe.db.get_value("Company", {"is_group": 0}, "name")
    if not company:
        return {"error": "No company found. Run setup first."}

    rows = list(csv.DictReader(open(path, newline="", encoding="utf-8")))
    if not rows:
        return {"error": "Empty CSV"}

    total_debit = sum(flt(r.get("debit")) for r in rows)
    total_credit = sum(flt(r.get("credit")) for r in rows)
    if abs(total_debit - total_credit) > 0.01:
        return {
            "error": "Debits and credits must balance",
            "debit": total_debit,
            "credit": total_credit,
        }

    je = frappe.get_doc(
        {
            "doctype": "Journal Entry",
            "voucher_type": "Opening Entry",
            "company": company,
            "posting_date": today(),
            "accounts": [],
        }
    )

    for row in rows:
        account = row["account"].strip()
        if not frappe.db.exists("Account", account):
            _ensure_account(account, company)

        entry = {
            "account": account,
            "debit_in_account_currency": flt(row.get("debit")),
            "credit_in_account_currency": flt(row.get("credit")),
        }

        party_type = row.get("party_type")
        party = row.get("party")
        if party_type and party:
            entry["party_type"] = party_type
            entry["party"] = party.strip()

        je.append("accounts", entry)

    je.insert(ignore_permissions=True)
    je.submit()

    frappe.db.commit()
    return {"journal_entry": je.name, "lines": len(rows)}


def _ensure_account(account_name, company):
    """Create a simple ledger under Application of Funds if missing."""
    parent = frappe.db.get_value(
        "Account",
        {"company": company, "account_name": "Current Assets", "is_group": 1},
        "name",
    ) or frappe.db.get_value(
        "Account", {"company": company, "is_group": 1, "root_type": "Asset"}, "name"
    )

    doc = frappe.get_doc(
        {
            "doctype": "Account",
            "account_name": account_name,
            "company": company,
            "parent_account": parent,
            "is_group": 0,
        }
    )
    doc.insert(ignore_permissions=True)
