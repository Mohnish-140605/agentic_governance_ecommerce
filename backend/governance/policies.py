"""
Policy Engine evaluating deterministic rules, caps, and spending constraints.
Aligned with Section 4.C and Section 12 of Project_Docs.docx.
"""

from typing import Dict, Any, Tuple
from ..models.schemas import ActionProposal

class PolicyRule:
    def __init__(
        self,
        monthly_cap: float = 50000.0,
        approval_threshold: float = 100000.0,
        current_cycle_usage: float = 12400.0,
        tranquility_hold_minutes: int = 15,
        max_surge_variance_pct: float = 15.0
    ):
        self.monthly_cap = monthly_cap
        self.approval_threshold = approval_threshold
        self.current_cycle_usage = current_cycle_usage
        self.tranquility_hold_minutes = tranquility_hold_minutes
        self.max_surge_variance_pct = max_surge_variance_pct

class PolicyEngine:
    @staticmethod
    def evaluate_budget_and_policies(proposal: ActionProposal, rule: PolicyRule) -> Tuple[str, str, Dict[str, Any]]:
        price = proposal.requested_price
        monthly_cap = rule.monthly_cap
        approval_threshold = rule.approval_threshold
        user_budget = proposal.user_budget or price

        evidence = {
            "requested_price": price,
            "monthly_cap": monthly_cap,
            "approval_threshold": approval_threshold,
            "user_budget": user_budget,
            "current_cycle_usage": rule.current_cycle_usage,
            "projected_cycle_usage": rule.current_cycle_usage + price
        }

        # Check 1: User Explicit Budget Exceeded
        if proposal.user_budget and price > proposal.user_budget:
            delta = price - proposal.user_budget
            return "BLOCK", f"POL-BUDGET-EXCEEDED: Item price ₹{price:,.2f} exceeds user requested budget cap of ₹{proposal.user_budget:,.2f} by ₹{delta:,.2f}.", evidence

        # Check 2: Absolute Monthly Spending Cap Breach
        if price > monthly_cap:
            delta = price - monthly_cap
            return "BLOCK", f"POL-CAP-BREACH: Transaction amount ₹{price:,.2f} breaches self-imposed monthly ceiling of ₹{monthly_cap:,.2f} by ₹{delta:,.2f}. Pre-execution block enforced.", evidence

        # Check 3: Single-Purchase Autonomous Approval Threshold
        if price > approval_threshold:
            return "HUMAN_APPROVAL", f"POL-APPROVAL-REQUIRED: Transaction amount ₹{price:,.2f} exceeds automatic execution threshold of ₹{approval_threshold:,.2f}. Placed on {rule.tranquility_hold_minutes}-minute tranquility hold awaiting human confirmation.", evidence

        # Check 4: Approved within autonomous limits
        return "AUTO_EXECUTE", f"POL-AUTO-CLEARED: Transaction amount ₹{price:,.2f} is within monthly ceiling (₹{monthly_cap:,.2f}) and below autonomous execution threshold (₹{approval_threshold:,.2f}).", evidence

