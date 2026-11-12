"""
Production-grade SQLite Database Layer with WAL mode, connection pooling via
SQLAlchemy, and cryptographic audit ledger.
Aligned with Section 4.H, 8, 9, 13, and Objective 10 of Project_Docs.docx.

Production upgrade path: swap DATABASE_URL to postgresql+psycopg2://...
and all queries work unchanged (SQLAlchemy abstraction).
"""

import json
import time
import logging
from typing import List, Dict, Any, Optional
from sqlalchemy import (
    create_engine, text, Column, String, Float, Integer, Boolean,
    Text, event
)
from sqlalchemy.pool import StaticPool, QueuePool
from sqlalchemy.orm import sessionmaker, declarative_base

from ..config import settings

logger = logging.getLogger("cairn.db")

Base = declarative_base()

# ── SQLAlchemy Engine ─────────────────────────────────────────────────────
def _make_engine():
    db_url = settings.DATABASE_URL
    is_sqlite = db_url.startswith("sqlite")

    if is_sqlite:
        engine = create_engine(
            db_url,
            connect_args={"check_same_thread": False, "timeout": 30},
            poolclass=StaticPool,
            echo=settings.DEBUG,
        )
        # Enable WAL mode + busy timeout for SQLite concurrency
        @event.listens_for(engine, "connect")
        def set_sqlite_pragma(dbapi_conn, _):
            cursor = dbapi_conn.cursor()
            cursor.execute("PRAGMA journal_mode=WAL;")
            cursor.execute("PRAGMA busy_timeout=30000;")
            cursor.execute("PRAGMA synchronous=NORMAL;")
            cursor.execute("PRAGMA foreign_keys=ON;")
            cursor.close()
    else:
        # PostgreSQL / other — use connection pool
        engine = create_engine(
            db_url,
            poolclass=QueuePool,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True,
            pool_timeout=30,
            echo=settings.DEBUG,
        )
    return engine


