"""
Order lifecycle service (Priorities 5, 7, 8):

- Vendor acknowledges / accepts / rejects an allocated order.
- Vendor may propose a revised price → governance check → buyer approval.
- Vendor rejection → release reservation → reallocate to next vendor.
- Buyer views assigned vendor (Priority 5).
- Controlled order state machine enforced here.

Order states:
  allocated → acknowledged → accepted → preparing → dispatched → delivered
  allocated → rejected (vendor) → reallocated | cancelled
  allocated → expired (SLA breach path handled by SLA monitor)
"""

import time
import uuid
from typing import Any, Dict, Optional

from .store import store
from .notifications import (notify_vendor_event, notify_user, emit_event,
                            drain_outbox_once)

VALID_TRANSITIONS = {
    "allocated": {"acknowledged", "accepted", "rejected", "cancelled", "expired"},
    "acknowledged": {"accepted", "rejected", "cancelled"},
    "accepted": {"preparing", "cancelled"},
    "preparing": {"dispatched", "cancelled"},
    "dispatched": {"delivered", "cancelled"},
    "rejected": {"allocated", "cancelled"},
    "needs_ok": {"placed", "failed"},   # legacy human-approval states
    "placed": {"dispatched", "delivered", "cancelled"},
    "dispatched_legacy": set(),
}


def _order_id_for_proposal(proposal_id: str) -> str:
    return f"CRN-{proposal_id[-5:]}"


def get_order_with_vendor(order_id: str) -> Optional[Dict[str, Any]]:
    """Buyer-facing order view incl. assigned vendor (Priority 5)."""
    from ..models.database import db
    orders = [o for o in db.get_orders() if o.get("id") == order_id]
    if not orders:
        return None
    order = orders[0]
    alloc = store.get_allocation(order_id)
    vendor = store.get_vendor(alloc["vendor_id"]) if alloc else None
    history = store.get_order_history(order_id)
    slas = store.get_sla_instances(order_id=order_id)
    return {
        **order,
        "vendor": ({
            "vendor_id": vendor["id"],
            "store_name": vendor["store_name"],
            "locality": vendor["locality"],
            "address": vendor["address"],
            "verification_status": vendor["verification_status"],
            "is_demo": bool(vendor.get("is_demo")),
        } if vendor else None),
        "allocation": alloc,
        "distance_km": alloc.get("distance_km") if alloc else order.get("distance_km"),
        "price_paise": alloc.get("price_paise") if alloc else order.get("price_paise"),
        "status_history": history,
        "sla_instances": slas,
    }


def _transition(order_id: str, new_status: str, actor: str,
                note: str = "", tracking_ref: Optional[str] = None,
                carrier_name: Optional[str] = None) -> bool:
    from ..models.database import db
    # Fetch current status
    orders = [o for o in db.get_orders() if o.get("id") == order_id]
    if not orders:
        return False
    current = orders[0].get("status") or ""
    allowed = VALID_TRANSITIONS.get(current, set())
    # 'dispatched' legacy orders map to 'placed' flow
    if current == "dispatched":
        allowed = {"delivered", "cancelled"}
    if new_status not in allowed and not (current in ("placed", "needs_ok") and new_status in ("dispatched", "delivered", "failed", "placed")):
        return False
    ok = db.update_order_status(order_id, new_status, tracking_ref=tracking_ref,
                                carrier_name=carrier_name)
    if ok:
        store.record_order_status(order_id, new_status, actor=actor, note=note)
    return ok


def vendor_acknowledge(order_id: str, vendor_id: str) -> Dict[str, Any]:
    alloc = store.get_allocation(order_id)
    if not alloc or alloc["vendor_id"] != vendor_id:
        return {"status": "FORBIDDEN", "message": "Order not assigned to this vendor."}
    if alloc["status"] not in ("allocated",):
        return {"status": "CONFLICT", "message": f"Order already {alloc['status']}."}
    if not _transition(order_id, "acknowledged", actor=f"vendor:{vendor_id}",
                       note="Vendor acknowledged order request"):
        return {"status": "CONFLICT", "message": "Invalid order state transition."}
    store.update_allocation_status(alloc["id"], "acknowledged")
    user_id = _buyer_of(order_id)
    if user_id:
        notify_user(user_id, "VENDOR_ACKNOWLEDGED",
                    "Vendor acknowledged your order",
                    f"Order {order_id} is being reviewed by the assigned vendor.",
                    {"order_id": order_id, "vendor_id": vendor_id},
                    idempotency_key=f"vendor-acknowledged-{order_id}")
    emit_event("VENDOR_ACCEPTED", order_id, {"vendor_id": vendor_id,
                                             "user_id": user_id,
                                             "stage": "acknowledged"})
    return {"status": "ACKNOWLEDGED", "order_id": order_id}


