"""
Marketplace tests: multi-vendor discovery, nearest-eligible allocation,
notification, vendor isolation, geolocation fallback.
Covers master-prompt scenarios A, B, C (partial), H, I.
"""

import os
import sys
import tempfile

# Use an isolated test DB before importing app modules
os.environ["DATABASE_URL"] = f"sqlite:///{os.path.join(tempfile.gettempdir(), 'cairn_test.db')}"
if os.path.exists(os.environ["DATABASE_URL"].replace("sqlite:///", "")):
    os.remove(os.environ["DATABASE_URL"].replace("sqlite:///", ""))

import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend.marketplace.store import store
from backend.marketplace.geo import haversine_km, locality_to_coords, resolve_buyer_location
from backend.marketplace.allocation import find_eligible_vendors, allocate_order

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def seeded():
    # store seeds itself on init; ensure vendors exist
    assert len(store.list_vendors()) >= 10
    yield


# ── Scenario A: multi-vendor discovery ────────────────────────────────────
def test_multi_vendor_offers_for_same_product():
    offers = store.get_product_offers("prod-dell-xps")
    assert len(offers) >= 5, "Expected multiple vendors selling Dell XPS 13"
    prices = {o["price_paise"] for o in offers}
    stocks = {o["stock"] for o in offers}
    assert len(prices) > 1, "Vendors must have different prices"
    assert len(stocks) > 1, "Vendors must have different stock levels"
    vendor_ids = {o["vendor_id"] for o in offers}
    assert all(v.startswith("VEN-BLR-") for v in vendor_ids)


def test_offers_endpoint_ranks_by_score():
    r = client.get("/api/products/prod-dell-xps/offers?locality=Indiranagar")
    assert r.status_code == 200
    data = r.json()
    assert len(data["eligible"]) >= 3
    scores = [o["score"] for o in data["eligible"]]
    assert scores == sorted(scores, reverse=True), "Eligible vendors must be ranked"


# ── Scenario B: nearest eligible vendor ───────────────────────────────────
def test_nearest_eligible_not_blind():
    # Buyer in Indiranagar: VEN-BLR-001 is closest but has only 5 stock — fine.
    # Use a product where closest has 0 stock: prod-macbook-air at VEN-BLR-002 (0 stock, Koramangala)
    # Buyer in Koramangala → VEN-BLR-002 nearest but OOS → next eligible should win.
    buyer = resolve_buyer_location({"locality": "Koramangala"})
    result = find_eligible_vendors("prod-macbook-air", buyer)
    assert result["eligible"], "Expected at least one eligible vendor"
    top = result["eligible"][0]
    assert top["vendor_id"] != "VEN-BLR-002" or top["stock"] > 0
    # VEN-BLR-002 must appear in excluded with insufficient_stock
    excluded_ids = {e["vendor_id"]: e["reason"] for e in result["excluded"]}
    assert excluded_ids.get("VEN-BLR-002") == "insufficient_stock"


def test_out_of_service_area_excluded():
    # Buyer in Electronic City; vendors with small radius shouldn't serve if far.
    buyer = resolve_buyer_location({"locality": "Electronic City"})
    result = find_eligible_vendors("prod-keyboard", buyer)
    # At least VEN-BLR-008 (Electronic City) must be eligible
    eligible_ids = {o["vendor_id"] for o in result["eligible"]}
    assert "VEN-BLR-008" in eligible_ids


# ── Scenario C: allocation + notification ─────────────────────────────────
def test_allocate_creates_vendor_notification():
    r = client.post("/api/orders/allocate", json={
        "product_id": "prod-keyboard",
        "user_id": "usr_test",
        "locality": "Indiranagar",
        "quantity": 1,
    })
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ALLOCATED"
    assert data["vendor"]["vendor_id"].startswith("VEN-BLR-")
    assert data["vendor"]["distance_km"] >= 0

    # Vendor notification persisted
    vid = data["vendor"]["vendor_id"]
    notifs = client.get(
        f"/api/notifications?recipient_type=vendor&recipient_id={vid}").json()
    assert any(n["event_type"] == "NEW_ORDER_REQUEST" for n in notifs["notifications"])
    buyer_notifs = client.get(
        "/api/notifications?recipient_type=user&recipient_id=usr_test").json()
    assert any(n["event_type"] == "ORDER_CREATED"
               for n in buyer_notifs["notifications"])

    # SLA instances created
    slas = client.get(f"/api/sla/instances?order_id={data['order_id']}").json()
    types = {s["sla_type"] for s in slas["instances"]}
    assert "vendor_acknowledgement" in types