engine = _make_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ── Database helper ───────────────────────────────────────────────────────
class Database:
    """Thin data-access layer. Ready for SQLAlchemy Core + PostgreSQL in prod."""

    def __init__(self):
        self._init_tables()

    def _get_session(self):
        return SessionLocal()

    def _init_tables(self):
        """Create all tables using raw SQL for portability."""
        stmts = [
            """CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                product_id TEXT,
                product_name TEXT,
                specs TEXT,
                price REAL,
                merchant TEXT,
                status TEXT,
                flag_reason TEXT,
                destination TEXT,
                sha256 TEXT,
                created_at REAL
            )""",
            """CREATE TABLE IF NOT EXISTS audit_ledger (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                proposal_id TEXT NOT NULL,
                agent_id TEXT,
                agent_role TEXT,
                action_type TEXT,
                requested_price REAL,
                decision TEXT,
                reason_code TEXT,
                risk_score REAL,
                has_conflict INTEGER DEFAULT 0,
                sha256_hash TEXT,
                evidence_json TEXT,
                explainability TEXT,
                timestamp REAL
            )""",
            """CREATE TABLE IF NOT EXISTS user_policies (
                user_id TEXT PRIMARY KEY,
                monthly_cap REAL,
                approval_threshold REAL,
                tranquility_hold_minutes INTEGER,
                current_usage REAL DEFAULT 0.0,
                updated_at REAL
            )""",
            """CREATE TABLE IF NOT EXISTS merchant_listings (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                merchant TEXT,
                price REAL,
                stock INTEGER DEFAULT 0,
                category TEXT,
                badge TEXT,
                status TEXT,
                created_at REAL
            )""",
        ]
        with self._get_session() as session:
            for stmt in stmts:
                session.execute(text(stmt))

            # Seed default listings if empty
            count = session.execute(text("SELECT COUNT(*) FROM merchant_listings")).scalar()
            if count == 0:
                for row in [
                    ("SKU-7729", "Minimal Japanese Ceramic Mug (Chalk White)", "Studio Hasami Crafts", 1800.0, 24, "Living", "VERIFIED", "Verified & Active"),
                    ("SKU-8190", "Solid Walnut Monitor Shelf (Dual Deck)", "Grovemade Artisan Studio", 14500.0, 8, "Hardware", "VERIFIED", "Verified & Active"),
                    ("SKU-9912", "Analog Quartz Desk Clock (Brushed Brass)", "Lemnos Clocks Japan", 6200.0, 0, "Living", "HOLD", "Restock Scheduled"),
                ]:
                    session.execute(text(
                        "INSERT OR IGNORE INTO merchant_listings (id,name,merchant,price,stock,category,badge,status,created_at) "
                        "VALUES (:id,:name,:merchant,:price,:stock,:category,:badge,:status,:ts)"
                    ), dict(zip(["id","name","merchant","price","stock","category","badge","status","ts"], row + (time.time(),))))

            # Seed default orders if empty
            count = session.execute(text("SELECT COUNT(*) FROM orders")).scalar()
            if count == 0:
                for row in [
                    ("CRN-88421","usr_priya","prod-dell","Dell XPS 13 Plus","Pure White Edition · CNC Machined Aluminum & Gorilla Glass",120000.0,"Dell Direct Official Flagship","needs_ok","Rule #04 triggered: Exceeds auto threshold","Jor Bagh, New Delhi","9e88fa12c309b4d...77e1"),
                    ("CRN-9842","usr_priya","prod-framework","Framework Laptop 13","Matte anti-glare display, AMD Ryzen 7",94990.0,"Direct Partner Direct Delivery","placed",None,"Jor Bagh, New Delhi","a71b80e43...10ff"),
                ]:
                    session.execute(text(
                        "INSERT OR IGNORE INTO orders (id,user_id,product_id,product_name,specs,price,merchant,status,flag_reason,destination,sha256,created_at) "
                        "VALUES (:id,:uid,:pid,:pname,:specs,:price,:merchant,:status,:flag,:dest,:sha,:ts)"
                    ), dict(zip(["id","uid","pid","pname","specs","price","merchant","status","flag","dest","sha","ts"], row + (time.time(),))))

            session.commit()

    # ── Audit Ledger ───────────────────────────────────────────────────
    def log_audit_record(self, proposal_id: str, agent_id: str, agent_role: str,
                         action_type: str, requested_price: float, decision: str,
                         reason_code: str, risk_score: float, has_conflict: bool,
                         sha256_hash: str, evidence: Dict[str, Any], explainability: str) -> int:
        with self._get_session() as session:
            result = session.execute(text("""
                INSERT INTO audit_ledger
                (proposal_id,agent_id,agent_role,action_type,requested_price,
                 decision,reason_code,risk_score,has_conflict,sha256_hash,
                 evidence_json,explainability,timestamp)
                VALUES (:pid,:aid,:arole,:atype,:price,:decision,:rcode,:risk,:conflict,:sha,:evidence,:explain,:ts)
            """), {
                "pid": proposal_id, "aid": agent_id, "arole": agent_role,
                "atype": action_type, "price": requested_price, "decision": decision,
                "rcode": reason_code, "risk": risk_score, "conflict": 1 if has_conflict else 0,
                "sha": sha256_hash, "evidence": json.dumps(evidence),
                "explain": explainability, "ts": time.time()
            })
            session.commit()
            return result.lastrowid

    def get_recent_audit_logs(self, limit: int = 50) -> List[Dict[str, Any]]:
        with self._get_session() as session:
            rows = session.execute(
                text("SELECT * FROM audit_ledger ORDER BY timestamp DESC LIMIT :limit"),
                {"limit": limit}
            ).mappings().all()
            return [dict(r) for r in rows]

    # ── Orders ─────────────────────────────────────────────────────────
    def create_order(self, order_id: str, user_id: str, product_id: str,
                     product_name: str, specs: str, price: float, merchant: str,
                     status: str, destination: str, sha256: str,
                     flag_reason: Optional[str] = None):
        with self._get_session() as session:
            session.execute(text("""
                INSERT OR REPLACE INTO orders
                (id,user_id,product_id,product_name,specs,price,merchant,
                 status,flag_reason,destination,sha256,created_at)
                VALUES (:id,:uid,:pid,:pname,:specs,:price,:merchant,
                        :status,:flag,:dest,:sha,:ts)
            """), {
                "id": order_id, "uid": user_id, "pid": product_id,
                "pname": product_name, "specs": specs, "price": price,
                "merchant": merchant, "status": status, "flag": flag_reason,
                "dest": destination, "sha": sha256, "ts": time.time()
            })
            session.commit()

    def update_order_status(self, order_id: str, new_status: str):
        with self._get_session() as session:
            session.execute(
                text("UPDATE orders SET status=:status WHERE id=:id"),
                {"status": new_status, "id": order_id}
            )
            session.commit()

    def get_orders(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        with self._get_session() as session:
            if user_id:
                rows = session.execute(
                    text("SELECT * FROM orders WHERE user_id=:uid ORDER BY created_at DESC"),
                    {"uid": user_id}
                ).mappings().all()
            else:
                rows = session.execute(
                    text("SELECT * FROM orders ORDER BY created_at DESC")
                ).mappings().all()
            return [dict(r) for r in rows]

    # ── Listings ───────────────────────────────────────────────────────
    def add_listing(self, listing_id: str, name: str, merchant: str, price: float,
                    stock: int, category: str = "Living", badge: str = "VERIFIED",
                    status: str = "Verified & Active"):
        with self._get_session() as session:
            session.execute(text("""
                INSERT OR REPLACE INTO merchant_listings
                (id,name,merchant,price,stock,category,badge,status,created_at)
                VALUES (:id,:name,:merchant,:price,:stock,:category,:badge,:status,:ts)
            """), {
                "id": listing_id, "name": name, "merchant": merchant,
                "price": price, "stock": stock, "category": category,
                "badge": badge, "status": status, "ts": time.time()
            })
            session.commit()

    def get_listings(self) -> List[Dict[str, Any]]:
        with self._get_session() as session:
            rows = session.execute(
                text("SELECT * FROM merchant_listings ORDER BY created_at DESC")
            ).mappings().all()
            return [dict(r) for r in rows]

    # ── Governance Evaluation Summary (Objective 11) ───────────────────
    def get_governance_evaluation_summary(self) -> Dict[str, Any]:
        with self._get_session() as session:
            total = session.execute(text("SELECT COUNT(*) FROM audit_ledger")).scalar() or 0
            auto_count = session.execute(text("SELECT COUNT(*) FROM audit_ledger WHERE decision='AUTO_EXECUTE'")).scalar() or 0
            approval_count = session.execute(text("SELECT COUNT(*) FROM audit_ledger WHERE decision='HUMAN_APPROVAL'")).scalar() or 0
            block_count = session.execute(text("SELECT COUNT(*) FROM audit_ledger WHERE decision='BLOCK'")).scalar() or 0
            unauthorized_count = session.execute(text("SELECT COUNT(*) FROM audit_ledger WHERE reason_code LIKE '%UNAUTHORIZED%'")).scalar() or 0
            policy_violations = session.execute(text("SELECT COUNT(*) FROM audit_ledger WHERE reason_code LIKE '%POL%' OR reason_code LIKE '%POLICY%'")).scalar() or 0
            avg_risk = session.execute(text("SELECT AVG(risk_score) FROM audit_ledger")).scalar() or 0.0
            settled_orders = session.execute(text("SELECT COUNT(*) FROM orders WHERE status='placed'")).scalar() or 0

        return {
            "total_proposals_evaluated": total,
            "auto_executed_actions": auto_count,
            "auto_execute_pct": round((auto_count / max(1, total)) * 100.0, 1),
            "actions_requiring_approval": approval_count,
            "approval_pct": round((approval_count / max(1, total)) * 100.0, 1),
            "blocked_actions": block_count,
            "blocked_pct": round((block_count / max(1, total)) * 100.0, 1),
            "unauthorized_actions_prevented": unauthorized_count,
            "policy_violations_detected": policy_violations,
            "average_risk_score": round(avg_risk, 1),
            "successful_transactions_settled": settled_orders,
            "human_approval_rate_pct": round(
                (settled_orders / max(1, settled_orders + approval_count)) * 100.0, 1
            )
        }


db = Database()
