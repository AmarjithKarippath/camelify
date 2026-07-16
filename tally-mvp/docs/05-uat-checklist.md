# UAT Checklist — Tally MVP

Run after `make setup` and `make seed`. Parallel-run with Tally/Excel for 2–4 weeks before go-live.

## Environment

- [ ] ERPNext accessible at http://localhost:8080
- [ ] `tally_mvp` app installed (`bench --site frontend list-apps`)
- [ ] Company country = India, currency = INR
- [ ] GSTIN configured on company
- [ ] Demo data loaded (`make seed`)

## Accounting

| # | Test case | Steps | Expected | Pass |
|---|---|---|---|---|
| A1 | Create sales invoice | Selling → Sales Invoice → add customer, 2 items, submit | Invoice submitted, GL posted | [ ] |
| A2 | GST breakup intra-state | Customer same state as company | CGST + SGST on lines | [ ] |
| A3 | GST breakup inter-state | Customer different state | IGST on lines | [ ] |
| A4 | Record payment | Payment Entry → receive from customer | Invoice outstanding reduced | [ ] |
| A5 | Purchase invoice | Buying → Purchase Invoice → submit | Payable + stock/COGS posted | [ ] |
| A6 | Credit note | Sales Invoice with is_return=1 | Reverses revenue and tax | [ ] |

## Inventory

| # | Test case | Steps | Expected | Pass |
|---|---|---|---|---|
| I1 | Stock reduces on sale | Submit sales invoice with stock item | Stock Balance decreases | [ ] |
| I2 | Stock increases on purchase | Submit purchase receipt + invoice | Stock Balance increases | [ ] |
| I3 | Stock transfer | Stock Entry → Material Transfer | Qty moves between warehouses | [ ] |
| I4 | Low stock alert | Item below reorder level | Shows on Tally Dashboard | [ ] |

## GST exports

| # | Test case | Steps | Expected | Pass |
|---|---|---|---|---|
| G1 | GSTR-1 export | Run GSTR-1 Export for current month | CSV rows match submitted invoices | [ ] |
| G2 | GSTR-3B export | Run GSTR-3B Export for current month | Tax totals match GL tax accounts | [ ] |
| G3 | CA sign-off | Accountant reviews exports | Figures approved for portal upload | [ ] |

## Financial reports

| # | Test case | Expected | Pass |
|---|---|---|---|
| R1 | Trial Balance | Total debit = total credit | [ ] |
| R2 | P&L | Matches sum of income/expense invoices | [ ] |
| R3 | Balance Sheet | Assets = Liabilities + Equity | [ ] |

## Roles & permissions

| # | Role | Can access | Cannot access | Pass |
|---|---|---|---|---|
| P1 | Tally Owner | Dashboard, invoices, payments, reports | Stock Entry config | [ ] |
| P2 | Tally Accountant | All accounting, GST reports | — | [ ] |
| P3 | Tally Storekeeper | Items, stock, delivery notes | GST reports, P&L | [ ] |

## Migration (if cutover from Tally)

| # | Test case | Pass |
|---|---|---|
| M1 | Opening balances imported via `make migrate` | [ ] |
| M2 | Customer/supplier masters imported | [ ] |
| M3 | Item masters with HSN imported | [ ] |
| M4 | Parallel run: 10 transactions match Tally | [ ] |

## Sign-off

| Role | Name | Date | Signature |
|---|---|---|---|
| Business Owner | | | |
| Accountant (CA) | | | |
| Tech Lead | | | |
