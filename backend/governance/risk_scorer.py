"""
Multi-factor Risk Assessment Scoring Engine.
Calculates a deterministic risk index R in [0, 100].
Aligned with Section 4.D and Objective 5 of Project_Docs.docx.
"""

from ..models.schemas import ActionProposal, RiskEvaluation, RiskLevel

class RiskScorer:
    @staticmethod
    def calculate_risk(proposal: ActionProposal, monthly_cap: float, approval_threshold: float, is_authorized: bool) -> RiskEvaluation:
        score = 0.0
        breakdown = {}
        reasons = []

        # 1. Authorization Penalty (50 pts if unauthorized)
        if not is_authorized:
            score += 50.0
            breakdown["authorization_penalty"] = 50.0
            reasons.append("Unauthorized action proposal detected.")
        else:
            breakdown["authorization_penalty"] = 0.0

        # 2. Transaction Value Ratio (0 to 30 pts)
        price = proposal.requested_price
        val_ratio = min(1.0, price / max(1.0, approval_threshold))
        value_score = round(val_ratio * 30.0, 2)
        score += value_score
        breakdown["transaction_value_risk"] = value_score
        if value_score > 20.0:
            reasons.append(f"High transaction value relative to approval threshold ({value_score}/30).")

        # 3. Monthly Cap Ratio (0 to 30 pts)
        cap_ratio = price / max(1.0, monthly_cap)
        if cap_ratio > 1.0:
            cap_score = 30.0
            reasons.append("Price strictly exceeds monthly spending allowance (+30).")
        else:
            cap_score = round(cap_ratio * 20.0, 2)
        score += cap_score
        breakdown["monthly_cap_risk"] = cap_score

        # 4. Merchant Trust Factor (0 to 10 pts)
        merchant_trust = proposal.metadata.get("merchant_trust_score", 98.0)
        if merchant_trust < 90.0:
            trust_penalty = round((100.0 - merchant_trust) * 0.25, 2)
            score += trust_penalty
            breakdown["merchant_trust_penalty"] = trust_penalty
            reasons.append(f"Sub-optimal merchant trust score: {merchant_trust}%.")
        else:
            breakdown["merchant_trust_penalty"] = 0.0

        final_score = min(100.0, round(score, 1))

        if final_score < 35.0:
            level = RiskLevel.LOW
        elif final_score < 70.0:
            level = RiskLevel.MEDIUM
        else:
            level = RiskLevel.HIGH

        if not reasons:
            reasons.append("Risk profile is nominal and within normal operating parameters.")

        return RiskEvaluation(
            composite_score=final_score,
            risk_level=level,
            breakdown=breakdown,
            reasons=reasons
        )
