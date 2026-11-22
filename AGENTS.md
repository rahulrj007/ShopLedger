# ShopLedger

## Stack
- Node.js with CommonJS modules; Express 4 and body-parser handle HTTP requests.
- Browser client is HTML, CSS, and JavaScript served from `public/`.
- Application data is stored in `data/db.json` through `lib/store.js`.

## Module map
- `routes/customers.js` — customer and settlement API routes.
- `routes/orders.js` — order listing, lookup, creation, and cancellation routes.
- `routes/products.js` — product listing and active coupon routes.
- `routes/reports.js` — dashboard, GST reconciliation, pricing preview, and admin export routes.
- `lib/coupons.js` — coupon normalization, validation, discount calculation, and active coupon listing.
- `lib/dates.js` — date formatting, date-key normalization, and fiscal-year calculation.
- `lib/inventory.js` — product lookup, sellable stock, stock checks, reservation/release, and summaries.
- `lib/invoice.js` — invoice figures and printable HTML invoice rendering.
- `lib/ledger.js` — customer balances, khata debits/reversals, and settlements.
- `lib/orders.js` — order creation, lookup, cancellation, and filtering.
- `lib/pricing.js` — subtotal, coupon discount, and checkout totals.
- `lib/reports.js` — dashboard summary and invoice-to-ledger GST reconciliation.
- `lib/store.js` — reads, writes, and appends audit entries in `data/db.json`.
- `lib/tax.js` — GST rate lookup and CGST/SGST split.

## Commands
- Start the app: `npm start` (runs `node server.js`).
- Run tests: `node --test` (Node.js built-in test runner).

## Rules
1. Write characterization tests before changing behaviour.
2. Change only the module(s) the ticket is about.
3. Tests never read or write `data/db.json`; they use in-memory data.
4. Add no dependencies.
5. Make the smallest fix that works.

## Current ticket
Invoice total and GST breakdown do not match what the customer was billed. Allowed files: `lib/invoice.js` (`lib/tax.js` only if truly needed).
