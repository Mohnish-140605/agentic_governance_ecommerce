"""
Buyer Agent (Aria Shopper).
Acts as a customer fiduciary: understands requirements, filters catalog by preferences,
and constructs typed ActionProposal objects for Governance evaluation.
Aligned with Section 4.A and Objective 1 of Project_Docs.docx.
"""

import re
from typing import Dict, Any, List, Optional
from ..models.schemas import ActionProposal, AgentRole, ActionType

# Master verified catalog embedded in the agent's knowledge base
CATALOG = [
    {
        "id": "prod-framework",
        "name": "Framework Laptop 13",
        "category": "Hardware",
        "price": 94990.0,
        "specs": "Intel Core Ultra Edition · 16GB RAM · Modular Swappable IO",
        "acoustics": "Ultra-quiet dual heatpipe fan (21 dB)",
        "partner": "Framework Computer Inc.",
        "verified": True,
        "delivery": "Thu, 24 Oct",
        "keywords": ["laptop", "framework", "study", "work", "hardware", "quiet", "modular"]
    },
    {
        "id": "prod-dell-xps",
        "name": "Dell XPS 13 Plus",
        "category": "Hardware",
        "price": 120000.0,
        "specs": "Intel Core i7 · 16GB LPDDR5 · 4K Touch OLED · CNC Machined Aluminum",
        "acoustics": "Zero-lattice capacitive keyboard & whisper thermal vents",
        "partner": "Dell Direct Official Flagship",
        "verified": True,
        "delivery": "Thu, 24 Oct",
        "keywords": ["dell", "xps", "13", "laptop", "1.2l", "120000", "quiet", "premium"]
    },
    {
        "id": "prod-zenbook-14",
        "name": "ASUS ZenBook 14 OLED",
        "category": "Hardware",
        "price": 58990.0,
        "specs": "AMD Ryzen 5 · 16GB LPDDR5 · 2.8K 90Hz OLED · 512GB NVMe SSD",
        "acoustics": "Whisper-quiet fan profile (< 22 dB under study load)",
        "partner": "Certified Zero-Noise Labs",
        "verified": True,
        "delivery": "Tomorrow, 4:00 PM",
        "keywords": ["laptop", "asus", "zenbook", "quiet", "study", "60000", "60k", "oled"]
    },
    {
        "id": "prod-ideapad-slim3",
        "name": "Lenovo IdeaPad Slim 3",
        "category": "Hardware",
        "price": 28990.0,
        "specs": "15.6 FHD Anti-glare · AMD Athlon Silver · 8GB DDR4 · 512GB NVMe SSD",
        "acoustics": "Thermal acoustic optimization for silent study environments",
        "partner": "Certified Zero-Noise Labs",
        "verified": True,
        "delivery": "Tomorrow, 4:00 PM",
        "keywords": ["laptop", "30000", "30k", "budget", "ideapad", "lenovo", "quiet"]
    },
    {
        "id": "prod-alienware-m16",
        "name": "Alienware m16 Performance Laptop",
        "category": "Hardware",
        "price": 75000.0,
        "specs": "Intel Core i7 · RTX 4060 GPU · 32GB RAM · 1TB NVMe · 240Hz QHD+",
        "acoustics": "Quad-fan Cryo-tech high-airflow cooling",
        "partner": "Alienware Direct Partner",
        "verified": True,
        "delivery": "Pre-execution block enforced",
        "keywords": ["gaming", "alienware", "laptop", "75000", "75k", "gpu"]
    },
    {
        "id": "prod-kinto",
        "name": "Kinto Slow Coffee Brewer",
        "category": "Home & Kitchen",
        "price": 3450.0,
        "specs": "Heat-resistant glass carafe (600ml) · Permanent stainless mesh filter",
        "acoustics": "Analog silent pour-over",
        "partner": "Kinto Japan Official Curations",
        "verified": True,
        "delivery": "Tomorrow Morning",
        "keywords": ["coffee", "kinto", "brewer", "pour-over", "pantry", "carafe"]
    }
]

class BuyerAgent:
    def __init__(self, agent_id: str = "aria_buyer_01", user_id: str = "usr_priya"):
        self.agent_id = agent_id
        self.user_id = user_id

    def parse_budget(self, query: str) -> Optional[float]:
        q = query.lower()
        match_k = re.search(r'(?:under|below|budget(?:\s*of|\s*is|\s*under)?)\s*₹?\s*(\d+(?:\.\d+)?)\s*k\b', q)
        if match_k:
            return float(match_k.group(1)) * 1000.0
        
        match_l = re.search(r'(?:under|below|budget(?:\s*of|\s*is|\s*under)?)\s*₹?\s*(\d+(?:\.\d+)?)\s*l(?:akh)?\b', q)
        if match_l:
            return float(match_l.group(1)) * 100000.0
        
        match_digits = re.search(r'(?:under|below|budget(?:\s*of|\s*is|\s*under)?)\s*₹?\s*(\d[\d,]*)', q)
        if match_digits:
            clean = match_digits.group(1).replace(',', '')
            val = float(clean)
            if val > 100:
                return val

        # Standalone patterns
        match_standalone_k = re.search(r'\b(\d+(?:\.\d+)?)\s*k\b', q)
        if match_standalone_k:
            return float(match_standalone_k.group(1)) * 1000.0

        return None

    def search_and_propose(self, user_query: str) -> ActionProposal:
        q = user_query.lower()
        parsed_budget = self.parse_budget(user_query)

        # Match items
        matched = []
        for item in CATALOG:
            if any(k in q for k in item["keywords"]) or any(k in item["name"].lower() for k in q.split()):
                matched.append(item)

        if not matched:
            matched = [CATALOG[3]]  # Fallback to Lenovo IdeaPad

        # Sort items by closest to parsed budget if available
        if parsed_budget:
            within_budget = [p for p in matched if p["price"] <= parsed_budget]
            if within_budget:
                within_budget.sort(key=lambda x: x["price"], reverse=True)
                selected = within_budget[0]
            else:
                matched.sort(key=lambda x: x["price"])
                selected = matched[0]
        else:
            selected = matched[0]

        # Construct structured proposal
        return ActionProposal(
            agent_id=self.agent_id,
            agent_role=AgentRole.BUYER_AGENT,
            action_type=ActionType.PROPOSE_ORDER,
            product_id=selected["id"],
            product_name=selected["name"],
            category=selected["category"],
            requested_price=selected["price"],
            user_budget=parsed_budget or selected["price"],
            merchant_id=selected["partner"],
            user_id=self.user_id,
            metadata={
                "acoustics": selected.get("acoustics", ""),
                "specs": selected.get("specs", ""),
                "matched_count": len(matched),
                "merchant_trust_score": 99.4
            }
        )

