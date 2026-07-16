frappe.pages['tally-dashboard'].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({
    parent: wrapper,
    title: 'Tally Dashboard',
    single_column: true,
  });

  frappe.tally_dashboard.make(page);
};

frappe.tally_dashboard = {
  make(page) {
    const body = $(page.body);
    body.html('<div class="tally-dashboard-loading text-muted">Loading...</div>');

    frappe.call({
      method: 'tally_mvp.tally_mvp.page.tally_dashboard.tally_dashboard.get_dashboard_data',
      callback(r) {
        if (!r.message) return;
        const d = r.message;
        body.html(`
          <div class="row" style="margin-top: 1rem;">
            <div class="col-sm-3"><div class="card"><div class="card-body">
              <h6>Today's Sales</h6><h3>${format_currency(d.today_sales)}</h3>
            </div></div></div>
            <div class="col-sm-3"><div class="card"><div class="card-body">
              <h6>Outstanding Receivables</h6><h3>${format_currency(d.outstanding_receivables)}</h3>
            </div></div></div>
            <div class="col-sm-3"><div class="card"><div class="card-body">
              <h6>Cash & Bank</h6><h3>${format_currency(d.cash_and_bank)}</h3>
            </div></div></div>
            <div class="col-sm-3"><div class="card"><div class="card-body">
              <h6>Low Stock Items</h6><h3>${(d.low_stock_items || []).length}</h3>
            </div></div></div>
          </div>
          <div class="card" style="margin-top: 1rem;">
            <div class="card-header">Low Stock</div>
            <div class="card-body">
              <table class="table table-sm">
                <thead><tr><th>Item</th><th>Qty</th><th>Reorder</th></tr></thead>
                <tbody>
                  ${(d.low_stock_items || []).map(i => `
                    <tr><td>${i.item_name}</td><td>${i.actual_qty}</td><td>${i.reorder_level}</td></tr>
                  `).join('') || '<tr><td colspan="3">No low stock items</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        `);
      },
    });
  },
};

function format_currency(val) {
  return frappe.format(val, { fieldtype: 'Currency' });
}
