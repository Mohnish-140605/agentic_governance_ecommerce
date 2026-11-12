"""
Integration tests for FastAPI endpoints, verifying agents, governance, SLA, and audit endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Cairn" in data["service"]

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
    assert "telemetry" in data
    assert data["telemetry"]["gov_latency_ms"] <= 500.0  # SLA target

def test_agent_chat_approval_hold():
    # Dell XPS 13 Plus -> Should be held for human approval
    response = client.post("/api/agents/chat", json={
        "query": "I want to order the Dell XPS 13 Plus for ₹1,20,000",
        "user_id": "usr_priya"
    })
    assert response.status_code == 200
    data = response.json()
    gov = data["workflow_state"]["governance_result"]
    assert gov["decision"] in ["HUMAN_APPROVAL", "BLOCK"]
    assert len(gov["audit_hash"]) == 64

def test_sla_metrics_endpoint():
    response = client.get("/api/sla/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "gov_p95_ms" in data
    assert "llm_p95_s" in data
    assert data["gov_p95_ms"] <= 500.0
    assert data["enforcement_pct"] == 100.0
    assert data["audit_completeness_pct"] == 100.0

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