def vendor_accept(order_id: str, vendor_id: str) -> Dict[str, Any]:
    alloc = store.get_allocation(order_id)
    if not alloc or alloc["vendor_id"] != vendor_id:
        return {"status": "FORBIDDEN", "message": "Order not assigned to this vendor."}
    if alloc["status"] not in ("allocated", "acknowledged"):
        return {"status": "CONFLICT", "message": "Allocation is no longer awaiting acceptance."}
    if not _transition(order_id, "accepted", actor=f"vendor:{vendor_id}",
                       note="Vendor accepted order"):
        return {"status": "CONFLICT", "message": "Invalid order state transition."}
    store.update_allocation_status(alloc["id"], "accepted")
    # Resolve ack SLA
    for sla in store.get_sla_instances(order_id=order_id):
        if sla["sla_type"] == "vendor_acknowledgement" and sla["status"] == "ON_TRACK":
            store.update_sla_status(sla["id"], "RESOLVED",
                                    corrective_action="Acknowledged by vendor")
    user_id = _buyer_of(order_id)
    if user_id:
        notify_user(user_id, "VENDOR_ACCEPTED",
                    "Vendor accepted your order",
                    f"Order {order_id} was accepted by the assigned vendor.",
                    {"order_id": order_id, "vendor_id": vendor_id},
                    idempotency_key=f"vendor-accepted-{order_id}")
    emit_event("VENDOR_ACCEPTED", order_id, {"vendor_id": vendor_id,
                                             "user_id": user_id,
                                             "stage": "accepted"})
    return {"status": "ACCEPTED", "order_id": order_id}

def vendor_prepare(order_id: str, vendor_id: str) -> Dict[str, Any]:
    alloc = store.get_allocation(order_id)
    if not alloc or alloc["vendor_id"] != vendor_id:
        return {"status": "FORBIDDEN", "message": "Order not assigned to this vendor."}
    if alloc["status"] != "accepted":
        return {"status": "CONFLICT", "message": "Accept the order before preparing it."}
    if not _transition(order_id, "preparing", actor=f"vendor:{vendor_id}",
                       note="Vendor started preparing the order"):
        return {"status": "CONFLICT", "message": "Invalid order state transition."}
    store.update_allocation_status(alloc["id"], "preparing")
    user_id = _buyer_of(order_id)
    if user_id:
        notify_user(user_id, "ORDER_PREPARING",
                    "Your order is being prepared",
                    f"The vendor has started preparing order {order_id}.",
                    {"order_id": order_id, "vendor_id": vendor_id},
                    idempotency_key=f"order-preparing-{order_id}")
    emit_event("ORDER_PREPARING", order_id,
               {"vendor_id": vendor_id, "user_id": user_id})
    return {"status": "PREPARING", "order_id": order_id}


