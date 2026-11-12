"""
FastAPI Backend Application for Cairn Agentic Commerce Platform.
Exposes multi-agent execution, deterministic governance, human approval gates,
cryptographic audit logging, and SLA telemetry.
Aligned with Section 8, 9, 11 of Project_Docs.docx and LLM_SLA.docx.
"""

import time
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, Optional

from .models.schemas import (
    ActionProposal,
    GovernanceResult,
    GovernanceDecision,
    ApprovalRequest,
    AgentRole,
    ActionType
)
from .governance.engine import GovernanceEngine
from .governance.policies import PolicyRule
from .agents.workflow import MultiAgentCommerceWorkflow
from .sla.telemetry import sla_monitor
from .models.database import db

app = FastAPI(
    title="Cairn Agentic Commerce Governance API",
    version="1.0.0",
    description="Dual-Agent e-commerce ecosystem with shared deterministic governance, SLA enforcement and verifiable trust receipts."
)

# CORS Middleware to support frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global engines
current_rule = PolicyRule(monthly_cap=50000.0, approval_threshold=100000.0, tranquility_hold_minutes=15)
workflow = MultiAgentCommerceWorkflow(rule=current_rule)

@app.get("/")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Cairn Agentic Governance Engine",
        "version": "1.0.0",
        "governance_engine": "Deterministic Active",
        "timestamp": time.time()
    }

@app.post("/api/agents/chat")
def handle_agent_chat(payload: Dict[str, Any] = Body(...)):
    """
    Executes the dual-agent LangGraph workflow:
    User Query -> Buyer Agent Intent -> Merchant Agent Check -> Governance Engine -> Output + Receipt.
    """
    query = payload.get("query", "")
    user_id = payload.get("user_id", "usr_priya")
    
    if not query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    t_start = time.perf_counter()
    state = workflow.run(user_query=query, user_id=user_id)
    t_total_ms = round((time.perf_counter() - t_start) * 1000.0, 2)

    gov_res: Optional[GovernanceResult] = state.get("governance_result")
    proposal: Optional[ActionProposal] = state.get("proposal")

    gov_latency = gov_res.evaluation_latency_ms if gov_res else 0.0
    llm_latency = max(0.0, t_total_ms - gov_latency)

    # Record SLA Telemetry
    sla_monitor.record_transaction(
        endpoint="/api/agents/chat",
        llm_latency_ms=llm_latency,
        gov_latency_ms=gov_latency,
        structured_valid=(proposal is not None),
        governance_enforced=True,
        audit_logged=True
    )

    # Persist in Cryptographic Audit Ledger
    if gov_res and proposal:
        db.log_audit_record(
            proposal_id=proposal.proposal_id,
            agent_id=proposal.agent_id,
            agent_role=proposal.agent_role.value,
            action_type=proposal.action_type.value,
            requested_price=proposal.requested_price,
            decision=gov_res.decision.value,
            reason_code=gov_res.reason_code,
            risk_score=gov_res.risk.composite_score,
            has_conflict=gov_res.conflict.has_conflict,
            sha256_hash=gov_res.audit_hash,
            evidence=gov_res.evidence,
            explainability=gov_res.explainability
        )

        # Record Order if Placed or Held
        if gov_res.decision == GovernanceDecision.AUTO_EXECUTE:
            db.create_order(
                order_id=f"CRN-{proposal.proposal_id[-5:]}",
                user_id=user_id,
                product_id=proposal.product_id or "prod-001",
                product_name=proposal.product_name or "Artisan Product",
                specs=proposal.metadata.get("specs", ""),
                price=proposal.requested_price,
                merchant=proposal.merchant_id or "Verified Partner",
                status="placed",
                destination="Jor Bagh, New Delhi",
                sha256=gov_res.audit_hash
            )
        elif gov_res.decision == GovernanceDecision.HUMAN_APPROVAL:
            db.create_order(
                order_id=f"CRN-{proposal.proposal_id[-5:]}",
                user_id=user_id,
                product_id=proposal.product_id or "prod-001",
                product_name=proposal.product_name or "Artisan Product",
                specs=proposal.metadata.get("specs", ""),
                price=proposal.requested_price,
                merchant=proposal.merchant_id or "Verified Partner",
                status="needs_ok",
                destination="Jor Bagh, New Delhi",
                sha256=gov_res.audit_hash,
                flag_reason=gov_res.reason_text
            )

    return {
        "status": "success",
        "workflow_state": state,
        "telemetry": {
            "total_latency_ms": t_total_ms,
            "llm_latency_ms": llm_latency,
            "gov_latency_ms": gov_latency,
            "sla_gov_met": gov_latency <= 500.0,
            "sla_llm_met": llm_latency <= 5000.0
        }
    }

