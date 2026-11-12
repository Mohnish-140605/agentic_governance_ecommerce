"""
Multi-Agent Workflow Orchestrator.
Orchestrates Buyer Agent <-> Merchant Agent <-> Governance Engine.
Built using LangGraph stateful multi-agent execution.
Aligned with Section 7, 8, 9, and Objective 3 of Project_Docs.docx.
"""

from typing import TypedDict, Optional, Dict, Any
import time

try:
    from langgraph.graph import StateGraph, END
    LANGGRAPH_AVAILABLE = True
except ImportError:
    LANGGRAPH_AVAILABLE = False

from ..models.schemas import ActionProposal, GovernanceResult, GovernanceDecision
from .buyer_agent import BuyerAgent
from .merchant_agent import MerchantAgent
from .llm_client import llm_client
from ..governance.engine import GovernanceEngine
from ..governance.policies import PolicyRule

class AgentWorkflowState(TypedDict):
    user_query: str
    user_id: str
    proposal: Optional[ActionProposal]
    merchant_data: Optional[Dict[str, Any]]
    governance_result: Optional[GovernanceResult]
    llm_telemetry: Optional[Dict[str, Any]]
    final_status: str
    error: Optional[str]
    total_latency_ms: float

class MultiAgentCommerceWorkflow:
    def __init__(self, rule: Optional[PolicyRule] = None):
        self.buyer_agent = BuyerAgent()
        self.merchant_agent = MerchantAgent()
        self.governance_engine = GovernanceEngine(rule=rule or PolicyRule())
        
        if LANGGRAPH_AVAILABLE:
            self.graph = self._build_langgraph()
        else:
            self.graph = None

    def _build_langgraph(self):
        workflow = StateGraph(AgentWorkflowState)

        # Nodes
        workflow.add_node("buyer_intent_node", self._node_buyer_intent)
        workflow.add_node("merchant_check_node", self._node_merchant_check)
        workflow.add_node("governance_evaluation_node", self._node_governance_eval)
        workflow.add_node("execution_node", self._node_execution)

        # Edges
        workflow.set_entry_point("buyer_intent_node")
        workflow.add_edge("buyer_intent_node", "merchant_check_node")
        workflow.add_edge("merchant_check_node", "governance_evaluation_node")
        
        def route_after_gov(state: AgentWorkflowState):
            gov = state.get("governance_result")
            if not gov:
                return END
            if gov.decision == GovernanceDecision.AUTO_EXECUTE:
                return "execution_node"
            return END

        workflow.add_conditional_edges(
            "governance_evaluation_node",
            route_after_gov,
            {
                "execution_node": "execution_node",
                END: END
            }
        )
        workflow.add_edge("execution_node", END)

        return workflow.compile()

    def _node_buyer_intent(self, state: AgentWorkflowState) -> AgentWorkflowState:
        query = state["user_query"]
        llm_thought = llm_client.generate_agent_thought(
            prompt=f"Parse shopping intent and acoustic constraints for: {query}",
            system_prompt="You are Aria, a mindful Buyer Agent fiduciary representing the customer."
        )
        proposal = self.buyer_agent.search_and_propose(query)
        proposal.metadata["llm_provider"] = llm_thought["provider"]
        proposal.metadata["llm_thought"] = llm_thought["text"]
        state["proposal"] = proposal
        state["llm_telemetry"] = llm_thought
        return state

    def _node_merchant_check(self, state: AgentWorkflowState) -> AgentWorkflowState:
        proposal = state.get("proposal")
        if proposal:
            m_data = self.merchant_agent.verify_inventory_and_pricing(proposal)
            state["merchant_data"] = m_data
            proposal.metadata.update(m_data)
        return state

    def _node_governance_eval(self, state: AgentWorkflowState) -> AgentWorkflowState:
        proposal = state.get("proposal")
        if proposal:
            gov_res = self.governance_engine.evaluate(proposal)
            state["governance_result"] = gov_res
            state["final_status"] = gov_res.decision.value
        return state

    def _node_execution(self, state: AgentWorkflowState) -> AgentWorkflowState:
        gov_res = state.get("governance_result")
        if gov_res and gov_res.execution_permitted:
            state["final_status"] = "EXECUTED_WITH_TRANQUILITY_HOLD"
        return state

    def run(self, user_query: str, user_id: str = "usr_priya") -> AgentWorkflowState:
        start_time = time.perf_counter()
        initial_state: AgentWorkflowState = {
            "user_query": user_query,
            "user_id": user_id,
            "proposal": None,
            "merchant_data": None,
            "governance_result": None,
            "llm_telemetry": None,
            "final_status": "PENDING",
            "error": None,
            "total_latency_ms": 0.0
        }

        if self.graph:
            final_state = self.graph.invoke(initial_state)
        else:
            # Standalone pipeline fallback
            state = self._node_buyer_intent(initial_state)
            state = self._node_merchant_check(state)
            state = self._node_governance_eval(state)
            if state.get("governance_result") and state["governance_result"].decision == GovernanceDecision.AUTO_EXECUTE:
                state = self._node_execution(state)
            final_state = state

        final_state["total_latency_ms"] = round((time.perf_counter() - start_time) * 1000.0, 2)
        return final_state

