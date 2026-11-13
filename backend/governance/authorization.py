"""
Authorization Matrix enforcing Principle of Least Privilege.
Aligned with Section 4.B of Project_Docs.docx.
"""

from typing import Tuple
from ..models.schemas import AgentRole, ActionType

# Allowed action mappings per agent role
PERMISSIONS = {
    AgentRole.BUYER_AGENT: {
        ActionType.SEARCH_CATALOG: True,
        ActionType.COMPARE_PRODUCTS: True,
        ActionType.PROPOSE_ORDER: True,
        ActionType.UPDATE_INVENTORY: False,
        ActionType.UPDATE_PRICE: False,
        ActionType.CREATE_PROMOTION: False,
        ActionType.CREATE_LISTING: False,
        ActionType.SETTLE_PAYMENT: False,
        ActionType.INITIATE_REFUND: False,
    },
    AgentRole.MERCHANT_AGENT: {
        ActionType.SEARCH_CATALOG: True,
        ActionType.COMPARE_PRODUCTS: False,
        ActionType.PROPOSE_ORDER: False,
        ActionType.UPDATE_INVENTORY: True,
        ActionType.UPDATE_PRICE: True,
        ActionType.CREATE_PROMOTION: True,
        ActionType.CREATE_LISTING: True,
        ActionType.SETTLE_PAYMENT: False,
        ActionType.INITIATE_REFUND: False,
    },
    AgentRole.GOVERNANCE_SYSTEM: {
        ActionType.SEARCH_CATALOG: True,
        ActionType.COMPARE_PRODUCTS: True,
        ActionType.PROPOSE_ORDER: True,
        ActionType.UPDATE_INVENTORY: True,
        ActionType.UPDATE_PRICE: True,
        ActionType.CREATE_PROMOTION: True,
        ActionType.CREATE_LISTING: True,
        ActionType.SETTLE_PAYMENT: True,
        ActionType.INITIATE_REFUND: True,
    }
}

class AuthorizationManager:
    @staticmethod
    def verify_authorization(agent_role: AgentRole, action_type: ActionType) -> Tuple[bool, str]:
        role_perms = PERMISSIONS.get(agent_role)
        if not role_perms:
            return False, f"Unknown agent role '{agent_role}'. Denied by default."
        
        is_permitted = role_perms.get(action_type, False)
        if is_permitted:
            return True, f"Role '{agent_role.value}' is authorized to perform '{action_type.value}'."
        else:
            return False, f"Least Privilege Violation: '{agent_role.value}' is strictly forbidden from executing '{action_type.value}'."

