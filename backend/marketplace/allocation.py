"""
Nearby Vendor Allocation Engine (Priority 4).

Pipeline:
  1. Find vendors offering the product.
  2. Filter ineligible vendors (unverified, out of service area, no stock,
     closed, suspended, insufficient quantity).
  3. Compute distance buyer→vendor (haversine).
  4. Estimate fulfilment time from vendor SLA config.
  5. Rank with configurable weighted scoring (NOT distance-only).
  6. Reserve stock atomically.
  7. Persist VendorAllocation.
  8. Notify vendor + emit events.
  9. Return allocation to buyer.

Weights are configurable via ALLOCATION_WEIGHTS; defaults favour proximity
but never let it dominate price/stock/reliability.
"""

import time
from typing import Any, Dict, List, Optional, Tuple

from .geo import vendor_serves_buyer, haversine_km
from .store import store

# Configurable scoring weights (must sum ~1.0)
DEFAULT_WEIGHTS = {
    "proximity": 0.30,
    "price": 0.25,
    "stock": 0.15,
    "reliability": 0.15,
    "fulfilment_speed": 0.15,
}

# Hard filters
REQUIRE_VERIFIED = True
MIN_STOCK_FOR_ORDER = 1


def _is_open_now(vendor: Dict[str, Any]) -> bool:
    """Operating-hours check. Demo vendors store 'HH:MM-HH:MM'; missing → open."""
    hours = vendor.get("operating_hours")
    if not hours or "-" not in str(hours):
        return True
    try:
        start_s, end_s = str(hours).split("-")
        sh, sm = map(int, start_s.strip().split(":"))
        eh, em = map(int, end_s.strip().split(":"))
        now = time.localtime()
        cur = now.tm_hour * 60 + now.tm_min
        return (sh * 60 + sm) <= cur <= (eh * 60 + em)
    except Exception:
        return True


def _score_offer(offer: Dict[str, Any], distance_km: float,
                 buyer: Dict[str, Any], weights: Dict[str, float],
                 max_price_paise: Optional[int],
                 min_price_paise: Optional[int]) -> Tuple[float, Dict[str, float]]:
    """Return (composite_score, breakdown). Higher is better."""
    breakdown: Dict[str, float] = {}

    # Proximity: 1.0 at 0km → 0.0 at 25km
    breakdown["proximity"] = max(0.0, 1.0 - (distance_km / 25.0))

    # Price: cheaper scores higher; normalise against a reference band.
    price = offer.get("price_paise") or 0
    ref = max_price_paise or 15000000  # ₹1.5L reference
    floor = min_price_paise or 500000  # ₹5k floor
    if price <= 0:
        breakdown["price"] = 0.0
    else:
        # linear between floor (1.0) and ref (0.0), clamp
        breakdown["price"] = max(0.0, min(1.0, (ref - price) / max(1, ref - floor)))

    # Stock: more stock → higher, saturates at 10 units
    stock = int(offer.get("stock") or 0)
    breakdown["stock"] = min(1.0, stock / 10.0)

    # Reliability: vendor's historical score (0..1)
    breakdown["reliability"] = float(offer.get("reliability_score") or 0.8)

    # Fulfilment speed: faster ack+dispatch → higher; normalise vs 24h
    ack = float(offer.get("sla_ack_minutes") or 60)
    disp = float(offer.get("sla_dispatch_minutes") or 480)
    total_min = ack + disp
    breakdown["fulfilment_speed"] = max(0.0, 1.0 - (total_min / (24 * 60)))

    composite = sum(weights.get(k, 0.0) * breakdown.get(k, 0.0) for k in weights)
    return round(composite, 4), breakdown