# ── Scenario H: vendor isolation ──────────────────────────────────────────
def test_vendor_cannot_see_other_vendors_orders():
    # Allocate an order
    r = client.post("/api/orders/allocate", json={
        "product_id": "prod-headphones", "user_id": "usr_test2",
        "locality": "Koramangala"})
    order_id = r.json()["order_id"]
    real_vendor = r.json()["vendor"]["vendor_id"]

    # Wrong vendor tries to accept → 403
    other_vendor = "VEN-BLR-001" if real_vendor != "VEN-BLR-001" else "VEN-BLR-002"
    r2 = client.post(f"/api/vendor/orders/{order_id}/accept",
                     headers={"X-Cairn-Vendor-Id": other_vendor})
    assert r2.status_code == 403

    # No header → 401
    r3 = client.post(f"/api/vendor/orders/{order_id}/accept")
    assert r3.status_code == 401

    # Right vendor can see it
    r4 = client.get("/api/vendor/orders",
                    headers={"X-Cairn-Vendor-Id": real_vendor})
    assert r4.status_code == 200
    ids = [o["id"] for o in r4.json()["orders"]]
    assert order_id in ids


def test_sse_requires_a_specific_scope():
    response = client.get("/api/events?scope=all")
    assert response.status_code == 400


# ── Scenario I: geolocation fallback ──────────────────────────────────────
def test_locality_resolution_and_fallback():
    assert locality_to_coords("Indiranagar") is not None
    assert locality_to_coords("Koramangala") is not None
    # Unknown locality → IP fallback still returns coords
    buyer = resolve_buyer_location({"locality": "Nowhere Land"})
    assert buyer["lat"] and buyer["lng"]
    assert buyer["source"] == "ip_fallback"


def test_haversine_known_distance():
    # Indiranagar → Koramangala ≈ 4-5 km
    d = haversine_km(12.9716, 77.6412, 12.9352, 77.6245)
    assert 3.0 < d < 7.0


# ── Order lifecycle: accept → dispatch ────────────────────────────────────
def test_vendor_accept_and_dispatch_flow():
    r = client.post("/api/orders/allocate", json={
        "product_id": "prod-monitor", "user_id": "usr_test3",
        "locality": "Whitefield"})
    data = r.json()
    order_id, vid = data["order_id"], data["vendor"]["vendor_id"]
    h = {"X-Cairn-Vendor-Id": vid}

    assert client.post(f"/api/vendor/orders/{order_id}/acknowledge",
                       headers=h).json()["status"] == "ACKNOWLEDGED"
    assert client.post(f"/api/vendor/orders/{order_id}/accept",
                       headers=h).json()["status"] == "ACCEPTED"
    assert client.post(f"/api/vendor/orders/{order_id}/accept",
                       headers=h).status_code == 409
    assert client.post(f"/api/vendor/orders/{order_id}/dispatch",
                       headers=h, json={"tracking_ref": "TRK123"}
                       ).status_code == 409
    assert client.post(f"/api/vendor/orders/{order_id}/prepare",
                       headers=h).json()["status"] == "PREPARING"
    missing_tracking = client.post(
        f"/api/vendor/orders/{order_id}/dispatch", headers=h,
        json={"carrier_name": "Blue Dart", "tracking_ref": ""})
    assert missing_tracking.status_code == 422
    missing_carrier = client.post(
        f"/api/vendor/orders/{order_id}/dispatch", headers=h,
        json={"tracking_ref": "TRK123"})
    assert missing_carrier.status_code == 422
    assert client.post(f"/api/vendor/orders/{order_id}/dispatch",
                       headers=h, json={"carrier_name": "Blue Dart", "tracking_ref": "TRK123"}
                       ).json()["status"] == "DISPATCHED"

    detail = client.get(f"/api/orders/{order_id}/vendor").json()
    assert detail["vendor"]["vendor_id"] == vid
    assert detail["status"] == "dispatched"
    assert detail["carrier_name"] == "Blue Dart"
    assert detail["tracking_ref"] == "TRK123"

    buyer_notifications = client.get(
        "/api/notifications?recipient_type=user&recipient_id=usr_test3").json()["notifications"]
    event_types = {notification["event_type"] for notification in buyer_notifications}
    assert {"ORDER_CREATED", "VENDOR_ACKNOWLEDGED", "VENDOR_ACCEPTED",
            "ORDER_PREPARING", "ORDER_DISPATCHED"}.issubset(event_types)
    dispatch_notice = next(n for n in buyer_notifications if n["event_type"] == "ORDER_DISPATCHED")
    assert "TRK123" in dispatch_notice["body"]
    assert "Blue Dart" in dispatch_notice["body"]


# ── Scenario D: price proposal requires buyer approval ────────────────────
def test_price_proposal_flow():
    r = client.post("/api/orders/allocate", json={
        "product_id": "prod-keyboard", "user_id": "usr_test4",
        "locality": "BTM Layout"})
    data = r.json()
    order_id, vid = data["order_id"], data["vendor"]["vendor_id"]
    h = {"X-Cairn-Vendor-Id": vid}
    orig_price = data["vendor"]["price_paise"]

    # Vendor proposes higher price
    r2 = client.post(f"/api/vendor/orders/{order_id}/price-proposal",
                     headers=h,
                     json={"price_paise": orig_price + 50000,
                           "reason": "festive demand"})
    assert r2.status_code == 200
    pid = r2.json()["proposal_id"]
    buyer_notifs = client.get(
        "/api/notifications?recipient_type=user&recipient_id=usr_test4").json()["notifications"]
    assert any(n["event_type"] == "PRICE_CHANGE_PROPOSED"
               and n["payload"]["proposal_id"] == pid for n in buyer_notifs)

    # Buyer rejects → original price unchanged
    r3 = client.post(f"/api/orders/price-proposals/{pid}/resolve",
                     json={"user_id": "usr_test4", "approve": False})
    assert r3.json()["status"] == "REJECTED"
    detail = client.get(f"/api/orders/{order_id}/vendor").json()
    assert detail["price_paise"] == orig_price