def vendor_reject(order_id: str, vendor_id: str, reason: str = "") -> Dict[str, Any]:
    """
    Vendor rejects → release reservation → attempt reallocation to next vendor.
    (Priority 5 / Scenario E)
    """
    alloc = store.get_allocation(order_id)
    if not alloc or alloc["vendor_id"] != vendor_id:
        return {"status": "FORBIDDEN", "message": "Order not assigned to this vendor."}
    if alloc["status"] not in ("allocated", "acknowledged"):
        return {"status": "CONFLICT", "message": "Allocation already closed."}
    if not _transition(order_id, "rejected", actor=f"vendor:{vendor_id}",
                       note=f"Vendor rejected: {reason or 'no reason given'}"):
        return {"status": "CONFLICT", "message": "Invalid order state transition."}
    store.update_allocation_status(alloc["id"], "rejected")
    store.release_reservation(order_id)
    for sla in store.get_sla_instances(order_id=order_id):
        if sla["vendor_id"] == vendor_id and sla["status"] in ("ON_TRACK", "AT_RISK"):
            store.update_sla_status(
                sla["id"], "RESOLVED",
                corrective_action="Vendor declined the order")
    user_id = _buyer_of(order_id)
    emit_event("VENDOR_REJECTED", order_id, {"vendor_id": vendor_id,
                                             "user_id": user_id,
                                             "reason": reason})

    # Attempt reallocation excluding the rejecting vendor
    from .allocation import find_eligible_vendors
    from .geo import resolve_buyer_location
    from ..models.database import db

    orders = [o for o in db.get_orders() if o.get("id") == order_id]
    if not orders:
        return {"status": "REJECTED", "order_id": order_id,
                "reallocation": "order_not_found"}
    order = orders[0]
    product_id = order.get("product_id") or ""
    # Reconstruct buyer location from stored locality if possible
    buyer = resolve_buyer_location({
        "locality": alloc.get("buyer_locality") or order.get("destination") or "Bengaluru"
    })
    quantity = int(alloc.get("quantity") or 1)

    rejected_vendor_ids = [
        allocation["vendor_id"]
        for allocation in store.get_order_allocations(order_id)
        if allocation["status"] in ("rejected", "reassigned")
    ]
    result = find_eligible_vendors(
        product_id, buyer, quantity=quantity, preferred_vendor_id=None,
        excluded_vendor_ids=rejected_vendor_ids)
    if not result["eligible"]:
        notify_user(user_id or "", "NO_VENDOR_AVAILABLE",
                    "No vendor available",
                    f"Order {order_id}: the assigned vendor declined and no "
                    f"other eligible vendor is available. No charge was made.",
                    {"order_id": order_id},
                    idempotency_key=f"no-vendor-{order_id}")
        return {"status": "REJECTED", "order_id": order_id,
                "reallocation": "no_alternative_vendor"}

    # Reallocate to best remaining vendor
    from .allocation import allocate_order
    new_alloc = allocate_order(
        product_id=product_id, buyer=buyer, order_id=order_id,
        quantity=quantity,
        user_id=order.get("user_id") or "usr_default",
        excluded_vendor_ids=rejected_vendor_ids)
    if new_alloc.get("status") == "ALLOCATED":
        new_vendor = new_alloc["vendor"]
        if not _transition(order_id, "allocated", actor="allocation_engine",
                           note=f"Reassigned to {new_vendor['store_name']}"):
            return {"status": "REJECTED", "order_id": order_id,
                    "reallocation": "failed"}
        with _session() as session:
            from sqlalchemy import text
            session.execute(text("""
                UPDATE orders SET vendor_id=:vid, vendor_name=:vname,
                    vendor_locality=:vloc, distance_km=:dist,
                    price_paise=:pp, price=:price, merchant=:vname,
                    allocation_id=:aid, status='allocated'
                WHERE id=:oid
            """), {"vid": new_vendor["vendor_id"],
                   "vname": new_vendor["store_name"],
                   "vloc": new_vendor["locality"],
                   "dist": new_vendor["distance_km"],
                   "pp": new_vendor["price_paise"],
                   "price": new_vendor["price_paise"] / 100.0,
                   "aid": new_alloc["allocation_id"], "oid": order_id})
            session.commit()
        notify_user(user_id or "", "VENDOR_REASSIGNED",
                    "Vendor reassigned",
                    f"Order {order_id} was reassigned to "
                    f"{new_vendor['store_name']} "
                    f"({new_vendor['vendor_id']}).",
                    {"order_id": order_id,
                     "vendor_id": new_vendor["vendor_id"]},
                    idempotency_key=f"reassigned-{order_id}-{new_vendor['vendor_id']}")
        emit_event("VENDOR_REASSIGNED", order_id, {
            "user_id": user_id, "vendor_id": new_vendor["vendor_id"],
            "previous_vendor_id": vendor_id})
        return {"status": "REASSIGNED", "order_id": order_id,
                "reallocation": "reallocated",
                "new_vendor": new_vendor}
    return {"status": "REJECTED", "order_id": order_id,
            "reallocation": "failed"}