def find_eligible_vendors(product_id: str, buyer: Dict[str, Any],
                          quantity: int = 1,
                          max_radius_km: Optional[float] = None,
                          require_open: bool = True,
                          weights: Optional[Dict[str, float]] = None,
                          max_price_paise: Optional[int] = None,
                          min_price_paise: Optional[int] = None,
                          preferred_vendor_id: Optional[str] = None,
                          excluded_vendor_ids: Optional[List[str]] = None
                          ) -> Dict[str, Any]:
    """
    Full allocation pipeline. Returns dict with:
      eligible: ranked list of offers (each with distance_km, score, breakdown)
      excluded: list of {offer, reason} for transparency
      buyer: resolved buyer location
    """
    weights = weights or DEFAULT_WEIGHTS
    excluded_vendor_ids = set(excluded_vendor_ids or [])
    # Fetch ALL offers (incl. out-of-stock) so exclusions are reported transparently
    offers = store.get_product_offers(product_id, include_out_of_stock=True)
    eligible: List[Dict[str, Any]] = []
    excluded: List[Dict[str, Any]] = []

    for offer in offers:
        vendor = offer  # joined vendor columns already on the row
        reason = None

        if offer.get("vendor_id") in excluded_vendor_ids:
            reason = "previously_rejected"
        elif REQUIRE_VERIFIED and vendor.get("verification_status") != "verified":
            reason = "vendor_not_verified"
        elif vendor.get("vendor_status") != "active" or vendor.get("status") == "suspended":
            reason = "vendor_inactive"
        elif require_open and not _is_open_now(vendor):
            reason = "vendor_closed"
        elif int(offer.get("stock") or 0) < max(MIN_STOCK_FOR_ORDER, quantity):
            reason = "insufficient_stock"
        else:
            serves, dist = vendor_serves_buyer(vendor, buyer, max_radius_km)
            if not serves:
                reason = "outside_service_area"
            else:
                score, breakdown = _score_offer(
                    offer, dist, buyer, weights, max_price_paise, min_price_paise)
                eligible.append({
                    **offer,
                    "distance_km": round(dist, 2),
                    "score": score,
                    "score_breakdown": breakdown,
                    "estimated_fulfilment_minutes": int(
                        (offer.get("sla_ack_minutes") or 60) +
                        (offer.get("sla_dispatch_minutes") or 480)),
                })
        if reason:
            excluded.append({"vendor_id": offer.get("vendor_id"),
                             "store_name": offer.get("store_name"),
                             "reason": reason})

    # Buyer-selected vendor: pin to top if present & eligible
    if preferred_vendor_id:
        eligible.sort(key=lambda o: (o.get("vendor_id") != preferred_vendor_id, -o["score"]))
    else:
        eligible.sort(key=lambda o: -o["score"])

    return {
        "product_id": product_id,
        "quantity": quantity,
        "buyer": buyer,
        "eligible": eligible,
        "excluded": excluded,
        "weights": weights,
    }


