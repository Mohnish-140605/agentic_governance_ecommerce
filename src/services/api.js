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
