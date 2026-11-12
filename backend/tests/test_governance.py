"""
Unit and Integration Tests for Cairn Governance Engine.
Verifies the canonical benchmark test scenarios from Section 12 of Project_Docs.docx.
"""

import pytest
from backend.models.schemas import (
    ActionProposal,
    AgentRole,
    ActionType,
    GovernanceDecision,
    RiskLevel
)
from backend.governance.engine import GovernanceEngine
from backend.governance.policies import PolicyRule

@pytest.fixture
def gov_engine():
    # User rules: Monthly Cap = 50,000; Approval Threshold = 100,000
    rule = PolicyRule(monthly_cap=50000.0, approval_threshold=100000.0, tranquility_hold_minutes=15)
    return GovernanceEngine(rule=rule)

def test_scenario_1_auto_execute(gov_engine):
    """
    Scenario 1: Routine item within budget and below approval threshold.
    Lenovo IdeaPad Slim 3 priced at ₹28,990.
    Expected: AUTO_EXECUTE, low risk, execution permitted.
    """
    proposal = ActionProposal(
        agent_id="buyer_aria_01",
        agent_role=AgentRole.BUYER_AGENT,
        action_type=ActionType.PROPOSE_ORDER,
        product_id="prod-ideapad-slim3",
        product_name="Lenovo IdeaPad Slim 3",
        requested_price=28990.0,
        user_budget=30000.0,
        merchant_id="mkt_oem_labs"
    )

    result = gov_engine.evaluate(proposal)

    assert result.decision == GovernanceDecision.AUTO_EXECUTE
    assert result.execution_permitted is True
    assert result.approval_required is False
    assert result.risk.risk_level == RiskLevel.LOW
    assert result.evaluation_latency_ms < 500.0  # SLA latency guarantee
    assert len(result.audit_hash) == 64  # Valid SHA-256

def test_scenario_2_human_approval_hold(gov_engine):
    """
    Scenario 2: High-value purchase exceeding approval threshold.
    Dell XPS 13 Plus priced at ₹1,20,000.
    Threshold set to ₹1,00,000.
    Expected: HUMAN_APPROVAL, approval_required=True, approval_token present.
    """
    # Temporarily allow monthly cap to be 150k so it tests the approval threshold condition
    rule = PolicyRule(monthly_cap=150000.0, approval_threshold=100000.0, tranquility_hold_minutes=15)
    engine = GovernanceEngine(rule=rule)

    proposal = ActionProposal(
        agent_id="buyer_aria_01",
        agent_role=AgentRole.BUYER_AGENT,
        action_type=ActionType.PROPOSE_ORDER,
        product_id="prod-dell-xps",
        product_name="Dell XPS 13 Plus",
        requested_price=120000.0,
        merchant_id="dell_direct_flagship"
    )

    result = engine.evaluate(proposal)

    assert result.decision == GovernanceDecision.HUMAN_APPROVAL
    assert result.approval_required is True
    assert result.execution_permitted is False
    assert result.approval_token is not None
    assert result.approval_token.startswith("AUTH-TOK-")
    assert result.hold_seconds == 900  # 15 minutes = 900 seconds
    assert result.evaluation_latency_ms < 500.0

def test_scenario_3_policy_spending_cap_block(gov_engine):
    """
    Scenario 3: Policy breach where price exceeds self-imposed monthly ceiling.
    Alienware m16 at ₹75,000 with user monthly cap of ₹50,000.
    Expected: BLOCK, 0 funds debited, execution_permitted=False.
    """
    proposal = ActionProposal(
        agent_id="buyer_aria_01",
        agent_role=AgentRole.BUYER_AGENT,
        action_type=ActionType.PROPOSE_ORDER,
        product_id="prod-alienware-m16",
        product_name="Alienware m16 Performance Laptop",
        requested_price=75000.0,
        merchant_id="alienware_partner"
    )

    result = gov_engine.evaluate(proposal)

    assert result.decision == GovernanceDecision.BLOCK
    assert result.execution_permitted is False
    assert result.approval_required is False
    assert "POL-CAP-BREACH" in result.reason_code or "GOV-BLOCK" in result.reason_code
    assert result.conflict.has_conflict is True
    assert result.evaluation_latency_ms < 500.0

def test_least_privilege_unauthorized_action(gov_engine):
    """
    Least Privilege Authorization Check:
    Merchant Agent attempts to propose a customer order or Buyer attempts to alter merchant price.
    Expected: Strict BLOCK with GOV-BLOCK-UNAUTHORIZED.
    """
    proposal = ActionProposal(
        agent_id="merchant_rep_09",
        agent_role=AgentRole.MERCHANT_AGENT,
        action_type=ActionType.PROPOSE_ORDER,  # Forbidden for merchant
        product_id="prod-kinto",
        requested_price=3450.0
    )

    result = gov_engine.evaluate(proposal)

    assert result.decision == GovernanceDecision.BLOCK
    assert result.reason_code == "GOV-BLOCK-UNAUTHORIZED"
    assert "Least Privilege" in result.reason_text
    assert result.execution_permitted is False

def test_sla_latency_guarantee(gov_engine):
    """
    Evaluates 50 sequential rule decisions and verifies 95% latency is well below 500ms.
    """
    latencies = []
    proposal = ActionProposal(
        agent_id="buyer_aria_01",
        agent_role=AgentRole.BUYER_AGENT,
        action_type=ActionType.PROPOSE_ORDER,
        product_id="prod-kinto",
        requested_price=3450.0
    )

    for _ in range(50):
        res = gov_engine.evaluate(proposal)
        latencies.append(res.evaluation_latency_ms)

    latencies.sort()
    p95 = latencies[int(len(latencies) * 0.95)]
    assert p95 < 50.0  # Even stricter than 500ms! Typically under 5ms in Python.

