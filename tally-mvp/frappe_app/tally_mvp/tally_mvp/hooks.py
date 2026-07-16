app_name = "tally_mvp"
app_title = "Tally MVP"
app_publisher = "Tally MVP Team"
app_description = "Tally-like MVP for ERPNext — simplified workspaces, GST exports, India setup"
app_email = "dev@example.com"
app_license = "MIT"
required_apps = ["erpnext"]

after_install = "tally_mvp.setup.install.after_install"

fixtures = [
    {
        "dt": "Role",
        "filters": [["name", "in", ["Tally Owner", "Tally Accountant", "Tally Storekeeper"]]],
    },
    {
        "dt": "Workspace",
        "filters": [["module", "=", "Tally MVP"]],
    },
    {
        "dt": "Custom Field",
        "filters": [["module", "=", "Tally MVP"]],
    },
    {
        "dt": "Print Format",
        "filters": [["module", "=", "Tally MVP"]],
    },
]

add_to_apps_screen = [
    {
        "name": "tally_mvp",
        "logo": "/assets/tally_mvp/images/tally_mvp.svg",
        "title": "Tally MVP",
        "route": "/app/tally-dashboard",
        "has_permission": "tally_mvp.tally_mvp.page.tally_dashboard.tally_dashboard.has_permission",
    }
]

doc_events = {
    "Sales Invoice": {
        "validate": "tally_mvp.overrides.sales_invoice.validate_gst_fields",
    },
}

boot_session = "tally_mvp.boot.boot_session"
