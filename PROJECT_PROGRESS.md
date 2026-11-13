# Cairn Project Progress and Engineering Audit

Audit date: 2026-11-13

## Executive assessment

The requested marketplace priorities are substantially implemented as a local
prototype. The backend has vendor/product inventory tables, ten synthetic
Bengaluru vendors, geolocation helpers, ranked allocation, order/vendor
endpoints, in-app notifications, SSE, SLA instances, and buyer/seller UI.

**Lead-engineer decision:** approve for continued demo development, but do not
approve for production, real vendor onboarding, or real orders yet. Passing
tests and a successful frontend build do not cover the critical identity,
governance, transaction, and reallocation gaps listed below. All seeded vendor
data is synthetic (`is_demo=1`); the backend has no authenticated buyer or
vendor identity.

## Priority status

| Priority | Status | Evidence and remaining work |
|---|---|---|
| 0. Audit and progress record | Done | This document records implementation evidence, validation, blockers, and approval criteria. |
| 1-2. Vendor/store/inventory schema and 10 Bengaluru vendors | Prototype done | [`backend/marketplace/store.py`](./backend/marketplace/store.py) creates vendor, vendor-product, reservation, and allocation tables and seeds 10 synthetic vendors when the vendor table is empty. No versioned migration framework or real vendor onboarding exists. |
| 3. Geolocation and service areas | Partial | [`backend/marketplace/geo.py`](./backend/marketplace/geo.py) implements haversine, locality lookup, and radius checks. The browser location UI exists, but buyer offer/allocation calls pass locality only. Custom locations are assigned fixed New Delhi coordinates in [`src/components/LocationModal.jsx`](./src/components/LocationModal.jsx); coordinates need validation and end-to-end wiring. |
| 4. Vendor allocation | Prototype done; correctness fixes required | [`backend/marketplace/allocation.py`](./backend/marketplace/allocation.py) filters, ranks, and atomically decrements stock when reserving. Price bounds influence scoring but are not enforced as eligibility filters; the stored `is_open` flag is not checked; reservation, allocation, order persistence, and notification are not one transaction. |
| 5-8. Allocation, vendor decisions, buyer order view | Partial | Routes exist in [`backend/main.py`](./backend/main.py), with lifecycle helpers in [`backend/marketplace/service.py`](./backend/marketplace/service.py). Buyer ownership is not enforced. Rejection/reallocation can leave the order status inconsistent and may select the rejecting vendor again. |
| 6/12. Notifications and SSE | Demo flow wired | Persisted buyer/vendor notifications, scoped SSE updates, and 30-second polling fallback now refresh both order inboxes; sound is opt-in in the browser. Delivery is still process-local, has no replay, and is not authenticated or a background push service. |
| 11. Order acknowledgement/dispatch SLAs | Partial | Allocation creates acknowledgement and dispatch SLA instances; breach checking is an endpoint, not a supervised scheduler. No focused test verifies expiry, breach, and escalation behavior end to end. |
| 14. Merchant inbox and buyer vendor cards | Demo flow wired | [`src/components/merchant/VendorOrderInbox.jsx`](./src/components/merchant/VendorOrderInbox.jsx) now filters and refreshes store orders, supports acknowledge/accept/prepare/reject/reassign/price proposal/shipment confirmation, and requires a carrier plus tracking reference. Buyer order status and persisted notifications refresh from the same lifecycle events. The selectable store identity remains demo-only. |
| 15. Backend tests for A/B/C/E/H | Partial coverage; current suite green | [`backend/tests/test_marketplace.py`](./backend/tests/test_marketplace.py) covers allocation, buyer/vendor notifications, scoped SSE input, accept/prepare/dispatch, price proposals, and reject/reallocate/accept. These are isolated SQLite integration tests, not concurrent-load or production-database coverage. |
| 13. Payments and trust receipts | Sandbox prototype done | [`backend/marketplace/payments.py`](./backend/marketplace/payments.py) provides a `PaymentProvider` interface with a deterministic sandbox adapter (create/confirm/refund, persisted `payments` table, updates `orders.payment_status`). [`backend/marketplace/receipts.py`](./backend/marketplace/receipts.py) signs canonical order receipts with HMAC-SHA256 and verifies them. Endpoints under `/api/orders/{id}/payment/*` and `/api/orders/{id}/receipt`. No real payment provider, webhook verification, or refund policy is connected. |

## Approval-blocking findings

1. **Identity and object authorization are not production-safe.** Vendor
   identity is a caller-selected `X-Cairn-Vendor-Id` header, not a verified
   principal. Buyer IDs are accepted from request bodies or query parameters.
   Order detail, notifications, and SSE scopes do not enforce ownership.
   Introduce authenticated buyer/vendor principals and enforce authorization
   on every read and mutation before production.

