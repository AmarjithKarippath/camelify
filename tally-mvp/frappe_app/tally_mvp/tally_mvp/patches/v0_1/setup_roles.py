import frappe
from tally_mvp.setup.install import setup_roles, setup_workspaces, setup_print_formats


def execute():
    setup_roles()
    setup_workspaces()
    setup_print_formats()
    frappe.db.commit()
