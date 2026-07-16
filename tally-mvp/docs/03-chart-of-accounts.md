# Chart of Accounts Template (India GST — Regular)

Applied automatically by `tally_mvp.setup.india_gst` on install. Based on ERPNext India standard with MVP simplification.

## Account groups

| Group | Type | Parent |
|---|---|---|
| Application of Funds (Assets) | Asset | Root |
| Sources of Funds (Liabilities) | Liability | Root |
| Income | Income | Root |
| Expenses | Expense | Root |

## Key ledger accounts (MVP)

### Assets
- Cash
- Bank Accounts
- Accounts Receivable (Debtors)
- Stock In Hand
- Input CGST
- Input SGST
- Input IGST

### Liabilities
- Accounts Payable (Creditors)
- Output CGST
- Output SGST
- Output IGST
- Duties and Taxes

### Income
- Sales
- Service Income

### Expenses
- Cost of Goods Sold
- Administrative Expenses
- Freight and Forwarding

## GST ledger mapping

| Tax component | Account | Used on |
|---|---|---|
| CGST (output) | Output CGST | Sales Invoice |
| SGST (output) | Output SGST | Sales Invoice |
| IGST (output) | Output IGST | Sales Invoice |
| CGST (input) | Input CGST | Purchase Invoice |
| SGST (input) | Input SGST | Purchase Invoice |
| IGST (input) | Input IGST | Purchase Invoice |

## Opening balance migration

Use `scripts/migrate_opening_balances.py` with CSV format:

```csv
account,debit,credit,party_type,party
Cash,50000,0,,
Debtors - ABC Traders,0,0,Customer,ABC Traders
Creditors - XYZ Supplies,0,25000,Supplier,XYZ Supplies
Stock In Hand,120000,0,,
```

Rules:
- Debits and credits must balance per company
- Party optional; required for debtor/creditor sub-ledgers
- Run parallel with Tally for 30 days before cutover
