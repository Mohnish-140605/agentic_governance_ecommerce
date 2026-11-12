"""
Buyer-Merchant Conflict Detection Engine.
Identifies conflicts between customer budget constraints and merchant pricing/surge objectives.
Aligned with Section 4.E and Objective 7 of Project_Docs.docx.
"""

from typing import Optional
from ..models.schemas import ActionProposal, ConflictEvaluation

class ConflictDetector:
    @staticmethod
    def detect_conflicts(proposal: ActionProposal, monthly_cap: float) -> ConflictEvaluation:
        price = proposal.requested_price
        user_budget = proposal.user_budget
        surge_variance = proposal.metadata.get("surge_variance_pct", 0.0)
        is_unauthorized_reseller = proposal.metadata.get("unauthorized_reseller", False)

        # Conflict 1: Unauthorized Drop-shipper / Catalog Conflict
        if is_unauthorized_reseller:
            return ConflictEvaluation(
                has_conflict=True,
                conflict_type="OWNERSHIP_CONFLICT",
                variance_amount=0.0,
                explanation="Product belongs to another verified seller. Unauthorized drop-shipping and predatory arbitrage are strictly prohibited."
            )

        # Conflict 2: Surge Pricing / Dynamic Markup Flag
        if surge_variance > 15.0:
            return ConflictEvaluation(
                has_conflict=True,
                conflict_type="SURGE_MARKUP_DETECTED",
                variance_amount=surge_variance,
                explanation=f"Merchant dynamic markup detected (+{surge_variance:.1f}% above 30-day baseline). Breaches shopper budget contracts."
            )

        # Conflict 3: User Budget Divergence
        if user_budget and price > user_budget:
            delta = price - user_budget
            return ConflictEvaluation(
                has_conflict=True,
                conflict_type="BUDGET_PRICE_DIVERGENCE",
                variance_amount=delta,
                explanation=f"Merchant asking price (₹{price:,.2f}) exceeds customer's explicit target budget (₹{user_budget:,.2f}) by ₹{delta:,.2f}."
            )

        # Conflict 4: Monthly Cap Divergence
        if price > monthly_cap:
            delta = price - monthly_cap
            return ConflictEvaluation(
                has_conflict=True,
                conflict_type="MONTHLY_CEILING_DIVERGENCE",
                variance_amount=delta,
                explanation=f"Merchant price (₹{price:,.2f}) breaches customer's monthly safety cap (₹{monthly_cap:,.2f}) by ₹{delta:,.2f}."
            )

        # No conflict detected
        return ConflictEvaluation(
            has_conflict=False,
            conflict_type=None,
            variance_amount=0.0,
            explanation="Zero conflict detected: Pricing aligned with direct OEM benchmarks and user constraints."
        )
