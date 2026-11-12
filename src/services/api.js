/**
 * Cairn API Client Service — Production-ready.
 * - Reads backend URL from VITE_BACKEND_URL env var (falls back to same-origin via Vite proxy in dev)
 * - Attaches X-Correlation-ID header for end-to-end request tracing
 * - Bounded timeouts on every request
 * - Typed, graceful fallback when backend is offline
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
// In dev, Vite proxy forwards /api → localhost:8000, so BACKEND_URL='' uses relative URLs.
// In production, set VITE_BACKEND_URL=https://api.your-domain.com

function correlationId() {
  return `crn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function _fetch(path, options = {}, timeoutMs = 3000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...options,
      signal: ctrl.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': correlationId(),
        ...(options.headers || {}),
      },
    });
    clearTimeout(timer);
    if (!res.ok) {
      console.warn(`[Cairn API] ${options.method || 'GET'} ${path} → HTTP ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name !== 'AbortError') {
      console.debug(`[Cairn API] Offline fallback for ${path}:`, err.message);
    }
    return null;
  }
}

// ── Health ────────────────────────────────────────────────────────────────
export async function checkBackendHealth() {
  const data = await _fetch('/api/health', {}, 1500);
  return data?.status === 'healthy' || data?.status === 'degraded';
}

// ── Agents ────────────────────────────────────────────────────────────────
export async function sendAgentChat(query, userId = 'usr_priya') {
  return _fetch('/api/agents/chat', {
    method: 'POST',
    body: JSON.stringify({ query, user_id: userId }),
  }, 8000);
}

// ── SLA & Audit ───────────────────────────────────────────────────────────
export async function fetchSLAMetrics() {
  return _fetch('/api/sla/metrics', {}, 2000);
}

export async function fetchAuditLogs(limit = 30) {
  const data = await _fetch(`/api/audit/logs?limit=${limit}`, {}, 2000);
  return data?.logs || [];
}

export async function fetchGovernanceSummary() {
  return _fetch('/api/governance/evaluation-summary', {}, 2000);
}

// ── Human Approval Gate ───────────────────────────────────────────────────
export async function sendHumanApproval(proposalId, token, decision = 'APPROVE') {
  return _fetch('/api/governance/approve', {
    method: 'POST',
    body: JSON.stringify({
      proposal_id: proposalId,
      approval_token: token || 'AUTH-TOK-LOCAL',
      user_id: 'usr_priya',
      decision,
    }),
  }, 4000);
}

// ── Policy Rules ──────────────────────────────────────────────────────────
export async function updatePolicyRules(rules) {
  return _fetch('/api/rules/update', {
    method: 'POST',
    body: JSON.stringify(rules),
  }, 3000);
}

// ── Orders ────────────────────────────────────────────────────────────────
export async function fetchOrders(userId = null) {
  const path = userId ? `/api/orders?user_id=${encodeURIComponent(userId)}` : '/api/orders';
  return _fetch(path, {}, 2500);
}

export async function dispatchOrder(orderId) {
  return _fetch('/api/orders/dispatch', {
    method: 'POST',
    body: JSON.stringify({ order_id: orderId }),
  }, 3000);
}

// ── Listings ──────────────────────────────────────────────────────────────
export async function fetchListings() {
  return _fetch('/api/listings', {}, 2000);
}

export async function createListing(listing) {
  return _fetch('/api/listings', {
    method: 'POST',
    body: JSON.stringify(listing),
  }, 4000);
}