def allocate_order(product_id: str, buyer: Dict[str, Any], order_id: str,
                   quantity: int = 1, user_id: str = "usr_default",
                   preferred_vendor_id: Optional[str] = None,
                   max_radius_km: Optional[float] = None,
                   max_price_paise: Optional[int] = None,
                   min_price_paise: Optional[int] = None,
                   weights: Optional[Dict[str, float]] = None,
                   excluded_vendor_ids: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    Allocate an order to the best eligible vendor.
    Steps 6-9 of the pipeline: select → reserve → persist → notify.
    Returns allocation result; does NOT create governance decision (caller does).
    """
    result = find_eligible_vendors(
        product_id, buyer, quantity=quantity, max_radius_km=max_radius_km,
        weights=weights, max_price_paise=max_price_paise,
        min_price_paise=min_price_paise, preferred_vendor_id=preferred_vendor_id,
        excluded_vendor_ids=excluded_vendor_ids)

    if not result["eligible"]:
        return {
            "status": "NO_ELIGIBLE_VENDOR",
            "order_id": order_id,
            "product_id": product_id,
            "buyer": buyer,
            "excluded": result["excluded"],
            "message": "No eligible nearby vendor can fulfil this order right now.",
        }

    chosen = result["eligible"][0]
    vendor_product_id = chosen["id"]

    # Step 7 — reserve stock atomically
    reservation_id = store.reserve_stock(vendor_product_id, order_id, quantity)
    if not reservation_id:
        # Stock raced away — retry once with next-best vendor
        for alt in result["eligible"][1:]:
            reservation_id = store.reserve_stock(alt["id"], order_id, quantity)
            if reservation_id:
                chosen = alt
                vendor_product_id = alt["id"]
                break
        if not reservation_id:
            return {
                "status": "ALLOCATION_FAILED",
                "order_id": order_id,
                "reason": "stock_unavailable_at_execution",
                "eligible": result["eligible"],
            }

    # Step 8 — persist allocation
    allocation_id = store.create_allocation(
        order_id=order_id, vendor_id=chosen["vendor_id"],
        product_id=product_id, quantity=quantity,
        price_paise=chosen["price_paise"], distance_km=chosen["distance_km"],
        score=chosen["score"], buyer_locality=buyer.get("locality", ""))

    # Step 9 — notify vendor + emit events
    from .notifications import notify_vendor_new_order, notify_user, emit_event
    notify_vendor_new_order(
        vendor_id=chosen["vendor_id"], order_id=order_id,
        product_name=chosen.get("product_name"), quantity=quantity,
        price_paise=chosen["price_paise"], buyer_locality=buyer.get("locality", ""))
    notify_user(
        user_id=user_id, event_type="ORDER_CREATED",
        title="Order placed with a nearby store",
        body=f"Order {order_id} was assigned to {chosen.get('store_name')}.",
        payload={"order_id": order_id, "vendor_id": chosen["vendor_id"]},
        idempotency_key=f"order-created-{order_id}")
    emit_event("VENDOR_ALLOCATED", order_id, {
        "vendor_id": chosen["vendor_id"], "product_id": product_id,
        "price_paise": chosen["price_paise"], "distance_km": chosen["distance_km"],
        "score": chosen["score"], "allocation_id": allocation_id})
    emit_event("ORDER_CREATED", order_id, {
        "product_id": product_id, "vendor_id": chosen["vendor_id"],
        "user_id": user_id, "quantity": quantity})

    # SLA: vendor acknowledgement deadline from vendor config
    vendor = store.get_vendor(chosen["vendor_id"]) or {}
    ack_minutes = float(vendor.get("sla_ack_minutes") or 30)
    disp_minutes = float(vendor.get("sla_dispatch_minutes") or 240)
    import uuid as _uuid
    suffix = _uuid.uuid4().hex[:6]
    store.create_sla_instance(
        sla_id=f"sla-ack-{order_id}-{suffix}", order_id=order_id,
        vendor_id=chosen["vendor_id"], sla_type="vendor_acknowledgement",
        deadline_seconds=ack_minutes * 60, responsible_party="vendor")
    store.create_sla_instance(
        sla_id=f"sla-disp-{order_id}-{suffix}", order_id=order_id,
        vendor_id=chosen["vendor_id"], sla_type="dispatch",
        deadline_seconds=(ack_minutes + disp_minutes) * 60,
        responsible_party="vendor")
    store.record_order_status(order_id, "allocated", actor="allocation_engine",
                              note=f"Assigned to {chosen.get('store_name')} ({chosen['vendor_id']})")

    return {
        "status": "ALLOCATED",
        "order_id": order_id,
        "allocation_id": allocation_id,
        "reservation_id": reservation_id,
        "vendor": {
            "vendor_id": chosen["vendor_id"],
            "store_name": chosen.get("store_name"),
            "locality": chosen.get("locality"),
            "address": chosen.get("address"),
            "distance_km": chosen["distance_km"],
            "price_paise": chosen["price_paise"],
            "stock": chosen.get("stock"),
            "verification_status": chosen.get("verification_status"),
            "estimated_fulfilment_minutes": chosen["estimated_fulfilment_minutes"],
            "score": chosen["score"],
            "score_breakdown": chosen["score_breakdown"],
        },
        "alternatives": [
            {"vendor_id": o["vendor_id"], "store_name": o.get("store_name"),
             "locality": o.get("locality"), "distance_km": o["distance_km"],
             "price_paise": o["price_paise"], "stock": o.get("stock"),
             "score": o["score"]}
            for o in result["eligible"][1:4]
        ],
        "excluded": result["excluded"],
        "buyer": buyer,
    }
