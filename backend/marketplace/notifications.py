"""
Notification service + SSE event bus (Priorities 6 & 12).

- In-app notifications are persisted in `notifications` (mandatory channel).
- Email/SMS/WhatsApp are adapter stubs — they record intent but only deliver
  when a provider is configured via env. Never claim external delivery.
- SSE: asyncio queues per channel; clients subscribe to
  `vendor:{id}`, `user:{id}`, or `order:{id}` scopes.
- Outbox pattern: emit_event() writes to outbox_events; a drain task (or the
  endpoint layer) publishes to SSE subscribers and marks published.
"""

import asyncio
import json
import time
from typing import Any, Dict, List, Optional

from .store import store

# ── SSE subscriber registry ──────────────────────────────────────────────
_subscribers: Dict[str, List[asyncio.Queue]] = {}
_subscribers_lock = asyncio.Lock()


async def subscribe(channel: str) -> asyncio.Queue:
    q: asyncio.Queue = asyncio.Queue(maxsize=200)
    async with _subscribers_lock:
        _subscribers.setdefault(channel, []).append(q)
    return q


async def unsubscribe(channel: str, q: asyncio.Queue) -> None:
    async with _subscribers_lock:
        subs = _subscribers.get(channel, [])
        if q in subs:
            subs.remove(q)


async def publish(channel: str, event: Dict[str, Any]) -> int:
    """Push an event to all subscribers of a channel. Returns recipient count."""
    async with _subscribers_lock:
        subs = list(_subscribers.get(channel, []))
    delivered = 0
    for q in subs:
        try:
            q.put_nowait(event)
            delivered += 1
        except asyncio.QueueFull:
            pass
    return delivered


async def publish_to_scopes(scopes: List[str], event: Dict[str, Any]) -> int:
    total = 0
    for scope in scopes:
        total += await publish(scope, event)
    return total


# ── Notification helpers ─────────────────────────────────────────────────
def _inr(paise: int) -> str:
    return f"₹{paise / 100:,.0f}"


def notify_vendor_new_order(vendor_id: str, order_id: str,
                            product_name: Optional[str], quantity: int,
                            price_paise: int, buyer_locality: str) -> Optional[str]:
    """Persist in-app notification for the vendor (idempotent per order)."""
    nid = store.create_notification(
        recipient_type="vendor", recipient_id=vendor_id,
        event_type="NEW_ORDER_REQUEST",
        title="New order request",
        body=(f"Order {order_id}: {quantity}× {product_name or 'item'} · "
              f"{_inr(price_paise)} · deliver to {buyer_locality or 'buyer locality'}. "
              f"Review and acknowledge."),
        payload={"order_id": order_id, "product_name": product_name,
                 "quantity": quantity, "price_paise": price_paise,
                 "buyer_locality": buyer_locality},
        idempotency_key=f"new-order-{order_id}-{vendor_id}")
    return nid


def notify_user(user_id: str, event_type: str, title: str, body: str,
                payload: Optional[Dict[str, Any]] = None,
                idempotency_key: Optional[str] = None) -> Optional[str]:
    return store.create_notification(
        recipient_type="user", recipient_id=user_id,
        event_type=event_type, title=title, body=body,
        payload=payload, idempotency_key=idempotency_key)


def notify_vendor_event(vendor_id: str, event_type: str, title: str,
                        body: str, payload: Optional[Dict[str, Any]] = None,
                        idempotency_key: Optional[str] = None) -> Optional[str]:
    return store.create_notification(
        recipient_type="vendor", recipient_id=vendor_id,
        event_type=event_type, title=title, body=body,
        payload=payload, idempotency_key=idempotency_key)


# ── Outbox → SSE bridge ──────────────────────────────────────────────────
async def drain_outbox_once() -> int:
    """
    Publish pending outbox events to SSE subscribers and mark published.
    Called periodically by the API layer (or on-demand after writes).
    """
    events = store.pending_events(limit=100)
    published = 0
    for ev in events:
        try:
            payload = json.loads(ev.get("payload_json") or "{}")
        except Exception:
            payload = {}
        event = {
            "id": ev["id"],
            "type": ev["event_type"],
            "aggregate_id": ev.get("aggregate_id"),
            "payload": payload,
            "created_at": ev.get("created_at"),
        }
        # Route to relevant scopes
        scopes = []
        oid = ev.get("aggregate_id") or ""
        if oid:
            scopes.append(f"order:{oid}")
        vid = payload.get("vendor_id")
        if vid:
            scopes.append(f"vendor:{vid}")
        uid = payload.get("user_id")
        if uid:
            scopes.append(f"user:{uid}")
        await publish_to_scopes(scopes, event)
        store.mark_event_published(ev["id"])
        published += 1
    return published


def emit_event(event_type: str, aggregate_id: str,
               payload: Dict[str, Any]) -> int:
    """Write to outbox (sync). SSE delivery happens via drain_outbox_once."""
    return store.emit_event(event_type, aggregate_id, payload)


# ── External channel stubs (honest: not real delivery) ───────────────────
def dispatch_external_channels(notification: Dict[str, Any]) -> Dict[str, str]:
    """
    Attempt non-in-app channels. Returns per-channel status.
    Without configured providers these honestly report 'not_configured'.
    """
    results = {"email": "not_configured", "sms": "not_configured",
               "whatsapp": "not_configured"}
    # Provider adapters would go here, gated by env vars:
    #   SMTP_HOST/SMTP_USER, TWILIO_SID/TWILIO_TOKEN, WHATSAPP_TOKEN
    return results
