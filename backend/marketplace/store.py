"""
Marketplace data layer: vendors, vendor products/offers, allocations,
notifications, order status history, SLA instances, inventory reservations,
outbox events.

Uses the same SQLAlchemy engine/session as backend.models.database so all
modules share one database. Prices for NEW marketplace tables are stored as
INTEGER paise; legacy `orders.price` REAL is kept for compatibility.
"""

import json
import time
import uuid
from typing import List, Dict, Any, Optional

from sqlalchemy import text

from ..models.database import SessionLocal


def _now() -> float:
    return time.time()


def _uid(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:10]}"


class MarketplaceStore:
    """Data access for the hyperlocal marketplace tables."""

    def __init__(self):
        self._init_tables()
        self._seed_if_empty()

    # ── Schema ─────────────────────────────────────────────────────────
    def _init_tables(self):
        stmts = [
            """CREATE TABLE IF NOT EXISTS vendors (
                id TEXT PRIMARY KEY,
                store_name TEXT NOT NULL,
                owner_name TEXT,
                contact_phone TEXT,
                locality TEXT NOT NULL,
                address TEXT,
                pincode TEXT,
                lat REAL NOT NULL,
                lng REAL NOT NULL,
                service_radius_km REAL DEFAULT 15.0,
                operating_hours TEXT,
                is_open INTEGER DEFAULT 1,
                verification_status TEXT DEFAULT 'verified',
                fulfilment_capacity_per_day INTEGER DEFAULT 20,
                reliability_score REAL DEFAULT 0.9,
                sla_ack_minutes INTEGER DEFAULT 30,
                sla_dispatch_minutes INTEGER DEFAULT 240,
                status TEXT DEFAULT 'active',
                is_demo INTEGER DEFAULT 1,
                created_at REAL
            )""",
            """CREATE TABLE IF NOT EXISTS vendor_products (
                id TEXT PRIMARY KEY,
                vendor_id TEXT NOT NULL,
                product_id TEXT NOT NULL,
                product_name TEXT NOT NULL,
                category TEXT,
                price_paise INTEGER NOT NULL,
                stock INTEGER NOT NULL DEFAULT 0,
                min_price_paise INTEGER,
                promo_price_paise INTEGER,
                promo_ends_at REAL,
                sku TEXT,
                specs TEXT,
                status TEXT DEFAULT 'active',
                created_at REAL,
                UNIQUE(vendor_id, product_id)
            )""",
            """CREATE TABLE IF NOT EXISTS vendor_allocations (
                id TEXT PRIMARY KEY,
                order_id TEXT NOT NULL,
                vendor_id TEXT NOT NULL,
                product_id TEXT NOT NULL,
                quantity INTEGER DEFAULT 1,
                price_paise INTEGER NOT NULL,
                distance_km REAL,
                score REAL,
                status TEXT DEFAULT 'allocated',
                buyer_locality TEXT,
                created_at REAL,
                resolved_at REAL
            )""",
            """CREATE TABLE IF NOT EXISTS notifications (
                id TEXT PRIMARY KEY,
                recipient_type TEXT NOT NULL,
                recipient_id TEXT NOT NULL,
                channel TEXT DEFAULT 'in_app',
                event_type TEXT NOT NULL,
                title TEXT,
                body TEXT,
                payload_json TEXT,
                status TEXT DEFAULT 'delivered',
                read_at REAL,
                retry_count INTEGER DEFAULT 0,
                failure_reason TEXT,
                idempotency_key TEXT UNIQUE,
                created_at REAL,
                sent_at REAL
            )""",
            """CREATE TABLE IF NOT EXISTS order_status_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id TEXT NOT NULL,
                status TEXT NOT NULL,
                actor TEXT,
                note TEXT,
                created_at REAL
            )""",
            """CREATE TABLE IF NOT EXISTS sla_instances (
                id TEXT PRIMARY KEY,
                order_id TEXT NOT NULL,
                vendor_id TEXT,
                responsible_party TEXT,
                sla_type TEXT NOT NULL,
                started_at REAL NOT NULL,
                deadline REAL NOT NULL,
                status TEXT DEFAULT 'ON_TRACK',
                breached_at REAL,
                escalation_level INTEGER DEFAULT 0,
                corrective_action TEXT,
                resolved_at REAL,
                created_at REAL
            )""",
            """CREATE TABLE IF NOT EXISTS inventory_reservations (
                id TEXT PRIMARY KEY,
                vendor_product_id TEXT NOT NULL,
                order_id TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                status TEXT DEFAULT 'active',
                expires_at REAL,
                created_at REAL,
                released_at REAL
            )""",
            """CREATE TABLE IF NOT EXISTS outbox_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_type TEXT NOT NULL,
                aggregate_id TEXT,
                payload_json TEXT,
                status TEXT DEFAULT 'pending',
                attempts INTEGER DEFAULT 0,
                created_at REAL,
                published_at REAL
            )""",
            """CREATE TABLE IF NOT EXISTS price_proposals (
                id TEXT PRIMARY KEY,
                order_id TEXT NOT NULL,
                vendor_id TEXT NOT NULL,
                product_id TEXT NOT NULL,
                proposed_price_paise INTEGER NOT NULL,
                reason TEXT,
                status TEXT DEFAULT 'pending_buyer',
                created_at REAL,
                resolved_at REAL
            )""",
        ]
        with SessionLocal() as session:
            for stmt in stmts:
                session.execute(text(stmt))
            # Extend legacy orders table with vendor columns (idempotent)
            for col, ddl in [
                ("vendor_id", "ALTER TABLE orders ADD COLUMN vendor_id TEXT"),
                ("vendor_name", "ALTER TABLE orders ADD COLUMN vendor_name TEXT"),
                ("vendor_locality", "ALTER TABLE orders ADD COLUMN vendor_locality TEXT"),
                ("distance_km", "ALTER TABLE orders ADD COLUMN distance_km REAL"),
                ("price_paise", "ALTER TABLE orders ADD COLUMN price_paise INTEGER"),
                ("allocation_id", "ALTER TABLE orders ADD COLUMN allocation_id TEXT"),
                ("payment_status", "ALTER TABLE orders ADD COLUMN payment_status TEXT"),
                ("carrier_name", "ALTER TABLE orders ADD COLUMN carrier_name TEXT"),
                ("tracking_ref", "ALTER TABLE orders ADD COLUMN tracking_ref TEXT"),
            ]:
                try:
                    session.execute(text(ddl))
                except Exception:
                    pass  # column already exists
            session.commit()

    # ── Seed data ──────────────────────────────────────────────────────
    def _seed_if_empty(self):
        with SessionLocal() as session:
            count = session.execute(text("SELECT COUNT(*) FROM vendors")).scalar() or 0
            if count > 0:
                return

        vendors = [
            # id, store, owner, locality, address, pincode, lat, lng, radius_km, hours, capacity, reliability, ack_min, dispatch_min
            ("VEN-BLR-001", "TechHub Indiranagar", "Demo Vendor One", "Indiranagar", "100 Feet Road, Indiranagar (synthetic)", "560038", 12.9784, 77.6408, 12.0, "09:00-21:00", 25, 0.95, 20, 180),
            ("VEN-BLR-002", "GadgetPoint Koramangala", "Demo Vendor Two", "Koramangala", "80 Feet Road, Koramangala (synthetic)", "560034", 12.9279, 77.6271, 10.0, "10:00-22:00", 20, 0.90, 30, 240),
            ("VEN-BLR-003", "Byte Bazaar HSR", "Demo Vendor Three", "HSR Layout", "27th Main, HSR Layout (synthetic)", "560102", 12.9141, 77.6473, 8.0, "09:30-21:30", 15, 0.88, 45, 300),
            ("VEN-BLR-004", "ElectroMart Whitefield", "Demo Vendor Four", "Whitefield", "ITPL Main Road, Whitefield (synthetic)", "560066", 12.9698, 77.7500, 15.0, "09:00-22:00", 30, 0.92, 25, 210),
            ("VEN-BLR-005", "Laptop Lane Jayanagar", "Demo Vendor Five", "Jayanagar", "4th Block, Jayanagar (synthetic)", "560011", 12.9260, 77.5950, 10.0, "10:00-20:00", 12, 0.85, 60, 360),
            ("VEN-BLR-006", "Silicon Sphere Malleshwaram", "Demo Vendor Six", "Malleshwaram", "15th Cross, Malleshwaram (synthetic)", "560003", 12.9856, 77.5700, 12.0, "09:00-21:00", 22, 0.93, 30, 240),
            ("VEN-BLR-007", "Compute Corner Rajajinagar", "Demo Vendor Seven", "Rajajinagar", "Dr Rajkumar Road, Rajajinagar (synthetic)", "560010", 12.9970, 77.5580, 10.0, "10:00-20:30", 10, 0.80, 90, 420),
            ("VEN-BLR-008", "TechNest Electronic City", "Demo Vendor Eight", "Electronic City", "Phase 1, Electronic City (synthetic)", "560100", 12.8456, 77.6600, 20.0, "09:00-21:00", 35, 0.89, 40, 300),
            ("VEN-BLR-009", "Gizmo Hub Marathahalli", "Demo Vendor Nine", "Marathahalli", "Outer Ring Road, Marathahalli (synthetic)", "560037", 12.9591, 77.7011, 14.0, "09:30-21:30", 18, 0.91, 35, 270),
            ("VEN-BLR-010", "Device Den BTM", "Demo Vendor Ten", "BTM Layout", "BTM Main Road, BTM Layout (synthetic)", "560076", 12.9166, 77.6101, 9.0, "10:00-21:00", 14, 0.87, 50, 330),
        ]

        # product_id, name, category, specs — shared catalogue; each vendor
        # offers its own price/stock (Priority 2 requirement).
        products = [
            ("prod-dell-xps", "Dell XPS 13", "Laptop", "Intel Core i7 · 16GB · 512GB SSD"),
            ("prod-framework", "Framework Laptop 13", "Laptop", "AMD Ryzen 7 · 32GB · 1TB SSD"),
            ("prod-macbook-air", "MacBook Air 13 M3", "Laptop", "Apple M3 · 8GB · 256GB"),
            ("prod-monitor", "Dell UltraSharp 27 Monitor", "Display", "27\" 4K IPS · USB-C"),
            ("prod-keyboard", "Keychron K8 Pro Keyboard", "Accessory", "Hot-swappable · RGB"),
            ("prod-headphones", "Sony WH-1000XM5", "Audio", "Wireless ANC Headphones"),
        ]

        # vendor_id -> {product_id: (price_paise, stock)}
        offers = {
            "VEN-BLR-001": {
                "prod-dell-xps": (11800000, 5), "prod-framework": (9499000, 3),
                "prod-macbook-air": (13490000, 2), "prod-monitor": (2899000, 8),
                "prod-keyboard": (1299000, 15), "prod-headphones": (2699000, 6),
            },
            "VEN-BLR-002": {
                "prod-dell-xps": (12000000, 8), "prod-framework": (9699000, 4),
                "prod-macbook-air": (13490000, 0), "prod-monitor": (2799000, 10),
                "prod-keyboard": (1199000, 20), "prod-headphones": (2599000, 9),
            },
            "VEN-BLR-003": {
                "prod-dell-xps": (11750000, 2), "prod-framework": (9399000, 2),
                "prod-macbook-air": (13290000, 1), "prod-monitor": (2999000, 4),
                "prod-keyboard": (1399000, 6), "prod-headphones": (2499000, 3),
            },
            "VEN-BLR-004": {
                "prod-dell-xps": (11600000, 0), "prod-framework": (9299000, 6),
                "prod-macbook-air": (13190000, 3), "prod-monitor": (2699000, 12),
                "prod-keyboard": (1099000, 25), "prod-headphones": (2399000, 11),
            },
            "VEN-BLR-005": {
                "prod-dell-xps": (12100000, 3), "prod-framework": (9799000, 1),
                "prod-macbook-air": (13690000, 0), "prod-monitor": (3099000, 2),
                "prod-keyboard": (1499000, 8), "prod-headphones": (2799000, 4),
            },
            "VEN-BLR-006": {
                "prod-dell-xps": (11950000, 6), "prod-framework": (9599000, 5),
                "prod-macbook-air": (13390000, 2), "prod-monitor": (2899000, 7),
                "prod-keyboard": (1299000, 12), "prod-headphones": (2699000, 8),
            },
            "VEN-BLR-007": {
                "prod-dell-xps": (12200000, 4), "prod-framework": (9899000, 3),
                "prod-macbook-air": (13790000, 1), "prod-monitor": (3199000, 3),
                "prod-keyboard": (1599000, 5), "prod-headphones": (2899000, 2),
            },
            "VEN-BLR-008": {
                "prod-dell-xps": (11550000, 10), "prod-framework": (9199000, 8),
                "prod-macbook-air": (13090000, 4), "prod-monitor": (2599000, 15),
                "prod-keyboard": (999000, 30), "prod-headphones": (2299000, 14),
            },
            "VEN-BLR-009": {
                "prod-dell-xps": (11850000, 7), "prod-framework": (9499000, 6),
                "prod-macbook-air": (13490000, 2), "prod-monitor": (2799000, 9),
                "prod-keyboard": (1249000, 18), "prod-headphones": (2649000, 7),
            },
            "VEN-BLR-010": {
                "prod-dell-xps": (12050000, 5), "prod-framework": (9699000, 4),
                "prod-macbook-air": (13590000, 1), "prod-monitor": (2899000, 6),
                "prod-keyboard": (1349000, 10), "prod-headphones": (2749000, 5),
            },
        }

        prod_meta = {p[0]: p for p in products}
        now = _now()
        with SessionLocal() as session:
            for v in vendors:
                (vid, store, owner, locality, addr, pin, lat, lng, radius,
                 hours, cap, rel, ack, disp) = v
                session.execute(text("""
                    INSERT INTO vendors
                    (id,store_name,owner_name,locality,address,pincode,lat,lng,
                     service_radius_km,operating_hours,is_open,verification_status,
                     fulfilment_capacity_per_day,reliability_score,sla_ack_minutes,
                     sla_dispatch_minutes,status,is_demo,created_at)
                    VALUES (:id,:store,:owner,:loc,:addr,:pin,:lat,:lng,:rad,:hours,
                            1,'verified',:cap,:rel,:ack,:disp,'active',1,:ts)
                """), {"id": vid, "store": store, "owner": owner, "loc": locality,
                       "addr": addr, "pin": pin, "lat": lat, "lng": lng, "rad": radius,
                       "hours": hours, "cap": cap, "rel": rel, "ack": ack, "disp": disp,
                       "ts": now})
            for vid, prods in offers.items():
                for pid, (price_paise, stock) in prods.items():
                    _, pname, cat, specs = prod_meta[pid]
                    session.execute(text("""
                        INSERT INTO vendor_products
                        (id,vendor_id,product_id,product_name,category,price_paise,
                         stock,specs,status,created_at)
                        VALUES (:id,:vid,:pid,:pname,:cat,:price,:stock,:specs,'active',:ts)
                    """), {"id": _uid("vp"), "vid": vid, "pid": pid, "pname": pname,
                           "cat": cat, "price": price_paise, "stock": stock,
                           "specs": specs, "ts": now})
            session.commit()

    # ── Vendors ────────────────────────────────────────────────────────
    def list_vendors(self, status: Optional[str] = None) -> List[Dict[str, Any]]:
        with SessionLocal() as session:
            if status:
                rows = session.execute(text(
                    "SELECT * FROM vendors WHERE status=:s ORDER BY id"), {"s": status}
                ).mappings().all()
            else:
                rows = session.execute(text(
                    "SELECT * FROM vendors ORDER BY id")).mappings().all()
            return [dict(r) for r in rows]

    def get_vendor(self, vendor_id: str) -> Optional[Dict[str, Any]]:
        with SessionLocal() as session:
            row = session.execute(text(
                "SELECT * FROM vendors WHERE id=:id"), {"id": vendor_id}
            ).mappings().first()
            return dict(row) if row else None

    # ── Vendor products / offers ───────────────────────────────────────
    def get_product_offers(self, product_id: str,
                           include_out_of_stock: bool = True) -> List[Dict[str, Any]]:
        with SessionLocal() as session:
            sql = """
                SELECT vp.*, v.store_name, v.locality, v.lat, v.lng,
                       v.service_radius_km, v.is_open, v.verification_status,
                       v.reliability_score, v.status AS vendor_status
                FROM vendor_products vp
                JOIN vendors v ON v.id = vp.vendor_id
                WHERE vp.product_id=:pid AND vp.status='active'
            """
            if not include_out_of_stock:
                sql += " AND vp.stock > 0"
            rows = session.execute(text(sql + " ORDER BY vp.price_paise"),
                                   {"pid": product_id}).mappings().all()
            return [dict(r) for r in rows]

    def get_vendor_product(self, vendor_id: str, product_id: str) -> Optional[Dict[str, Any]]:
        with SessionLocal() as session:
            row = session.execute(text(
                "SELECT * FROM vendor_products WHERE vendor_id=:v AND product_id=:p"),
                {"v": vendor_id, "p": product_id}).mappings().first()
            return dict(row) if row else None

    def adjust_stock(self, vendor_product_id: str, delta: int) -> bool:
        """Atomic stock adjustment; refuses to go negative."""
        with SessionLocal() as session:
            result = session.execute(text("""
                UPDATE vendor_products SET stock = stock + :delta
                WHERE id=:id AND stock + :delta >= 0
            """), {"delta": delta, "id": vendor_product_id})
            session.commit()
            return result.rowcount > 0

    def reserve_stock(self, vendor_product_id: str, order_id: str,
                      quantity: int, ttl_seconds: int = 900) -> Optional[str]:
        """
        Atomically reserve stock: decrement vendor_products.stock and create an
        inventory_reservations row in one transaction. Returns reservation id
        or None if insufficient stock.
        """
        rid = _uid("rsv")
        with SessionLocal() as session:
            dec = session.execute(text("""
                UPDATE vendor_products SET stock = stock - :qty
                WHERE id=:id AND stock >= :qty AND status='active'
            """), {"qty": quantity, "id": vendor_product_id})
            if dec.rowcount == 0:
                session.rollback()
                return None
            session.execute(text("""
                INSERT INTO inventory_reservations
                (id,vendor_product_id,order_id,quantity,status,expires_at,created_at)
                VALUES (:id,:vpid,:oid,:qty,'active',:exp,:ts)
            """), {"id": rid, "vpid": vendor_product_id, "oid": order_id,
                   "qty": quantity, "exp": _now() + ttl_seconds, "ts": _now()})
            session.commit()
            return rid

    def release_reservation(self, order_id: str) -> int:
        """Release all active reservations for an order and restore stock."""
        released = 0
        with SessionLocal() as session:
            rows = session.execute(text("""
                SELECT * FROM inventory_reservations
                WHERE order_id=:oid AND status='active'
            """), {"oid": order_id}).mappings().all()
            for r in rows:
                session.execute(text("""
                    UPDATE vendor_products SET stock = stock + :qty
                    WHERE id=:vpid
                """), {"qty": r["quantity"], "vpid": r["vendor_product_id"]})
                session.execute(text("""
                    UPDATE inventory_reservations SET status='released', released_at=:ts
                    WHERE id=:id
                """), {"ts": _now(), "id": r["id"]})
                released += 1
            session.commit()
        return released

    # ── Allocations ────────────────────────────────────────────────────
    def create_allocation(self, order_id: str, vendor_id: str, product_id: str,
                          quantity: int, price_paise: int, distance_km: float,
                          score: float, buyer_locality: str) -> str:
        aid = _uid("alloc")
        with SessionLocal() as session:
            session.execute(text("""
                INSERT INTO vendor_allocations
                (id,order_id,vendor_id,product_id,quantity,price_paise,
                 distance_km,score,status,buyer_locality,created_at)
                VALUES (:id,:oid,:vid,:pid,:qty,:price,:dist,:score,'allocated',:loc,:ts)
            """), {"id": aid, "oid": order_id, "vid": vendor_id, "pid": product_id,
                   "qty": quantity, "price": price_paise, "dist": distance_km,
                   "score": score, "loc": buyer_locality, "ts": _now()})
            session.commit()
        return aid

    def get_allocation(self, order_id: str) -> Optional[Dict[str, Any]]:
        with SessionLocal() as session:
            row = session.execute(text("""
                SELECT * FROM vendor_allocations WHERE order_id=:oid
                ORDER BY created_at DESC LIMIT 1
            """), {"oid": order_id}).mappings().first()
            return dict(row) if row else None

    def get_order_allocations(self, order_id: str) -> List[Dict[str, Any]]:
        with SessionLocal() as session:
            rows = session.execute(text("""
                SELECT * FROM vendor_allocations WHERE order_id=:oid
                ORDER BY created_at ASC
            """), {"oid": order_id}).mappings().all()
            return [dict(row) for row in rows]

    def update_allocation_status(self, allocation_id: str, status: str) -> bool:
        with SessionLocal() as session:
            result = session.execute(text("""
                UPDATE vendor_allocations SET status=:s,
                resolved_at = CASE WHEN :s IN ('accepted','rejected','reassigned') THEN :ts ELSE resolved_at END
                WHERE id=:id
            """), {"s": status, "ts": _now(), "id": allocation_id})
            session.commit()
            return result.rowcount > 0

    # ── Notifications ──────────────────────────────────────────────────
    def create_notification(self, recipient_type: str, recipient_id: str,
                            event_type: str, title: str, body: str,
                            payload: Optional[Dict[str, Any]] = None,
                            idempotency_key: Optional[str] = None,
                            channel: str = "in_app") -> Optional[str]:
        nid = _uid("ntf")
        with SessionLocal() as session:
            try:
                session.execute(text("""
                    INSERT INTO notifications
                    (id,recipient_type,recipient_id,channel,event_type,title,body,
                     payload_json,status,idempotency_key,created_at,sent_at)
                    VALUES (:id,:rt,:rid,:ch,:et,:title,:body,:payload,'delivered',:ik,:ts,:ts)
                """), {"id": nid, "rt": recipient_type, "rid": recipient_id,
                       "ch": channel, "et": event_type, "title": title, "body": body,
                       "payload": json.dumps(payload or {}), "ik": idempotency_key,
                       "ts": _now()})
                session.commit()
                return nid
            except Exception:
                session.rollback()
                return None  # idempotency key conflict → duplicate suppressed

    def list_notifications(self, recipient_type: str, recipient_id: str,
                           unread_only: bool = False, limit: int = 50) -> List[Dict[str, Any]]:
        with SessionLocal() as session:
            sql = """SELECT * FROM notifications
                     WHERE recipient_type=:rt AND recipient_id=:rid"""
            params = {"rt": recipient_type, "rid": recipient_id, "limit": limit}
            if unread_only:
                sql += " AND read_at IS NULL"
            rows = session.execute(text(sql + " ORDER BY created_at DESC LIMIT :limit"),
                                   params).mappings().all()
            notifications = [dict(row) for row in rows]
            for notification in notifications:
                notification["payload"] = json.loads(notification.get("payload_json") or "{}")
            return notifications

    def mark_notification_read(self, notification_id: str, recipient_id: str) -> bool:
        with SessionLocal() as session:
            result = session.execute(text("""
                UPDATE notifications SET read_at=:ts
                WHERE id=:id AND recipient_id=:rid AND read_at IS NULL
            """), {"ts": _now(), "id": notification_id, "rid": recipient_id})
            session.commit()
            return result.rowcount > 0

    # ── Order status history ───────────────────────────────────────────
    def record_order_status(self, order_id: str, status: str,
                            actor: str = "system", note: str = "") -> None:
        with SessionLocal() as session:
            session.execute(text("""
                INSERT INTO order_status_history (order_id,status,actor,note,created_at)
                VALUES (:oid,:s,:actor,:note,:ts)
            """), {"oid": order_id, "s": status, "actor": actor,
                   "note": note, "ts": _now()})
            session.commit()

    def get_order_history(self, order_id: str) -> List[Dict[str, Any]]:
        with SessionLocal() as session:
            rows = session.execute(text("""
                SELECT * FROM order_status_history WHERE order_id=:oid
                ORDER BY created_at ASC
            """), {"oid": order_id}).mappings().all()
            return [dict(r) for r in rows]

    # ── SLA instances ──────────────────────────────────────────────────
    def create_sla_instance(self, sla_id: str, order_id: str, vendor_id: str,
                            sla_type: str, deadline_seconds: float,
                            responsible_party: str = "vendor") -> str:
        with SessionLocal() as session:
            session.execute(text("""
                INSERT INTO sla_instances
                (id,order_id,vendor_id,responsible_party,sla_type,started_at,
                 deadline,status,created_at)
                VALUES (:id,:oid,:vid,:party,:type,:start,:deadline,'ON_TRACK',:ts)
            """), {"id": sla_id, "oid": order_id, "vid": vendor_id,
                   "party": responsible_party, "type": sla_type,
                   "start": _now(), "deadline": _now() + deadline_seconds,
                   "ts": _now()})
            session.commit()
        return sla_id

    def get_sla_instances(self, order_id: Optional[str] = None,
                          vendor_id: Optional[str] = None,
                          status: Optional[str] = None) -> List[Dict[str, Any]]:
        sql = "SELECT * FROM sla_instances WHERE 1=1"
        params: Dict[str, Any] = {}
        if order_id:
            sql += " AND order_id=:oid"; params["oid"] = order_id
        if vendor_id:
            sql += " AND vendor_id=:vid"; params["vid"] = vendor_id
        if status:
            sql += " AND status=:st"; params["st"] = status
        sql += " ORDER BY deadline ASC"
        with SessionLocal() as session:
            rows = session.execute(text(sql), params).mappings().all()
            return [dict(r) for r in rows]

    def update_sla_status(self, sla_id: str, status: str,
                          corrective_action: Optional[str] = None) -> bool:
        with SessionLocal() as session:
            result = session.execute(text("""
                UPDATE sla_instances SET status=:s,
                breached_at = CASE WHEN :s='BREACHED' AND breached_at IS NULL THEN :ts ELSE breached_at END,
                resolved_at = CASE WHEN :s='RESOLVED' THEN :ts ELSE resolved_at END,
                corrective_action = COALESCE(:ca, corrective_action)
                WHERE id=:id
            """), {"s": status, "ts": _now(), "ca": corrective_action, "id": sla_id})
            session.commit()
            return result.rowcount > 0

    def check_sla_breaches(self) -> List[Dict[str, Any]]:
        """Mark ON_TRACK instances past deadline as BREACHED; return them."""
        now = _now()
        breached = []
        with SessionLocal() as session:
            rows = session.execute(text("""
                SELECT * FROM sla_instances
                WHERE status IN ('ON_TRACK','AT_RISK') AND deadline < :now
            """), {"now": now}).mappings().all()
            for r in rows:
                session.execute(text("""
                    UPDATE sla_instances SET status='BREACHED', breached_at=:ts
                    WHERE id=:id
                """), {"ts": now, "id": r["id"]})
                breached.append(dict(r))
            session.commit()
        return breached

    # ── Outbox events ──────────────────────────────────────────────────
    def emit_event(self, event_type: str, aggregate_id: str,
                   payload: Dict[str, Any]) -> int:
        with SessionLocal() as session:
            result = session.execute(text("""
                INSERT INTO outbox_events (event_type,aggregate_id,payload_json,status,created_at)
                VALUES (:et,:aid,:payload,'pending',:ts)
            """), {"et": event_type, "aid": aggregate_id,
                   "payload": json.dumps(payload), "ts": _now()})
            session.commit()
            return result.lastrowid or 0

    def pending_events(self, limit: int = 100) -> List[Dict[str, Any]]:
        with SessionLocal() as session:
            rows = session.execute(text("""
                SELECT * FROM outbox_events WHERE status='pending'
                ORDER BY id ASC LIMIT :limit
            """), {"limit": limit}).mappings().all()
            return [dict(r) for r in rows]

    def mark_event_published(self, event_id: int) -> None:
        with SessionLocal() as session:
            session.execute(text("""
                UPDATE outbox_events SET status='published', published_at=:ts
                WHERE id=:id
            """), {"ts": _now(), "id": event_id})
            session.commit()

    # ── Price proposals ────────────────────────────────────────────────
    def create_price_proposal(self, order_id: str, vendor_id: str,
                              product_id: str, proposed_price_paise: int,
                              reason: str = "") -> str:
        pid = _uid("pp")
        with SessionLocal() as session:
            session.execute(text("""
                INSERT INTO price_proposals
                (id,order_id,vendor_id,product_id,proposed_price_paise,reason,status,created_at)
                VALUES (:id,:oid,:vid,:prod,:price,:reason,'pending_buyer',:ts)
            """), {"id": pid, "oid": order_id, "vid": vendor_id, "prod": product_id,
                   "price": proposed_price_paise, "reason": reason, "ts": _now()})
            session.commit()
        return pid

    def get_price_proposal(self, proposal_id: str) -> Optional[Dict[str, Any]]:
        with SessionLocal() as session:
            row = session.execute(text(
                "SELECT * FROM price_proposals WHERE id=:id"), {"id": proposal_id}
            ).mappings().first()
            return dict(row) if row else None

    def resolve_price_proposal(self, proposal_id: str, status: str) -> bool:
        with SessionLocal() as session:
            result = session.execute(text("""
                UPDATE price_proposals SET status=:s, resolved_at=:ts WHERE id=:id
            """), {"s": status, "ts": _now(), "id": proposal_id})
            session.commit()
            return result.rowcount > 0


store = MarketplaceStore()
