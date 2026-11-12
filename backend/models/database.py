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
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
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

db = Database()

