# MVP Report List

## Financial reports (ERPNext standard)

| Report | Tally equivalent | Role access | MVP |
|---|---|---|---|
| Trial Balance | Trial Balance | Accountant, Owner | Yes |
| Profit and Loss | P&L Account | Owner, Accountant | Yes |
| Balance Sheet | Balance Sheet | Owner, Accountant | Yes |
| General Ledger | Ledger | Accountant | Yes |
| Accounts Receivable | Bills Receivable | Owner, Accountant | Yes |
| Accounts Payable | Bills Payable | Owner, Accountant | Yes |

## Inventory reports

| Report | Tally equivalent | Role access | MVP |
|---|---|---|---|
| Stock Balance | Stock Summary | Storekeeper, Owner | Yes |
| Stock Ledger | Stock Ledger | Storekeeper, Accountant | Yes |

## GST reports (custom — tally_mvp app)

| Report | Purpose | Export format | MVP |
|---|---|---|---|
| GSTR-1 Export | Outward supplies for filing | CSV / Excel | Yes |
| GSTR-3B Export | Summary return preparation | CSV / Excel | Yes |

## Dashboard (Tally Dashboard page)

| Tile | Source | MVP |
|---|---|---|
| Today's Sales | Sales Invoice (today) | Yes |
| Outstanding Receivables | AR summary | Yes |
| Cash & Bank Balance | GL accounts | Yes |
| Low Stock Items | Stock Balance (< reorder) | Yes |

## Deferred to v2

- 400+ Tally report variants
- Ratio analysis, cost centre P&L
- GSTR-2B reconciliation
- E-invoice JSON export
- Manufacturing / BOM reports
