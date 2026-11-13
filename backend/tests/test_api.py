"""
Integration tests for FastAPI endpoints, verifying agents, governance, SLA, and audit endpoints.
"""

import pytest
import os
from fastapi.testclient import TestClient

os.environ["DATABASE_URL"] = "sqlite://"

from backend.main import app, db
from backend.sla.telemetry import SLAMonitor

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Cairn" in data["service"]
    assert data["llm"]["provider"] == "ollama"
    assert data["llm"]["model"]

def test_merchant_data_does_not_start_with_demo_records():
    assert client.get("/api/listings").json() == []
    assert client.get("/api/orders").json() == []

def test_agent_chat_auto_execute():
    # Quiet study laptop under ₹30,000 -> Should Auto-Execute Lenovo IdeaPad
    response = client.post("/api/agents/chat", json={
        "query": "Find me a quiet study laptop under ₹30,000",
        "user_id": "usr_priya"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    gov = data["workflow_state"]["governance_result"]
    assert gov["decision"] == "AUTO_EXECUTE"
    assert client.get("/api/orders?user_id=usr_priya").json() == []
    assert "telemetry" in data
    assert data["telemetry"]["gov_latency_ms"] <= 500.0  # SLA target

def test_agent_chat_approval_hold():
    # Dell XPS 13 Plus -> Should be held for human approval
    response = client.post("/api/agents/chat", json={
        "query": "I want to order the Dell XPS 13 Plus for ₹1,20,000",
        "user_id": "usr_explicit_approval",
        "explicit_order": True
    })
    assert response.status_code == 200
    data = response.json()
    gov = data["workflow_state"]["governance_result"]
    assert gov["decision"] in ["HUMAN_APPROVAL", "BLOCK"]
    assert len(gov["audit_hash"]) == 64
    proposal_id = data["workflow_state"]["proposal"]["proposal_id"]
    orders = client.get("/api/orders?user_id=usr_explicit_approval").json()
    if gov["decision"] == "HUMAN_APPROVAL":
        assert any(order["id"] == f"CRN-{proposal_id[-5:]}" for order in orders)
    else:
        assert orders == []

def test_approval_does_not_report_success_for_unknown_order():
    response = client.post("/api/governance/approve", json={
        "proposal_id": "PROP-UNKNOWN",
        "approval_token": "test-token",
        "user_id": "usr_priya",
        "decision": "APPROVE"
    })
    assert response.status_code == 404

def test_explicit_order_is_not_confirmed_when_persistence_fails(monkeypatch):
    def fail_create_order(**kwargs):
        raise RuntimeError("database unavailable")

    monkeypatch.setattr(db, "create_order", fail_create_order)
    response = client.post("/api/agents/chat", json={
        "query": "Find me a quiet study laptop under ₹30,000",
        "user_id": "usr_persistence_failure",
        "explicit_order": True
    })
    assert response.status_code == 503
    assert "No order was confirmed" in response.json()["detail"]

def test_sla_metrics_endpoint():
    response = client.get("/api/sla/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "gov_p95_ms" in data
    assert "llm_p95_s" in data
    if data["total_evaluations"]:
        assert data["gov_p95_ms"] <= 500.0
        assert data["enforcement_pct"] == 100.0
        assert data["audit_completeness_pct"] == 100.0
    else:
        assert data["status"] == "NO_DATA"
        assert data["gov_p95_ms"] is None
        assert data["enforcement_pct"] is None

def test_sla_metrics_only_report_recorded_transactions():
    monitor = SLAMonitor()
    empty_metrics = monitor.get_aggregated_metrics()
    assert empty_metrics["total_evaluations"] == 0
    assert empty_metrics["gov_p95_ms"] is None

    monitor.record_transaction(
        endpoint="/test",
        llm_latency_ms=100.0,
        gov_latency_ms=25.0,
        governance_enforced=True,
        audit_logged=False
    )
    metrics = monitor.get_aggregated_metrics()
    assert metrics["total_evaluations"] == 1
    assert metrics["gov_p95_ms"] == 25.0
    assert metrics["audit_completeness_pct"] == 0.0

def test_audit_logs_endpoint():
    response = client.get("/api/audit/logs")
    assert response.status_code == 200
    data = response.json()
    assert "logs" in data
    assert len(data["logs"]) > 0
    # Verify cryptographic hash present
    first_log = data["logs"][0]
    assert "sha256_hash" in first_log
    assert len(first_log["sha256_hash"]) == 64

def test_governance_evaluation_summary_endpoint():
    response = client.get("/api/governance/evaluation-summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_proposals_evaluated" in data
    assert "auto_executed_actions" in data
    assert "actions_requiring_approval" in data
    assert "blocked_actions" in data
    assert "human_approval_rate_pct" in data

def test_merchant_listings_endpoints():
    # 1. Create a listing
    new_listing = {
        "name": "Handmade Hinoki Wood Coaster",
        "merchant": "Kiso Artisans",
        "price": 1250.0,
        "stock": 15,
        "category": "Living"
    }
    create_res = client.post("/api/listings", json=new_listing)
    assert create_res.status_code == 200
    assert create_res.json()["status"] == "SUCCESS"
    assert create_res.json()["governance"]["decision"] == "AUTO_EXECUTE"
    listing_id = create_res.json()["listing"]["id"]

    # 2. Fetch listings and verify
    get_res = client.get("/api/listings")
    assert get_res.status_code == 200
    listings = get_res.json()
    assert any(l["id"] == listing_id for l in listings)

    audit_res = client.get("/api/audit/logs")
    assert audit_res.status_code == 200
    assert any(log["action_type"] == "CREATE_LISTING" for log in audit_res.json()["logs"])

def test_order_dispatch_endpoint():
    db.create_order(
        order_id="CRN-TEST-DISPATCH",
        user_id="test-buyer",
        product_id="test-product",
        product_name="Test product",
        specs="Test order",
        price=10.0,
        merchant="Test merchant",
        status="placed",
        destination="Test destination",
        sha256="test-hash"
    )
    dispatch_res = client.post("/api/orders/dispatch", json={"order_id": "CRN-88421"})
    assert dispatch_res.status_code == 404

    dispatch_res = client.post("/api/orders/dispatch", json={"order_id": "CRN-TEST-DISPATCH"})
    assert dispatch_res.status_code == 200
    data = dispatch_res.json()
    assert data["status"] == "DISPATCHED"
    assert data["order_id"] == "CRN-TEST-DISPATCH"