@app.post("/api/governance/evaluate", response_model=GovernanceResult)
def direct_governance_evaluate(proposal: ActionProposal):
    """
    Direct evaluation of an ActionProposal against deterministic rules.
    """
    t_start = time.perf_counter()
    result = workflow.governance_engine.evaluate(proposal)
    gov_lat = round((time.perf_counter() - t_start) * 1000.0, 2)

    sla_monitor.record_transaction(
        endpoint="/api/governance/evaluate",
        llm_latency_ms=0.0,
        gov_latency_ms=gov_lat,
        structured_valid=True,
        governance_enforced=True,
        audit_logged=True
    )

    db.log_audit_record(
        proposal_id=proposal.proposal_id,
        agent_id=proposal.agent_id,
        agent_role=proposal.agent_role.value,
        action_type=proposal.action_type.value,
        requested_price=proposal.requested_price,
        decision=result.decision.value,
        reason_code=result.reason_code,
        risk_score=result.risk.composite_score,
        has_conflict=result.conflict.has_conflict,
        sha256_hash=result.audit_hash,
        evidence=result.evidence,
        explainability=result.explainability
    )

    return result

@app.post("/api/governance/approve")
def handle_human_approval(request: ApprovalRequest):
    """
    Handles Human Approval gate confirmation for orders held in tranquility window.
    """
    if request.decision.upper() == "APPROVE":
        db.update_order_status(f"CRN-{request.proposal_id[-5:]}", "placed")
        return {
            "status": "AUTHORIZED",
            "message": f"Order #{request.proposal_id} authorized by human! Dispatched to verified seller.",
            "execution_permitted": True
        }
    else:
        db.update_order_status(f"CRN-{request.proposal_id[-5:]}", "failed")
        return {
            "status": "RELEASED",
            "message": f"Hold on order #{request.proposal_id} released gently. Zero funds debited.",
            "execution_permitted": False
        }

@app.get("/api/sla/metrics")
def get_sla_metrics():
    """
    Returns live aggregated SLA performance metrics for dashboard telemetry.
    """
    return sla_monitor.get_aggregated_metrics()

@app.get("/api/audit/logs")
def get_audit_logs(limit: int = 50):
    """
    Returns cryptographic immutable audit records.
    """
    return {
        "count": limit,
        "logs": db.get_recent_audit_logs(limit=limit)
    }

@app.get("/api/orders")
def get_orders(user_id: Optional[str] = None):
    """
    Returns persistent orders from SQLite database.
    """
    return db.get_orders(user_id=user_id)

@app.post("/api/rules/update")
def update_policy_rules(payload: Dict[str, Any] = Body(...)):
    """
    Updates active spending caps and thresholds.
    """
    monthly_cap = payload.get("monthlyCap", current_rule.monthly_cap)
    approval_threshold = payload.get("approvalThreshold", current_rule.approval_threshold)
    
    current_rule.monthly_cap = float(monthly_cap)
    current_rule.approval_threshold = float(approval_threshold)
    workflow.governance_engine.update_rule(current_rule)

    return {
        "status": "UPDATED",
        "monthlyCap": current_rule.monthly_cap,
        "approvalThreshold": current_rule.approval_threshold
    }

