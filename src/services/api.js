/**
 * Cairn API Client Service.
 * Connects frontend portals to the FastAPI Governance Backend.
 * Seamlessly falls back to client evaluation if the backend is offline.
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`, { method: 'GET', signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendAgentChat(query, userId = 'usr_priya') {
  try {
    const res = await fetch(`${BACKEND_URL}/api/agents/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, user_id: userId }),
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.debug('Backend offline or timed out; using client-side deterministic governance.', err);
  }
  return null;
}

export async function fetchSLAMetrics() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/sla/metrics`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Offline fallback handled in component
  }
  return null;
}

export async function fetchAuditLogs(limit = 30) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/audit/logs?limit=${limit}`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      const data = await res.json();
      return data.logs || [];
    }
  } catch {
    // Offline fallback
  }
  return [];
}

export async function sendHumanApproval(proposalId, token, decision = 'APPROVE') {
  try {
    const res = await fetch(`${BACKEND_URL}/api/governance/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        proposal_id: proposalId,
        approval_token: token || 'AUTH-TOK-LOCAL',
        user_id: 'usr_priya',
        decision
      }),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Offline fallback
  }
  return null;
}

export async function updatePolicyRules(rules) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/rules/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rules),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Offline fallback
  }
  return null;
}

export async function fetchGovernanceSummary() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/governance/evaluation-summary`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Offline fallback
  }
  return null;
}

export async function fetchOrders(userId = null) {
  try {
    const url = userId ? `${BACKEND_URL}/api/orders?user_id=${encodeURIComponent(userId)}` : `${BACKEND_URL}/api/orders`;
    const res = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Offline fallback
  }
  return null;
}

export async function fetchListings() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/listings`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Offline fallback
  }
  return null;
}

export async function createListing(listing) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listing),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Offline fallback
  }
  return null;
}

export async function dispatchOrder(orderId) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/orders/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId }),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Offline fallback
  }
  return null;
}


