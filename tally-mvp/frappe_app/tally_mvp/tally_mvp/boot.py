import frappe


def boot_session(bootinfo):
    bootinfo.tally_mvp = {
        "version": "0.1.0",
        "default_workspace": "Tally Owner",
        "dashboard_route": "/app/tally-dashboard",
    }