2. **The marketplace allocation path bypasses governance.** The buyer UI calls
   `/api/orders/allocate` directly. That route reserves stock and writes an
   allocated order without invoking the deterministic governance engine or
   checking approval policy. Route all purchase-intent allocations through a
   governed workflow; distinguish browsing/quotes from an order that is
   actually allocated.

3. **Marketplace writes still need a transaction boundary.** The demo flow now
   excludes previously rejecting vendors, updates the buyer order to the new
   vendor, and tests reject -> reallocate -> accept. Reservation, allocation,
   legacy order persistence, SLA creation, and notifications are still separate
   writes and are not an atomic/idempotent production workflow.

4. **Allocation persistence is not atomic or idempotent.** Stock reservation,
   allocation rows, legacy order persistence, SLA rows, and notifications are
   written separately. The route logs order-persistence failure but still
   returns the allocation result. A repeated request can reserve stock again,
   and partial failure can strand reservations or create inconsistent views.
   Add idempotency, transactional boundaries/compensation, and failure-path
   tests before relying on inventory.

5. **Location is not consistently used or validated.** The buyer UI sends a
   locality to vendor lookup/allocation even when precise GPS coordinates are
   available. Custom location entry uses fixed coordinates unrelated to the
   entered place. Validate coordinate ranges and ensure the same resolved
   location is used for discovery and allocation.

6. **Notifications, SSE, and SLA monitoring are prototype-grade.** The
   `/api/events` endpoint rejects the global `all` scope, but scoped
   subscriptions and notification reads still do not authenticate ownership.
   The event bus is process-local and has no replay or cross-worker delivery;
   sound requires an explicit browser opt-in and an open app tab. SLA breach
   checks are manually triggered. Add principal-bound scopes, durable delivery,
   browser push if needed, and scheduled SLA processing before claiming
   production-grade notifications.

7. **PostgreSQL compatibility is not established.** Although
   `DATABASE_URL` selects a non-SQLite SQLAlchemy engine, current data access
   includes SQLite-specific SQL such as `INSERT OR REPLACE` and
   `AUTOINCREMENT`. Do not describe a PostgreSQL cutover as zero-code until
   dialect-compatible migrations and integration tests exist.

## Validation performed

- `python -m pytest backend/tests -q`: **37 passed**. The suite uses isolated
  SQLite test databases; the pre-existing development database was not reset.
- `npm run build`: **passed**.
- `npm run lint`: exited successfully with warnings (including existing
  unused-import and React effect/purity warnings).
- These checks establish a working prototype only; they do not prove
  authorization, concurrent allocation correctness, production migration
  behavior, or a full buyer/vendor end-to-end purchase flow.

## Recommended next work, in order

1. Add authenticated identity and enforce buyer/vendor ownership across all
   marketplace endpoints, including notification reads and SSE.
2. Route purchase allocations through the governance engine and enforce its
   approval policy.
3. Make allocation, order, reservation, SLA, and notification writes
   transactional and idempotent under retry/concurrency.
4. Wire validated buyer coordinates through the UI and backend; remove the
   fixed-coordinate custom-location behavior.
5. Replace process-local SSE with authenticated durable delivery and scheduled
   SLA processing; add background push/email only if the product requires it.
6. Add migration and PostgreSQL integration coverage, plus browser E2E tests
   for buyer allocation and the full vendor lifecycle.
7. Only then consider payment integration and real vendor onboarding.

## Demo and deployment notes

- All ten seeded vendors and their inventory are synthetic.
- Payments run through a labelled sandbox adapter only; no real gateway,
  webhook verification, or settlement exists. Email, SMS, and WhatsApp
  delivery are not connected.
- Do not use the development vendor-ID header as authentication.
- No production database migration has been verified.

## Merchant and buyer synchronization update

- The local merchant lifecycle is `allocated -> acknowledged/accepted ->
  preparing -> dispatched`; rejection releases stock and reallocates while
  excluding prior rejecting vendors. Dispatch requires a carrier name and
  tracking reference, which is stored for the buyer order view.
- Buyer and vendor feeds use persisted notifications, scoped SSE, and periodic
  refresh. New order, acceptance, preparation, rejection/reassignment, price,
  and shipment changes update the corresponding screen. Price proposals can be
  approved or rejected from the buyer notification.
- Browser sound is opt-in and plays a preview when enabled to satisfy browser
  audio-gesture policies. It is not a notification while the app is closed and
  does not deliver email, SMS, or push.
- Amazon Seller Central's public workflow emphasizes a seller operations hub
  for orders (including pending orders), inventory/fulfillment, performance,
  and account alerts. Cairn follows those operational principles without
  copying its UI: [Seller Central overview](https://sell.amazon.com/tools/seller-central)
  and [Fulfillment by Amazon](https://sell.amazon.com/fulfillment-by-amazon).
- This remains a demo: vendor selection is not authenticated identity, order
  ownership is not enforced consistently, and notifications/SSE are not
  production-safe for real buyers or merchants.
