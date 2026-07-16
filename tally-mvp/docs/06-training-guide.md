# Training Guide — Tally MVP

**Duration:** 1–2 days  
**Audience:** Business owners, accountants, storekeepers

## Day 1 — Owner & Accountant (4 hours)

### Session 1: Getting started (45 min)

1. Log in at http://localhost:8080
2. Select workspace by role:
   - **Tally Owner** — daily operations
   - **Tally Accountant** — full books
3. Review Tally Dashboard tiles: sales, dues, cash, low stock

### Session 2: Sales & collections (60 min)

1. **Create customer:** Selling → Customer → name, GSTIN, state
2. **Create item:** Stock → Item → HSN, UOM, GST rate
3. **Sales invoice:**
   - Selling → Sales Invoice → New
   - Add items, verify tax breakup
   - Save → Submit
   - Print / PDF share
4. **Record payment:**
   - Accounting → Payment Entry → Receive
   - Link to invoice → Submit

### Session 3: Purchases & payables (45 min)

1. Create supplier with GSTIN
2. Purchase Receipt (goods in) → Purchase Invoice
3. Payment Entry (Pay) against purchase invoice

### Session 4: Reports (30 min)

1. Trial Balance, P&L, Balance Sheet
2. Accounts Receivable / Payable ageing
3. GSTR-1 Export and GSTR-3B Export — download CSV for CA review

## Day 2 — Storekeeper (2 hours)

### Session 1: Inventory basics (60 min)

1. View Stock Balance and Stock Ledger
2. Delivery Note from Sales Order / Invoice
3. Stock Entry — Material Receipt / Issue

### Session 2: Daily routine (60 min)

1. Morning: check low stock on dashboard
2. Process outbound delivery notes
3. Record purchase receipts
4. End of day: stock summary vs physical count

## Quick reference card

| Task | Path |
|---|---|
| New sales invoice | Tally Owner → Sales Invoice → New |
| Record customer payment | Tally Owner → Payment Entry → Receive |
| Check stock | Tally Storekeeper → Stock Balance |
| GST export | Tally Accountant → GSTR-1 Export |
| Financial reports | Tally Owner → Trial Balance / P&L |

## Common mistakes

1. **Forgot to Submit** — draft invoices don't post to GL or stock
2. **Wrong party state** — causes incorrect CGST/SGST vs IGST
3. **Missing HSN** — GST export validation fails
4. **Payment not linked** — outstanding shows incorrectly

## Support escalation

1. Check [UAT checklist](05-uat-checklist.md) for expected behaviour
2. Review ERPNext docs: https://docs.erpnext.com
3. Run `make logs` for container errors
4. Escalate to tech lead with screenshot + voucher number
