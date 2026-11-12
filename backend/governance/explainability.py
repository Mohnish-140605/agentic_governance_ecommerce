"""
Explainability Module.
Provides structured human-readable and auditable explanations for all governance decisions.
Aligned with Section 4.G and Objective 8 of Project_Docs.docx.
"""

from typing import Dict, Any
from ..models.schemas import ActionProposal, GovernanceDecision, RiskEvaluation, ConflictEvaluation

class ExplainabilityGenerator:
    @staticmethod
    def generate_explanation(
        proposal: ActionProposal,
        decision: GovernanceDecision,
        reason_text: str,
        risk: RiskEvaluation,
        conflict: ConflictEvaluation,
        evidence: Dict[str, Any]
    ) -> str:
        lines = [
            f"=== GOVERNANCE DECISION EXPLANATION: {decision.value} ===",
            f"Proposed Action: {proposal.action_type.value} by {proposal.agent_role.value} (Agent ID: {proposal.agent_id})",
            f"Target Item: {proposal.product_name or 'N/A'} (SKU: {proposal.product_id or 'N/A'})",
            f"Requested Amount: ₹{proposal.requested_price:,.2f}",
            f"Primary Policy Finding: {reason_text}",
            f"Composite Risk Score: {risk.composite_score}/100 ({risk.risk_level.value})"
        ]

        if risk.reasons:
            lines.append("Identified Risk Factors: " + "; ".join(risk.reasons))

        if conflict.has_conflict:
            lines.append(f"Conflict Status: [{conflict.conflict_type}] {conflict.explanation}")
        else:
            lines.append("Conflict Status: Zero conflict detected between Buyer requirements and Merchant pricing.")

        if decision == GovernanceDecision.AUTO_EXECUTE:
            lines.append("Resolution: Pre-execution conditions satisfied. Authorized to execute with 15-minute peace-of-mind tranquility hold.")
        elif decision == GovernanceDecision.HUMAN_APPROVAL:
            lines.append(f"Resolution: Action exceeds autonomous threshold (₹{evidence.get('approval_threshold', 0):,.2f}). Held for 15-minute explicit human confirmation.")
        elif decision == GovernanceDecision.BLOCK:
            lines.append("Resolution: Action violates self-imposed budget ceiling or authorization rules. Pre-execution block enforced. Zero funds debited.")

        return "\n".join(lines)
