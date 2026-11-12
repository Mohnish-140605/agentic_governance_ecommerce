"""
SQLite Database Layer and Cryptographic Audit Ledger.
Stores products, orders, user policies, and immutable governance decisions with SHA-256 hashes.
Aligned with Section 4.H, 8, 9, 13, and Objective 10 of Project_Docs.docx.
"""

import sqlite3
import json
import os
import time
from typing import List, Dict, Any, Optional

DB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "database")
DB_PATH = os.path.join(DB_DIR, "cairn.db")

class Database:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self._init_tables()

    def _get_connection(self):
        conn = sqlite3.connect(self.db_path, timeout=30.0)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA busy_timeout=30000;")
        return conn

    def _init_tables(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # 1. Orders Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS orders (
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
            )
            """)

            # 2. Immutable Cryptographic Audit Ledger Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS audit_ledger (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                proposal_id TEXT,
                agent_id TEXT,
                agent_role TEXT,
                action_type TEXT,
                requested_price REAL,
                decision TEXT,
                reason_code TEXT,
                risk_score REAL,
                has_conflict INTEGER,
                sha256_hash TEXT,
                evidence_json TEXT,
                explainability TEXT,
                timestamp REAL
            )
            """)

            # 3. User Policies Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_policies (
                user_id TEXT PRIMARY KEY,
                monthly_cap REAL,
                approval_threshold REAL,
                tranquility_hold_minutes INTEGER,
                current_usage REAL,
                updated_at REAL
            )
            """)

            # 4. Merchant Artisan Listings Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS merchant_listings (
                id TEXT PRIMARY KEY,
                name TEXT,
                merchant TEXT,
                price REAL,
                stock INTEGER,
                category TEXT,
                badge TEXT,
                status TEXT,
                created_at REAL
            )
            """)

            # Seed default listings if table is empty
            cursor.execute("SELECT COUNT(*) FROM merchant_listings")
            if cursor.fetchone()[0] == 0:
                default_listings = [
                    ('SKU-7729', 'Minimal Japanese Ceramic Mug (Chalk White)', 'Studio Hasami Crafts', 1800.0, 24, 'Living', 'VERIFIED', 'Verified & Active', time.time()),
                    ('SKU-8190', 'Solid Walnut Monitor Shelf (Dual Deck)', 'Grovemade Artisan Studio', 14500.0, 8, 'Hardware', 'VERIFIED', 'Verified & Active', time.time()),
                    ('SKU-9912', 'Analog Quartz Desk Clock (Brushed Brass)', 'Lemnos Clocks Japan', 6200.0, 0, 'Living', 'HOLD', 'Restock Scheduled', time.time())
                ]
                cursor.executemany("""
                INSERT INTO merchant_listings (id, name, merchant, price, stock, category, badge, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, default_listings)

            # Seed default orders if table is empty
            cursor.execute("SELECT COUNT(*) FROM orders")
            if cursor.fetchone()[0] == 0:
                default_orders = [
                    ('CRN-88421', 'usr_priya', 'prod-dell', 'Dell XPS 13 Plus', 'Pure White Edition · CNC Machined Aluminum & Gorilla Glass', 120000.0, 'Dell Direct Official Flagship', 'needs_ok', 'Rule #04 triggered: Exceeds auto threshold ₹1,20,000 > ₹1,00,000 limit', 'Jor Bagh, New Delhi', '9e88fa12c309b4d...77e1', time.time()),
                    ('CRN-9842', 'usr_priya', 'prod-framework', 'Framework Laptop 13', 'Matte anti-glare display, AMD Ryzen 7, swappable USB-C modular chassis', 94990.0, 'Direct Partner Direct Delivery', 'placed', None, 'Jor Bagh, New Delhi', 'a71b80e43...10ff', time.time())
                ]
                cursor.executemany("""
                INSERT INTO orders (id, user_id, product_id, product_name, specs, price, merchant, status, flag_reason, destination, sha256, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, default_orders)

            conn.commit()

    def log_audit_record(
        self,
        proposal_id: str,
        agent_id: str,
        agent_role: str,
        action_type: str,
        requested_price: float,
        decision: str,
        reason_code: str,
        risk_score: float,
        has_conflict: bool,
        sha256_hash: str,
        evidence: Dict[str, Any],
        explainability: str
    ) -> int:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO audit_ledger (
                proposal_id, agent_id, agent_role, action_type, requested_price,
                decision, reason_code, risk_score, has_conflict, sha256_hash,
                evidence_json, explainability, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                proposal_id, agent_id, agent_role, action_type, requested_price,
                decision, reason_code, risk_score, 1 if has_conflict else 0, sha256_hash,
                json.dumps(evidence), explainability, time.time()
            ))
            conn.commit()
            return cursor.lastrowid

    def get_recent_audit_logs(self, limit: int = 50) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM audit_ledger ORDER BY timestamp DESC LIMIT ?", (limit,))
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def create_order(
        self,
        order_id: str,
        user_id: str,
        product_id: str,
        product_name: str,
        specs: str,
        price: float,
        merchant: str,
        status: str,
        destination: str,
        sha256: str,
        flag_reason: Optional[str] = None
    ):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT OR REPLACE INTO orders (
                id, user_id, product_id, product_name, specs, price, merchant,
                status, flag_reason, destination, sha256, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                order_id, user_id, product_id, product_name, specs, price, merchant,
                status, flag_reason, destination, sha256, time.time()
            ))
            conn.commit()

    def update_order_status(self, order_id: str, new_status: str):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE orders SET status = ? WHERE id = ?", (new_status, order_id))
            conn.commit()

    def get_orders(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            if user_id:
                cursor.execute("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
            else:
                cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
            return [dict(row) for row in rows]

    def add_listing(
        self,
        listing_id: str,
        name: str,
        merchant: str,
        price: float,
        stock: int,
        category: str = "Living",
        badge: str = "VERIFIED",
        status: str = "Verified & Active"
    ):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT OR REPLACE INTO merchant_listings (
                id, name, merchant, price, stock, category, badge, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (listing_id, name, merchant, price, stock, category, badge, status, time.time()))
            conn.commit()

    def get_listings(self) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM merchant_listings ORDER BY created_at DESC")
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def get_governance_evaluation_summary(self) -> Dict[str, Any]:
        """
        Calculates research evaluation parameters per Objective 11 of Project_Docs.docx:
        - Auto-executed actions count
        - Actions requiring approval count
        - Blocked actions count
        - Policy violations detected
        - Unauthorized actions prevented
        """
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM audit_ledger")
            total = cursor.fetchone()[0] or 0

            cursor.execute("SELECT COUNT(*) FROM audit_ledger WHERE decision = 'AUTO_EXECUTE'")
            auto_count = cursor.fetchone()[0] or 0

            cursor.execute("SELECT COUNT(*) FROM audit_ledger WHERE decision = 'HUMAN_APPROVAL'")
            approval_count = cursor.fetchone()[0] or 0

            cursor.execute("SELECT COUNT(*) FROM audit_ledger WHERE decision = 'BLOCK'")
            block_count = cursor.fetchone()[0] or 0

            cursor.execute("SELECT COUNT(*) FROM audit_ledger WHERE reason_code LIKE '%UNAUTHORIZED%'")
            unauthorized_count = cursor.fetchone()[0] or 0

            cursor.execute("SELECT COUNT(*) FROM audit_ledger WHERE reason_code LIKE '%POL%' OR reason_code LIKE '%POLICY%'")
            policy_violations = cursor.fetchone()[0] or 0

            cursor.execute("SELECT AVG(risk_score) FROM audit_ledger")
            avg_risk = cursor.fetchone()[0] or 0.0

            cursor.execute("SELECT COUNT(*) FROM orders WHERE status = 'placed'")
            settled_orders = cursor.fetchone()[0] or 0

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
                "human_approval_rate_pct": round((settled_orders / max(1, settled_orders + approval_count)) * 100.0, 1)
            }

db = Database()

