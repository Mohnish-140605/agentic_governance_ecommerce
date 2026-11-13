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

async function _fetch(path, options = {}, timeoutMs = 3000, throwOnError = false) {
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
      if (throwOnError) {
        const errorBody = await res.json().catch(() => null);
        const detail = errorBody?.detail || errorBody?.message || errorBody?.governance?.reason_text;
        throw new Error(typeof detail === 'string' ? detail : `Request failed with HTTP ${res.status}.`);
      }
      console.warn(`[Cairn API] ${options.method || 'GET'} ${path} → HTTP ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    if (throwOnError) throw err;
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

// ── Live Online Products Search ──────────────────────────────────────────
export async function searchOnlineProducts(query, limit = 6) {
  if (!query || !query.trim()) return [];
  const data = await _fetch(`/api/products/search?q=${encodeURIComponent(query.trim())}&limit=${limit}`, {}, 4000);
  return data?.results || [];
}

// ── Agents ────────────────────────────────────────────────────────────────
export async function sendAgentChat(query, userId = 'usr_priya', { explicitOrder = false } = {}) {
  return _fetch('/api/agents/chat', {
    method: 'POST',
    body: JSON.stringify({ query, user_id: userId, explicit_order: explicitOrder }),
  }, 25000);
}

// ── SLA & Audit ───────────────────────────────────────────────────────────
export async function fetchSLAMetrics() {
  return _fetch('/api/sla/metrics', {}, 2000);
}

export async function fetchAuditLogs(limit = 30) {
  const data = await _fetch(`/api/audit/logs?limit=${limit}`, {}, 2000);
  return Array.isArray(data?.logs) ? data.logs : null;
}

export async function fetchGovernanceSummary() {
  return _fetch('/api/governance/evaluation-summary', {}, 2000);
}

// ── Human Approval Gate ───────────────────────────────────────────────────
export async function sendHumanApproval(proposalId, token, decision = 'APPROVE', userId = 'usr_priya') {
  return _fetch('/api/governance/approve', {
    method: 'POST',
    body: JSON.stringify({
      proposal_id: proposalId,
      approval_token: token || 'AUTH-TOK-LOCAL',
      user_id: userId,
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
  }, 3000, true);
}

// ── Listings ──────────────────────────────────────────────────────────────
export async function fetchListings() {
  return _fetch('/api/listings', {}, 2000);
}

export async function createListing(listing) {
  return _fetch('/api/listings', {
    method: 'POST',
    body: JSON.stringify(listing),
  }, 4000, true);
}

// ── Marketplace: Vendors, Offers, Allocation ──────────────────────────────
export async function fetchVendors() {
  const data = await _fetch('/api/vendors', {}, 3000, true);
  return Array.isArray(data?.vendors) ? data.vendors : [];
}

export async function fetchNearbyVendors({ lat, lng, locality, radiusKm = 25 } = {}) {
  const params = new URLSearchParams();
  if (lat != null) params.set('lat', lat);
  if (lng != null) params.set('lng', lng);
  if (locality) params.set('locality', locality);
  params.set('radius_km', radiusKm);
  return _fetch(`/api/vendors/nearby?${params}`, {}, 4000);
}

export async function fetchProductOffers(productId, { lat, lng, locality } = {}) {
  const params = new URLSearchParams();
  if (lat != null) params.set('lat', lat);
  if (lng != null) params.set('lng', lng);
  if (locality) params.set('locality', locality);
  const qs = params.toString();
  return _fetch(`/api/products/${encodeURIComponent(productId)}/offers${qs ? `?${qs}` : ''}`, {}, 4000);
}

export async function allocateOrder(payload) {
  return _fetch('/api/orders/allocate', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, 8000, true);
}

export async function fetchOrderVendor(orderId) {
  return _fetch(`/api/orders/${encodeURIComponent(orderId)}/vendor`, {}, 3000);
}

// ── Vendor (merchant) endpoints — require X-Cairn-Vendor-Id ───────────────
function vendorHeaders(vendorId) {
  return vendorId ? { 'X-Cairn-Vendor-Id': vendorId } : {};
}

export async function fetchVendorOrders(vendorId) {
  return _fetch('/api/vendor/orders', { headers: vendorHeaders(vendorId) }, 4000, true);
}

export async function vendorOrderAction(orderId, action, vendorId, body = {}) {
  return _fetch(`/api/vendor/orders/${encodeURIComponent(orderId)}/${action}`, {
    method: 'POST',
    headers: vendorHeaders(vendorId),
    body: JSON.stringify(body),
  }, 5000, true);
}

export async function fetchNotifications(recipientType, recipientId, unreadOnly = false) {
  const params = new URLSearchParams({ recipient_type: recipientType, recipient_id: recipientId });
  if (unreadOnly) params.set('unread_only', 'true');
  const data = await _fetch(`/api/notifications?${params}`, {}, 3000, true);
  return Array.isArray(data?.notifications) ? data.notifications : [];
}

export async function markNotificationRead(notificationId, recipientId) {
  return _fetch(`/api/notifications/${encodeURIComponent(notificationId)}/read`, {
    method: 'POST',
    body: JSON.stringify({ recipient_id: recipientId }),
  }, 3000);
}

export async function fetchSLAInstances({ orderId, vendorId, status } = {}) {
  const params = new URLSearchParams();
  if (orderId) params.set('order_id', orderId);
  if (vendorId) params.set('vendor_id', vendorId);
  if (status) params.set('status', status);
  const qs = params.toString();
  const data = await _fetch(`/api/sla/instances${qs ? `?${qs}` : ''}`, {}, 3000);
  return Array.isArray(data?.instances) ? data.instances : [];
}

export async function resolvePriceProposal(proposalId, userId, approve) {
  return _fetch(`/api/orders/price-proposals/${encodeURIComponent(proposalId)}/resolve`, {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, approve }),
  }, 5000, true);
}

// SSE helper — returns an EventSource; caller must close it.
export function subscribeEvents(scope, onEvent) {
  const url = `${BACKEND_URL}/api/events?scope=${encodeURIComponent(scope)}`;
  const es = new EventSource(url);
  es.onmessage = (e) => {
    try { onEvent(JSON.parse(e.data)); } catch { /* ignore */ }
  };
  return es;
}

// ── Payments (sandbox) & Trust Receipts ───────────────────────────────────
export async function createOrderPayment(orderId) {
  return _fetch(`/api/orders/${encodeURIComponent(orderId)}/payment/create`, {
    method: 'POST', body: JSON.stringify({}),
  }, 5000, true);
}

export async function confirmOrderPayment(orderId, paymentId) {
  return _fetch(`/api/orders/${encodeURIComponent(orderId)}/payment/confirm`, {
    method: 'POST', body: JSON.stringify({ payment_id: paymentId }),
  }, 5000, true);
}

export async function refundOrderPayment(orderId, paymentId) {
  return _fetch(`/api/orders/${encodeURIComponent(orderId)}/payment/refund`, {
    method: 'POST', body: JSON.stringify({ payment_id: paymentId }),
  }, 5000, true);
}

export async function fetchOrderPayment(orderId) {
  return _fetch(`/api/orders/${encodeURIComponent(orderId)}/payment`, {}, 3000);
}

export async function fetchOrderReceipt(orderId) {
  return _fetch(`/api/orders/${encodeURIComponent(orderId)}/receipt`, {}, 4000);
}

export async function verifyReceipt(receipt) {
  return _fetch('/api/receipts/verify', {
    method: 'POST', body: JSON.stringify({ receipt }),
  }, 4000);
}