def _session():
    from ..models.database import SessionLocal
    return SessionLocal()


def _buyer_of(order_id: str) -> Optional[str]:
    from ..models.database import db
    orders = [o for o in db.get_orders() if o.get("id") == order_id]
    return orders[0].get("user_id") if orders else None


def vendor_propose_price(order_id: str, vendor_id: str,
                         proposed_price_paise: int, reason: str = "") -> Dict[str, Any]:
    """
    Vendor proposes revised price → stored as price_proposal pending buyer.
    Governance/buyer-approval enforcement happens at accept time
    (Priority 7 / Scenario D). Never silently changes checkout price.
    """
    alloc = store.get_allocation(order_id)
    if not alloc or alloc["vendor_id"] != vendor_id:
        return {"status": "FORBIDDEN", "message": "Order not assigned to this vendor."}
    if alloc["status"] not in ("allocated", "acknowledged"):
        return {"status": "CONFLICT", "message": "Price proposals are closed after vendor acceptance."}
    if proposed_price_paise <= 0:
        return {"status": "INVALID", "message": "Price must be positive."}
    # Merchant floor check: vendor's min_price_paise if configured
    vp = store.get_vendor_product(vendor_id, alloc["product_id"])
    floor = (vp or {}).get("min_price_paise")
    if floor and proposed_price_paise < int(floor):
        return {"status": "POLICY_BLOCK",
                "message": f"Proposed price below vendor minimum "
                           f"₹{floor/100:,.0f}. Governance blocked."}
    pid = store.create_price_proposal(
        order_id=order_id, vendor_id=vendor_id,
        product_id=alloc["product_id"],
        proposed_price_paise=proposed_price_paise, reason=reason)
    user_id = _buyer_of(order_id)
    if user_id:
        notify_user(user_id, "PRICE_CHANGE_PROPOSED",
                    "Vendor proposed a price change",
                    f"Order {order_id}: vendor proposes "
                    f"₹{proposed_price_paise/100:,.0f} "
                    f"(was ₹{alloc['price_paise']/100:,.0f}). "
                    "Approve or reject using this notification.",
                    {"order_id": order_id, "proposal_id": pid,
                     "proposed_price_paise": proposed_price_paise},
                    idempotency_key=f"price-proposal-{pid}")
    emit_event("PRICE_CHANGE_PROPOSED", order_id,
               {"vendor_id": vendor_id, "user_id": user_id,
                "proposal_id": pid,
                "proposed_price_paise": proposed_price_paise})
    return {"status": "PROPOSED", "proposal_id": pid, "order_id": order_id}


def buyer_resolve_price_proposal(proposal_id: str, user_id: str,
                                 approve: bool) -> Dict[str, Any]:
    """Buyer approves/rejects a vendor price proposal (Scenario D)."""
    pp = store.get_price_proposal(proposal_id)
    if not pp:
        return {"status": "NOT_FOUND"}
    if pp["status"] != "pending_buyer":
        return {"status": "CONFLICT", "message": "Proposal already resolved."}
    # Verify the buyer owns the order
    owner = _buyer_of(pp["order_id"])
    if owner and owner != user_id:
        return {"status": "FORBIDDEN", "message": "Not your order."}
    store.resolve_price_proposal(proposal_id,
                                 "approved" if approve else "rejected")
    emit_event("BUYER_APPROVED" if approve else "BUYER_REJECTED",
               pp["order_id"], {"proposal_id": proposal_id,
                                "vendor_id": pp["vendor_id"],
                                "user_id": user_id})
    if approve:
        # Update allocation price snapshot
        alloc = store.get_allocation(pp["order_id"])
        if alloc:
            with _session() as s:
                from sqlalchemy import text
                s.execute(text(
                    "UPDATE vendor_allocations SET price_paise=:p WHERE id=:id"),
                    {"p": pp["proposed_price_paise"], "id": alloc["id"]})
                s.execute(text(
                    "UPDATE orders SET price=:price, price_paise=:p WHERE id=:oid"),
                    {"price": pp["proposed_price_paise"] / 100.0,
                     "p": pp["proposed_price_paise"], "oid": pp["order_id"]})
                s.commit()
        notify_vendor_event(pp["vendor_id"], "PRICE_APPROVED",
                            "Buyer approved price change",
                            f"Order {pp['order_id']}: buyer approved "
                            f"₹{pp['proposed_price_paise']/100:,.0f}.",
                            {"order_id": pp["order_id"],
                             "proposal_id": proposal_id})
        return {"status": "APPROVED", "order_id": pp["order_id"],
                "price_paise": pp["proposed_price_paise"]}
    notify_vendor_event(pp["vendor_id"], "PRICE_REJECTED",
                        "Buyer rejected price change",
                        f"Order {pp['order_id']}: buyer rejected the proposed price.",
                        {"order_id": pp["order_id"],
                         "proposal_id": proposal_id})
    return {"status": "REJECTED", "order_id": pp["order_id"]}


