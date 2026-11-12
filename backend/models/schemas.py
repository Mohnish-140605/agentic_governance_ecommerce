"""
Pydantic Schemas for Cairn Agentic Commerce Platform.
Defines Action Proposals, Governance Policies, Decisions, and SLA Telemetry.
Aligned with Project_Docs.docx and LLM_SLA.docx.
"""

from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
import time
import hashlib

class AgentRole(str, Enum):
    BUYER_AGENT = "BUYER_AGENT"
    MERCHANT_AGENT = "MERCHANT_AGENT"
    GOVERNANCE_SYSTEM = "GOVERNANCE_SYSTEM"

class ActionType(str, Enum):
    # Buyer Actions
    SEARCH_CATALOG = "SEARCH_CATALOG"
    COMPARE_PRODUCTS = "COMPARE_PRODUCTS"
    PROPOSE_ORDER = "PROPOSE_ORDER"
    
    # Merchant Actions
    UPDATE_INVENTORY = "UPDATE_INVENTORY"
    UPDATE_PRICE = "UPDATE_PRICE"
    CREATE_PROMOTION = "CREATE_PROMOTION"
    
    # High-Impact / Sensitive Actions
    SETTLE_PAYMENT = "SETTLE_PAYMENT"
    INITIATE_REFUND = "INITIATE_REFUND"

class GovernanceDecision(str, Enum):
    AUTO_EXECUTE = "AUTO_EXECUTE"
    HUMAN_APPROVAL = "HUMAN_APPROVAL"
    BLOCK = "BLOCK"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class ActionProposal(BaseModel):
    proposal_id: str = Field(default_factory=lambda: f"PROP-{int(time.time()*1000)}")
    agent_id: str
    agent_role: AgentRole
    action_type: ActionType
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    category: Optional[str] = "Hardware"
    requested_price: float = 0.0
    user_budget: Optional[float] = None
    merchant_id: Optional[str] = None
    merchant_name: Optional[str] = None
    user_id: Optional[str] = "usr_default"
    metadata: Dict[str, Any] = Field(default_factory=dict)
    timestamp: float = Field(default_factory=time.time)

class RiskEvaluation(BaseModel):
    composite_score: float = Field(..., ge=0.0, le=100.0)
    risk_level: RiskLevel
    breakdown: Dict[str, float] = Field(default_factory=dict)
    reasons: List[str] = Field(default_factory=list)

class ConflictEvaluation(BaseModel):
    has_conflict: bool = False
    conflict_type: Optional[str] = None
    variance_amount: float = 0.0
    explanation: Optional[str] = None

class GovernanceResult(BaseModel):
    evaluation_id: str = Field(default_factory=lambda: f"GOV-{int(time.time()*1000)}")
    proposal_id: str
    decision: GovernanceDecision
    reason_code: str
    reason_text: str
    risk: RiskEvaluation
    conflict: ConflictEvaluation
    evidence: Dict[str, Any]
    explainability: str
    hold_seconds: int = 0
    approval_required: bool = False
    approval_token: Optional[str] = None
    execution_permitted: bool = False
    audit_hash: str
    evaluation_latency_ms: float = 0.0
    timestamp: float = Field(default_factory=time.time)

class ApprovalRequest(BaseModel):
    proposal_id: str
    approval_token: str
    user_id: str
    decision: str  # "APPROVE" or "REJECT"
    notes: Optional[str] = None

class SLATelemetryRecord(BaseModel):
    record_id: str = Field(default_factory=lambda: f"SLA-{int(time.time()*1000)}")
    endpoint: str
    llm_latency_ms: float = 0.0
    gov_latency_ms: float = 0.0
    structured_output_valid: bool = True
    governance_enforced: bool = True
    audit_logged: bool = True
    llm_target_met: bool = True   # <= 5000ms
    gov_target_met: bool = True   # <= 500ms
    timestamp: float = Field(default_factory=time.time)