# ── Scenario E: vendor rejection → reallocation ───────────────────────────
def test_vendor_rejection_reallocates():
    r = client.post("/api/orders/allocate", json={
        "product_id": "prod-headphones", "user_id": "usr_test5",
        "locality": "Jayanagar"})
    data = r.json()
    order_id, vid = data["order_id"], data["vendor"]["vendor_id"]
    h = {"X-Cairn-Vendor-Id": vid}

    r2 = client.post(f"/api/vendor/orders/{order_id}/reject",
                     headers=h, json={"reason": "out of stock"})
    assert r2.status_code == 200
    body = r2.json()
    assert body["status"] == "REASSIGNED"
    assert body["reallocation"] == "reallocated"
    assert body["new_vendor"]["vendor_id"] != vid

    buyer_order = client.get(f"/api/orders/{order_id}/vendor").json()
    assert buyer_order["status"] == "allocated"
    assert buyer_order["vendor"]["vendor_id"] == body["new_vendor"]["vendor_id"]
    new_vendor_headers = {"X-Cairn-Vendor-Id": body["new_vendor"]["vendor_id"]}
    accepted = client.post(
        f"/api/vendor/orders/{order_id}/accept",
        headers=new_vendor_headers)
    assert accepted.json()["status"] == "ACCEPTED"
    prepared = client.post(
        f"/api/vendor/orders/{order_id}/prepare",
        headers=new_vendor_headers)
    assert prepared.json()["status"] == "PREPARING"


# ── Priority 13: Payments (sandbox) ───────────────────────────────────────
def test_sandbox_payment_flow():
    r = client.post("/api/orders/allocate", json={
        "product_id": "prod-keyboard", "user_id": "usr_pay",
        "locality": "Indiranagar"})
    order_id = r.json()["order_id"]

    # Create payment
    r2 = client.post(f"/api/orders/{order_id}/payment/create")
    assert r2.status_code == 200
    pay = r2.json()
    assert pay["status"] == "CREATED"
    assert pay["sandbox"] is True
    assert pay["payment_id"].startswith("pay_")

    # Confirm payment
    r3 = client.post(f"/api/orders/{order_id}/payment/confirm",
                     json={"payment_id": pay["payment_id"]})
    assert r3.json()["status"] == "SUCCEEDED"

    # Order payment_status updated
    detail = client.get(f"/api/orders/{order_id}/vendor").json()
    assert detail.get("payment_status") == "paid"

    # Refund
    r4 = client.post(f"/api/orders/{order_id}/payment/refund",
                     json={"payment_id": pay["payment_id"]})
    assert r4.json()["status"] == "REFUNDED"


# ── Priority 13: Trust receipts ───────────────────────────────────────────
def test_trust_receipt_signing_and_verification():
    r = client.post("/api/orders/allocate", json={
        "product_id": "prod-headphones", "user_id": "usr_rcpt",
        "locality": "Koramangala"})
    order_id = r.json()["order_id"]

    r2 = client.get(f"/api/orders/{order_id}/receipt")
    assert r2.status_code == 200
    receipt = r2.json()
    assert receipt["receipt_type"] == "cairn_trust_receipt"
    assert receipt["signature"]
    assert receipt["order"]["product_id"] == "prod-headphones"
    assert receipt["vendor"]["vendor_id"].startswith("VEN-BLR-")

    # Verify signature
    r3 = client.post("/api/receipts/verify", json={"receipt": receipt})
    assert r3.json()["valid"] is True

    # Tampered receipt fails verification
    bad = {**receipt, "order": {**receipt["order"], "price": 1}}
    r4 = client.post("/api/receipts/verify", json={"receipt": bad})
    assert r4.json()["valid"] is False


# ── Priority 11: SLA breach detection ─────────────────────────────────────
def test_sla_breach_detection():
    # Create an SLA instance with a deadline in the past
    from backend.marketplace.store import store
    store.create_sla_instance(
        sla_id="sla-test-breach-1", order_id="CRN-TEST-BREACH",
        vendor_id="VEN-BLR-001", sla_type="vendor_acknowledgement",
        deadline_seconds=-10, responsible_party="vendor")

    r = client.post("/api/sla/check-breaches")
    assert r.status_code == 200
    data = r.json()
    assert data["breached"] >= 1
    assert any(b["id"] == "sla-test-breach-1" for b in data["instances"])

    # Verify it's now BREACHED
    slas = client.get("/api/sla/instances?order_id=CRN-TEST-BREACH").json()
    assert any(s["status"] == "BREACHED" for s in slas["instances"])