def vendor_dispatch(order_id: str, vendor_id: str, carrier_name: str = "",
                    tracking_ref: str = "") -> Dict[str, Any]:
    alloc = store.get_allocation(order_id)
    if not alloc or alloc["vendor_id"] != vendor_id:
        return {"status": "FORBIDDEN", "message": "Order not assigned to this vendor."}
    if alloc["status"] != "preparing":
        return {"status": "CONFLICT", "message": "Start preparing the order before dispatch."}
    if not isinstance(carrier_name, str) or not isinstance(tracking_ref, str):
        return {"status": "INVALID", "message": "A valid carrier and tracking reference are required."}
    carrier_name = carrier_name.strip()
    tracking_ref = tracking_ref.strip()
    if not carrier_name or not tracking_ref:
        return {"status": "INVALID", "message": "A carrier and tracking reference are required."}
    ok = _transition(order_id, "dispatched", actor=f"vendor:{vendor_id}",
                     note=f"Dispatched {tracking_ref}".strip(),
                     tracking_ref=tracking_ref, carrier_name=carrier_name)
    if not ok:
        return {"status": "CONFLICT", "message": "Invalid state transition."}
    store.update_allocation_status(alloc["id"], "dispatched")
    for sla in store.get_sla_instances(order_id=order_id):
        if sla["sla_type"] == "dispatch" and sla["status"] in ("ON_TRACK", "AT_RISK"):
            store.update_sla_status(sla["id"], "RESOLVED",
                                    corrective_action="Dispatched by vendor")
    user_id = _buyer_of(order_id)
    if user_id:
        notify_user(user_id, "ORDER_DISPATCHED",
                    "Your order is on the way",
                    f"Order {order_id} was dispatched with {carrier_name}. "
                    f"Tracking reference: {tracking_ref}.",
                    {"order_id": order_id, "carrier_name": carrier_name,
                     "tracking_ref": tracking_ref},
                    idempotency_key=f"dispatched-{order_id}")
    emit_event("ORDER_DISPATCHED", order_id,
               {"vendor_id": vendor_id, "user_id": user_id,
                "carrier_name": carrier_name, "tracking_ref": tracking_ref})
    return {"status": "DISPATCHED", "order_id": order_id}


def mark_delivered(order_id: str, actor: str = "system") -> Dict[str, Any]:
    ok = _transition(order_id, "delivered", actor=actor, note="Delivered")
    if ok:
        emit_event("ORDER_DELIVERED", order_id,
                   {"user_id": _buyer_of(order_id)})
    return {"status": "DELIVERED" if ok else "CONFLICT", "order_id": order_id}


def list_vendor_orders(vendor_id: str) -> Dict[str, Any]:
    """All orders allocated to a vendor, with SLA status (merchant inbox)."""
    from ..models.database import db
    all_orders = db.get_orders()
    result = []
    for o in all_orders:
        alloc = store.get_allocation(o["id"])
        if alloc and alloc["vendor_id"] == vendor_id:
            slas = store.get_sla_instances(order_id=o["id"])
            result.append({
                **o,
                "allocation": alloc,
                "price_paise": alloc.get("price_paise"),
                "distance_km": alloc.get("distance_km"),
                "sla_instances": slas,
                "sla_at_risk": any(s["status"] in ("AT_RISK", "BREACHED") for s in slas),
            })
    return {"vendor_id": vendor_id, "orders": result}
