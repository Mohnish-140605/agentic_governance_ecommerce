"""
Trust receipts (Priority 13): canonical-payload signing for orders.

- Builds a canonical JSON payload of the order + allocation + governance
  decision, signs it with HMAC-SHA256 using SECRET_KEY.
- Receipt is verifiable: anyone with the key can recompute the signature.
- Hash-chained to the audit ledger where possible.
"""

import hashlib
import hmac
import json
import time
from typing import Any, Dict, Optional

from ..config import settings
from .store import store


def _canonical(payload: Dict[str, Any]) -> str:
    """Deterministic JSON: sorted keys, no whitespace."""
    return json.dumps(payload, sort_keys=True, separators=(",", ":"))


def sign_payload(payload: Dict[str, Any], key: Optional[str] = None) -> str:
    secret = key or getattr(settings, "SECRET_KEY", "cairn-dev-secret")
    return hmac.new(secret.encode(), _canonical(payload).encode(),
                    hashlib.sha256).hexdigest()


def build_order_receipt(order_id: str) -> Optional[Dict[str, Any]]:
    """
    Build a signed trust receipt for an order.
    Includes: order details, vendor allocation, governance decision,
    SLA status, payment status, signature, and verification instructions.
    """
    from ..models.database import db
    orders = [o for o in db.get_orders() if o.get("id") == order_id]
    if not orders:
        return None
    order = orders[0]
    alloc = store.get_allocation(order_id)
    vendor = store.get_vendor(alloc["vendor_id"]) if alloc else None
    history = store.get_order_history(order_id)
    slas = store.get_sla_instances(order_id=order_id)

    # Find governance audit record for this order if present
    gov_record = None
    try:
        logs = db.get_audit_logs(limit=200)
        for log in logs:
            if log.get("order_id") == order_id or order_id in str(log.get("payload", "")):
                gov_record = log
                break
    except Exception:
        pass

    receipt_payload = {
        "receipt_type": "cairn_trust_receipt",
        "version": "1.0",
        "order_id": order_id,
        "issued_at": time.time(),
        "order": {
            "product_name": order.get("product_name") or order.get("item"),
            "product_id": order.get("product_id"),
            "quantity": order.get("quantity", 1),
            "price": order.get("price"),
            "price_paise": order.get("price_paise") or (alloc or {}).get("price_paise"),
            "status": order.get("status"),
            "payment_status": order.get("payment_status"),
            "user_id": order.get("user_id"),
            "destination": order.get("destination") or order.get("vendor_locality"),
        },
        "vendor": ({
            "vendor_id": vendor["id"],
            "store_name": vendor["store_name"],
            "locality": vendor["locality"],
            "verification_status": vendor["verification_status"],
            "is_demo": bool(vendor.get("is_demo")),
        } if vendor else None),
        "allocation": ({
            "allocation_id": alloc["id"],
            "distance_km": alloc.get("distance_km"),
            "score": alloc.get("score"),
            "status": alloc.get("status"),
        } if alloc else None),
        "governance": ({
            "decision": gov_record.get("decision") if gov_record else None,
            "audit_hash": gov_record.get("audit_hash") if gov_record else None,
        } if gov_record else {"decision": None, "audit_hash": None}),
        "sla": [{
            "type": s["sla_type"], "status": s["status"],
            "deadline": s["deadline"], "breached_at": s.get("breached_at"),
        } for s in slas],
        "status_history": [{
            "status": h["status"], "actor": h["actor"],
            "note": h.get("note"), "at": h["created_at"],
        } for h in history],
    }

    receipt_payload["signature_algorithm"] = "HMAC-SHA256"
    signature = sign_payload(receipt_payload)
    receipt_payload["signature"] = signature
    receipt_payload["canonical_payload"] = _canonical(
        {k: v for k, v in receipt_payload.items() if k != "signature"})
    return receipt_payload


def verify_receipt(receipt: Dict[str, Any], key: Optional[str] = None) -> bool:
    """Verify a receipt's signature against its canonical payload."""
    if not receipt or "signature" not in receipt:
        return False
    payload = {k: v for k, v in receipt.items()
               if k not in ("signature", "canonical_payload")}
    expected = sign_payload(payload, key)
    return hmac.compare_digest(expected, receipt["signature"])
