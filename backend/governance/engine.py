"""
Core Deterministic Governance Engine.
Acts as a mandatory checkpoint between AI agents and commerce execution tools.
Evaluates authorization, policies, caps, risk, and conflicts before any consequential action moves.
Aligned with Section 1, 2, 4, and Objective 3 of Project_Docs.docx.
"""

import time
import hashlib
import json
from typing import Optional
from ..models.schemas import (
    ActionProposal,
    GovernanceResult,
    GovernanceDecision,
    RiskLevel
)
from .authorization import AuthorizationManager
from .policies import PolicyEngine, PolicyRule
from .risk_scorer import RiskScorer
from .conflict_detector import ConflictDetector
from .explainability import ExplainabilityGenerator

class GovernanceEngine:
    def __init__(self, rule: Optional[PolicyRule] = None):
        self.rule = rule or PolicyRule()

    def update_rule(self, rule: PolicyRule):
        self.rule = rule

    def evaluate(self, proposal: ActionProposal) -> GovernanceResult:
        start_time = time.perf_counter()

        # Step 1: Authorization Check (Least Privilege)
        is_authorized, auth_msg = AuthorizationManager.verify_authorization(
            proposal.agent_role, proposal.action_type
        )

        # Step 2: Policy & Budget Evaluation
        policy_decision, policy_reason, evidence = PolicyEngine.evaluate_budget_and_policies(
            proposal, self.rule
        )

        # Step 3: Risk Assessment Calculation
        risk = RiskScorer.calculate_risk(
            proposal,
            monthly_cap=self.rule.monthly_cap,
            approval_threshold=self.rule.approval_threshold,
            is_authorized=is_authorized
        )

        # Step 4: Buyer-Merchant Conflict Detection
        conflict = ConflictDetector.detect_conflicts(
            proposal,
            monthly_cap=self.rule.monthly_cap
        )

        # Step 5: Master Decision Synthesis
        if not is_authorized:
            final_decision = GovernanceDecision.BLOCK
            reason_code = "GOV-BLOCK-UNAUTHORIZED"
            reason_text = auth_msg
            approval_required = False
            execution_permitted = False
            hold_seconds = 0
        elif policy_decision == "BLOCK" or conflict.conflict_type in ["OWNERSHIP_CONFLICT", "MONTHLY_CEILING_DIVERGENCE"]:
            final_decision = GovernanceDecision.BLOCK
            reason_code = "GOV-BLOCK-POLICY"
            reason_text = policy_reason if policy_decision == "BLOCK" else (conflict.explanation or policy_reason)
            approval_required = False
            execution_permitted = False
            hold_seconds = 0
        elif policy_decision == "HUMAN_APPROVAL" or risk.risk_level == RiskLevel.HIGH or conflict.conflict_type == "SURGE_MARKUP_DETECTED":
            final_decision = GovernanceDecision.HUMAN_APPROVAL
            reason_code = "GOV-HOLD-APPROVAL"
            reason_text = policy_reason
            approval_required = True
            execution_permitted = False
            hold_seconds = self.rule.tranquility_hold_minutes * 60
        else:
            final_decision = GovernanceDecision.AUTO_EXECUTE
            reason_code = "GOV-AUTO-CLEARED"
            reason_text = policy_reason
            approval_required = False
            execution_permitted = True
            hold_seconds = self.rule.tranquility_hold_minutes * 60

        # Step 6: Generate Human-Readable Explainability
        explanation = ExplainabilityGenerator.generate_explanation(
            proposal, final_decision, reason_text, risk, conflict, evidence
        )

        # Step 7: Cryptographic SHA-256 Audit Fingerprint
        audit_payload = {
            "proposal_id": proposal.proposal_id,
            "agent_id": proposal.agent_id,
            "role": proposal.agent_role.value,
            "action": proposal.action_type.value,
            "price": proposal.requested_price,
            "decision": final_decision.value,
            "risk_score": risk.composite_score,
            "timestamp": proposal.timestamp
        }
        audit_hash = hashlib.sha256(json.dumps(audit_payload, sort_keys=True).encode()).hexdigest()

        # Step 8: Approval Token generation (if human approval required)
        approval_token = None
        if approval_required:
            approval_token = f"AUTH-TOK-{audit_hash[:16].upper()}"

        latency_ms = round((time.perf_counter() - start_time) * 1000.0, 3)

        return GovernanceResult(
            proposal_id=proposal.proposal_id,
            decision=final_decision,
            reason_code=reason_code,
            reason_text=reason_text,
            risk=risk,
            conflict=conflict,
            evidence=evidence,
            explainability=explanation,
            hold_seconds=hold_seconds,
            approval_required=approval_required,
            approval_token=approval_token,
            execution_permitted=execution_permitted,
            audit_hash=audit_hash,
            evaluation_latency_ms=latency_ms
        )

