import frappe
from frappe import _


ROLE_PERMISSIONS = {
    "Tally Owner": {
        "Sales Invoice": ["read", "write", "create", "submit", "cancel"],
        "Payment Entry": ["read", "write", "create", "submit", "cancel"],
        "Customer": ["read", "write", "create"],
        "Item": ["read"],
        "Report": ["read"],
    },
    "Tally Accountant": {
        "Sales Invoice": ["read", "write", "create", "submit", "cancel", "amend"],
        "Purchase Invoice": ["read", "write", "create", "submit", "cancel", "amend"],
        "Payment Entry": ["read", "write", "create", "submit", "cancel", "amend"],
        "Journal Entry": ["read", "write", "create", "submit", "cancel"],
        "Customer": ["read", "write", "create"],
        "Supplier": ["read", "write", "create"],
        "Item": ["read", "write", "create"],
        "Report": ["read"],
    },
    "Tally Storekeeper": {
        "Delivery Note": ["read", "write", "create", "submit", "cancel"],
        "Purchase Receipt": ["read", "write", "create", "submit", "cancel"],
        "Stock Entry": ["read", "write", "create", "submit", "cancel"],
        "Item": ["read", "write", "create"],
        "Warehouse": ["read", "write", "create"],
        "Report": ["read"],
    },
}


def setup_roles():
    for role_name, perms in ROLE_PERMISSIONS.items():
        if not frappe.db.exists("Role", role_name):
            doc = frappe.get_doc({"doctype": "Role", "role_name": role_name, "desk_access": 1})
            doc.insert(ignore_permissions=True)

        for doctype, rights in perms.items():
            if doctype == "Report":
                continue
            _ensure_role_permission(role_name, doctype, rights)


def _ensure_role_permission(role_name, doctype, rights):
    existing = frappe.db.exists(
        "Custom DocPerm",
        {"parent": doctype, "role": role_name, "permlevel": 0},
    )
    if existing:
        return

    parent = frappe.get_doc("DocType", doctype)
    parent.append(
        "permissions",
        {
            "role": role_name,
            "read": 1 if "read" in rights else 0,
            "write": 1 if "write" in rights else 0,
            "create": 1 if "create" in rights else 0,
            "submit": 1 if "submit" in rights else 0,
            "cancel": 1 if "cancel" in rights else 0,
            "amend": 1 if "amend" in rights else 0,
        },
    )
    parent.save(ignore_permissions=True)


WORKSPACES = [
    {
        "name": "Tally Owner",
        "title": "Tally Owner",
        "icon": "shop",
        "links": [
            {"type": "Page", "label": "Dashboard", "link_to": "tally-dashboard"},
            {"type": "DocType", "label": "Sales Invoice", "link_to": "Sales Invoice"},
            {"type": "DocType", "label": "Payment Entry", "link_to": "Payment Entry"},
            {"type": "DocType", "label": "Customer", "link_to": "Customer"},
            {"type": "Report", "label": "Profit and Loss", "link_to": "Profit and Loss Statement"},
            {"type": "Report", "label": "Balance Sheet", "link_to": "Balance Sheet"},
            {"type": "Report", "label": "Accounts Receivable", "link_to": "Accounts Receivable"},
        ],
        "roles": ["Tally Owner"],
    },
    {
        "name": "Tally Accountant",
        "title": "Tally Accountant",
        "icon": "accounting",
        "links": [
            {"type": "Page", "label": "Dashboard", "link_to": "tally-dashboard"},
            {"type": "DocType", "label": "Sales Invoice", "link_to": "Sales Invoice"},
            {"type": "DocType", "label": "Purchase Invoice", "link_to": "Purchase Invoice"},
            {"type": "DocType", "label": "Payment Entry", "link_to": "Payment Entry"},
            {"type": "DocType", "label": "Journal Entry", "link_to": "Journal Entry"},
            {"type": "Report", "label": "Trial Balance", "link_to": "Trial Balance"},
            {"type": "Report", "label": "GSTR-1 Export", "link_to": "GSTR-1 Export"},
            {"type": "Report", "label": "GSTR-3B Export", "link_to": "GSTR-3B Export"},
        ],
        "roles": ["Tally Accountant"],
    },
    {
        "name": "Tally Storekeeper",
        "title": "Tally Storekeeper",
        "icon": "stock",
        "links": [
            {"type": "DocType", "label": "Item", "link_to": "Item"},
            {"type": "DocType", "label": "Delivery Note", "link_to": "Delivery Note"},
            {"type": "DocType", "label": "Purchase Receipt", "link_to": "Purchase Receipt"},
            {"type": "DocType", "label": "Stock Entry", "link_to": "Stock Entry"},
            {"type": "Report", "label": "Stock Balance", "link_to": "Stock Balance"},
            {"type": "Report", "label": "Stock Ledger", "link_to": "Stock Ledger"},
        ],
        "roles": ["Tally Storekeeper"],
    },
]


def setup_workspaces():
    for ws in WORKSPACES:
        if frappe.db.exists("Workspace", ws["name"]):
            continue

        doc = frappe.get_doc(
            {
                "doctype": "Workspace",
                "name": ws["name"],
                "label": ws["title"],
                "title": ws["title"],
                "module": "Tally MVP",
                "icon": ws["icon"],
                "public": 0,
                "is_hidden": 0,
            }
        )

        for link in ws["links"]:
            doc.append(
                "links",
                {
                    "type": link["type"],
                    "label": link["label"],
                    "link_to": link["link_to"],
                    "onboard": 0,
                },
            )

        for role in ws["roles"]:
            doc.append("roles", {"role": role})

        doc.insert(ignore_permissions=True)


def setup_print_formats():
    if frappe.db.exists("Print Format", "Tally GST Invoice"):
        return

    html = """
<div class="print-format">
  <h2>{{ doc.company }}</h2>
  <p><b>TAX INVOICE</b></p>
  <p>Invoice: {{ doc.name }} | Date: {{ doc.posting_date }}</p>
  <p>Customer: {{ doc.customer_name }} | GSTIN: {{ doc.billing_address_gstin or '-' }}</p>
  <table class="table table-bordered">
    <thead>
      <tr><th>Item</th><th>HSN</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
    </thead>
    <tbody>
      {% for row in doc.items %}
      <tr>
        <td>{{ row.item_name }}</td>
        <td>{{ row.gst_hsn_code or '-' }}</td>
        <td>{{ row.qty }}</td>
        <td>{{ row.rate }}</td>
        <td>{{ row.amount }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
  <p>Taxes: CGST {{ doc.total_taxes_and_charges }}</p>
  <p><b>Grand Total: {{ doc.grand_total }}</b></p>
</div>
"""

    doc = frappe.get_doc(
        {
            "doctype": "Print Format",
            "name": "Tally GST Invoice",
            "doc_type": "Sales Invoice",
            "module": "Tally MVP",
            "standard": "No",
            "custom_format": 1,
            "html": html,
        }
    )
    doc.insert(ignore_permissions=True)
