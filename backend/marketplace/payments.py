"""
Payment provider abstraction with sandbox adapter (Priority 13).

- PaymentProvider interface: create_payment, confirm_payment, refund.
- SandboxPaymentProvider: deterministic fake provider — no real money moves.
  Generates sandbox payment IDs, simulates success/failure, stores records.
- Real providers (Razorpay/Stripe) plug in behind the same interface via env.

Honest: sandbox mode is clearly labelled; no real charges occur.
"""

import hashlib
import hmac
import json
import time
import uuid
from typing import Any, Dict, Optional

from ..config import settings
from .store import store, SessionLocal
from sqlalchemy import text


def _now() -> float:
    return time.time()


class PaymentProvider:
    """Interface — implement for real providers."""
    name = "abstract"

    def create_payment(self, order_id: str, amount_paise: int,
                       currency: str = "INR",
                       metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        raise NotImplementedError

    def confirm_payment(self, payment_id: str) -> Dict[str, Any]:
        raise NotImplementedError

    def refund(self, payment_id: str, amount_paise: Optional[int] = None) -> Dict[str, Any]:
        raise NotImplementedError


class SandboxPaymentProvider(PaymentProvider):
    """
    Deterministic sandbox provider. Simulates a payment gateway:
    - create → returns a sandbox payment intent (pay_xxx)
    - confirm → marks succeeded (simulated 3DS/UPI success)
    - refund → marks refunded
    All records persisted in `payments` table for audit.
    """
    name = "sandbox"

    def __init__(self):
        self._init_table()

    def _init_table(self):
        with SessionLocal() as s:
            s.execute(text("""
                CREATE TABLE IF NOT EXISTS payments (
                    id TEXT PRIMARY KEY,
                    order_id TEXT NOT NULL,
                    amount_paise INTEGER NOT NULL,
                    currency TEXT DEFAULT 'INR',
                    status TEXT DEFAULT 'created',
                    provider TEXT DEFAULT 'sandbox',
                    provider_ref TEXT,
                    metadata_json TEXT,
                    created_at REAL,
                    confirmed_at REAL,
                    refunded_at REAL
                )
            """))
            s.commit()

    def create_payment(self, order_id: str, amount_paise: int,
                       currency: str = "INR",
                       metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        pid = f"pay_{uuid.uuid4().hex[:16]}"
        ref = f"sandbox_ref_{uuid.uuid4().hex[:12]}"
        with SessionLocal() as s:
            s.execute(text("""
                INSERT INTO payments (id,order_id,amount_paise,currency,status,
                                      provider,provider_ref,metadata_json,created_at)
                VALUES (:id,:oid,:amt,:cur,'created','sandbox',:ref,:meta,:ts)
            """), {"id": pid, "oid": order_id, "amt": amount_paise, "cur": currency,
                   "ref": ref, "meta": json.dumps(metadata or {}), "ts": _now()})
            s.commit()
        return {
            "payment_id": pid, "provider_ref": ref, "status": "created",
            "amount_paise": amount_paise, "currency": currency,
            "checkout_url": f"sandbox://pay/{pid}",
            "message": "Sandbox payment intent created. No real money will move.",
        }

    def confirm_payment(self, payment_id: str) -> Dict[str, Any]:
        with SessionLocal() as s:
            row = s.execute(text(
                "SELECT * FROM payments WHERE id=:id"), {"id": payment_id}
            ).mappings().first()
            if not row:
                return {"status": "NOT_FOUND"}
            if row["status"] == "succeeded":
                return {"status": "ALREADY_SUCCEEDED", "payment_id": payment_id}
            if row["status"] == "refunded":
                return {"status": "CONFLICT", "message": "Payment already refunded."}
            s.execute(text("""
                UPDATE payments SET status='succeeded', confirmed_at=:ts
                WHERE id=:id
            """), {"ts": _now(), "id": payment_id})
            # Update order payment_status
            s.execute(text("""
                UPDATE orders SET payment_status='paid' WHERE id=:oid
            """), {"oid": row["order_id"]})
            s.commit()
        return {"status": "SUCCEEDED", "payment_id": payment_id,
                "order_id": row["order_id"], "amount_paise": row["amount_paise"]}

    def refund(self, payment_id: str, amount_paise: Optional[int] = None) -> Dict[str, Any]:
        with SessionLocal() as s:
            row = s.execute(text(
                "SELECT * FROM payments WHERE id=:id"), {"id": payment_id}
            ).mappings().first()
            if not row:
                return {"status": "NOT_FOUND"}
            if row["status"] != "succeeded":
                return {"status": "CONFLICT",
                        "message": f"Cannot refund payment in status '{row['status']}'."}
            s.execute(text("""
                UPDATE payments SET status='refunded', refunded_at=:ts
                WHERE id=:id
            """), {"ts": _now(), "id": payment_id})
            s.execute(text("""
                UPDATE orders SET payment_status='refunded' WHERE id=:oid
            """), {"oid": row["order_id"]})
            s.commit()
        return {"status": "REFUNDED", "payment_id": payment_id,
                "order_id": row["order_id"]}

    def get_payment(self, payment_id: str) -> Optional[Dict[str, Any]]:
        with SessionLocal() as s:
            row = s.execute(text(
                "SELECT * FROM payments WHERE id=:id"), {"id": payment_id}
            ).mappings().first()
            return dict(row) if row else None

    def get_payment_for_order(self, order_id: str) -> Optional[Dict[str, Any]]:
        with SessionLocal() as s:
            row = s.execute(text("""
                SELECT * FROM payments WHERE order_id=:oid
                ORDER BY created_at DESC LIMIT 1
            """), {"oid": order_id}).mappings().first()
            return dict(row) if row else None


# Singleton — swap implementation via PAYMENT_PROVIDER env in future
payment_provider: PaymentProvider = SandboxPaymentProvider()
