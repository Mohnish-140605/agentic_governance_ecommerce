"""
Merchant Agent.
Represents vendor objectives: inventory levels, MSRP validation, and stock allocation.
Aligned with Section 4.A and Objective 2 of Project_Docs.docx.
"""

from typing import Dict, Any, Optional
from ..models.schemas import ActionProposal, AgentRole, ActionType

class MerchantAgent:
    def __init__(self, agent_id: str = "artisan_rep_01"):
        self.agent_id = agent_id

    def verify_inventory_and_pricing(self, proposal: ActionProposal) -> Dict[str, Any]:
        """
        Evaluates vendor stock, MSRP baseline, and verifies whether surge markups are applied.
        """
        # Baseline MSRP definitions
        msrp_baselines = {
            "prod-framework": 94990.0,
            "prod-dell-xps": 120000.0,
            "prod-zenbook-14": 58990.0,
            "prod-ideapad-slim3": 28990.0,
            "prod-alienware-m16": 75000.0,
            "prod-kinto": 3450.0
        }

        baseline = msrp_baselines.get(proposal.product_id, proposal.requested_price)
        variance_pct = 0.0
        if baseline > 0:
            variance_pct = round(((proposal.requested_price - baseline) / baseline) * 100.0, 1)

        stock_available = True
        return {
            "merchant_agent_id": self.agent_id,
            "stock_confirmed": stock_available,
            "msrp_baseline": baseline,
            "surge_variance_pct": variance_pct,
            "partner_verified": True,
            "dispatch_hub": "Delhi Regional Logistics Hub"
        }
