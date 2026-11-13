import React, { useEffect, useState, useCallback } from 'react';
import { Store, Package, MapPin, Clock, CheckCircle, XCircle, Truck, Tag, RefreshCw } from 'lucide-react';
import { fetchVendors, fetchVendorOrders, subscribeEvents, vendorOrderAction } from '../../services/api';

const inr = (paise) => `₹${((paise ?? 0) / 100).toLocaleString('en-IN')}`;

const STATUS_STYLE = {
  allocated: { label: 'New request', bg: '#FEF3C7', fg: '#B45309' },
  acknowledged: { label: 'Acknowledged', bg: '#DBEAFE', fg: '#1D4ED8' },
  accepted: { label: 'Accepted', bg: '#DCFCE7', fg: '#166534' },
  preparing: { label: 'Preparing', bg: '#E0E7FF', fg: '#4338CA' },
  dispatched: { label: 'Dispatched', bg: '#DCFCE7', fg: '#166534' },
  delivered: { label: 'Delivered', bg: '#DCFCE7', fg: '#166534' },
  rejected: { label: 'Rejected', bg: '#FEE2E2', fg: '#B91C1C' },
  needs_ok: { label: 'Needs approval', bg: '#FEF3C7', fg: '#B45309' },
  placed: { label: 'Placed', bg: '#DCFCE7', fg: '#166534' },
};

/**
 * VendorOrderInbox — merchant-side order inbox (Priority 6/14).
 * Vendor picks their store (demo), sees allocated orders, and can
 * acknowledge / accept / reject / propose price / dispatch.
 */
export default function VendorOrderInbox({ onShowToast, currentUser, onVendorChange }) {
  const [vendors, setVendors] = useState([]);
  const [vendorId, setVendorId] = useState(currentUser?.vendor_id || 'VEN-BLR-001');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceDraft, setPriceDraft] = useState({});
  const [carrierDraft, setCarrierDraft] = useState({});
  const [trackingDraft, setTrackingDraft] = useState({});

  useEffect(() => {
    let active = true;
    fetchVendors().then((v) => {
      if (!active) return;
      setVendors(v);
    }).catch((error) => {
      if (active) setLoadError(`Could not load merchant stores: ${error.message}`);
    });
    return () => { active = false; };
  }, []);

  const load = useCallback(async () => {
    if (!vendorId) return;
    setLoading(true);
    setLoadError('');
    try {
      const res = await fetchVendorOrders(vendorId);
      setOrders(res?.orders || []);
    } catch (error) {
      setLoadError(`Could not refresh orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!vendorId) return undefined;
    const es = subscribeEvents(`vendor:${vendorId}`, (event) => {
      if (['VENDOR_ALLOCATED', 'VENDOR_ACCEPTED', 'VENDOR_REJECTED',
        'VENDOR_REASSIGNED', 'ORDER_PREPARING', 'ORDER_DISPATCHED', 'PRICE_APPROVED',
        'PRICE_REJECTED', 'BUYER_APPROVED', 'BUYER_REJECTED',
        'SLA_BREACHED'].includes(event.type)) {
        load();
      }
    });
    const refreshTimer = window.setInterval(load, 30000);
    return () => {
      es.close();
      window.clearInterval(refreshTimer);
    };
  }, [vendorId, load]);

  useEffect(() => {
    if (vendorId) onVendorChange?.(vendorId);
  }, [vendorId, onVendorChange]);

  const act = async (orderId, action, body = {}) => {
    setBusy(`${orderId}:${action}`);
    try {
      const res = await vendorOrderAction(orderId, action, vendorId, body);
      if (res?.status === 'REASSIGNED') {
        onShowToast?.('Vendor declined; the order was reassigned and the buyer was notified.');
      } else {
        onShowToast?.(`${action} → ${res?.status || 'completed'}`);
      }
      await load();
    } catch (e) {
      onShowToast?.(`Action failed: ${e.message}`);
    } finally {
      setBusy(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'needs_action') return ['allocated', 'acknowledged'].includes(order.status);
    if (statusFilter === 'in_progress') return ['accepted', 'preparing'].includes(order.status);
    if (statusFilter === 'shipped') return ['dispatched', 'delivered'].includes(order.status);
    return true;
  });
  const pending = filteredOrders.filter((o) => ['allocated', 'acknowledged', 'accepted', 'preparing'].includes(o.status));
  const history = filteredOrders.filter((o) => !pending.includes(o));
  const ordersNeedingAction = orders.filter((o) => ['allocated', 'acknowledged'].includes(o.status)).length;

  return (
    <section style={{
      backgroundColor: '#FFFFFF', border: '1px solid var(--border-cream)',
      borderRadius: '16px', padding: '24px', marginBottom: '20px'
    }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--forest-green)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
            <Store size={16} /> Vendor order inbox
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>
            Assigned orders
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
            Order requests, fulfillment actions, and updates shared with buyers
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <label htmlFor="merchant-order-store" style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>Store</label>
          <select
            id="merchant-order-store"
            aria-label="Select merchant store"
            value={vendorId}
            disabled={Boolean(currentUser?.vendor_id)}
            onChange={(e) => setVendorId(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-cream)',
              fontSize: '13px', fontWeight: 600, color: 'var(--ink)', background: '#fff'
            }}
          >
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.store_name} ({v.id})</option>
            ))}
          </select>
          <button type="button" onClick={load} disabled={loading} aria-label="Refresh merchant orders"
            style={{ ...btnStyle('var(--forest-green)', '#FFFFFF'), padding: '8px 11px' }}>
            <RefreshCw size={13} style={{ marginRight: '5px' }} />
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </header>

      <div role="group" aria-label="Filter merchant orders" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {[
          ['all', `All (${orders.length})`],
          ['needs_action', `Needs action (${ordersNeedingAction})`],
          ['in_progress', 'Accepted / preparing'],
          ['shipped', 'Shipped / delivered']
        ].map(([filter, label]) => (
          <button key={filter} type="button" aria-pressed={statusFilter === filter}
            onClick={() => setStatusFilter(filter)}
            style={{
              ...btnStyle(statusFilter === filter ? '#FFFFFF' : 'var(--ink-secondary)',
                statusFilter === filter ? 'var(--forest-green)' : '#FFFFFF'),
              borderColor: statusFilter === filter ? 'var(--forest-green)' : 'var(--border-cream)'
            }}>
            {label}
          </button>
        ))}
      </div>

      {loadError && <div role="alert" style={{ color: '#B91C1C', fontSize: '13px', padding: '10px 12px', marginBottom: '12px', background: '#FEF2F2', borderRadius: '8px' }}>{loadError}</div>}
      {loading && <div style={{ fontSize: '13px', color: 'var(--ink-muted)', padding: '12px 0' }}>Loading orders…</div>}
      {!loading && !loadError && orders.length === 0 && (
        <div style={{ padding: '20px 12px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '13px', background: 'var(--bg-cream-subtle)', borderRadius: '10px' }}>
          No orders assigned to this store yet. New buyer orders will appear here automatically.
        </div>
      )}
      {!loading && !loadError && orders.length > 0 && filteredOrders.length === 0 && (
        <div style={{ padding: '20px 12px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '13px', background: 'var(--bg-cream-subtle)', borderRadius: '10px' }}>
          No orders match this status filter.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[...pending, ...history].map((o) => {
          const st = STATUS_STYLE[o.status] || STATUS_STYLE.allocated;
          const riskySla = (o.sla_instances || []).find((s) => s.status === 'AT_RISK' || s.status === 'BREACHED');
          const slaRisk = Boolean(riskySla);
          const isPending = pending.includes(o);
          return (
            <div key={o.id} style={{
              padding: '14px', borderRadius: '12px',
              border: slaRisk ? '1.5px solid #F59E0B' : '1px solid var(--border-cream-subtle)',
              background: 'var(--bg-cream-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>{o.item || o.product_name}</span>
                    <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px', background: st.bg, color: st.fg }}>
                      {st.label}
                    </span>
                    {slaRisk && (
                      <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px', background: '#FEF3C7', color: '#B45309', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={10} /> {riskySla.sla_type.replace(/_/g, ' ')} {riskySla.status.toLowerCase()}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '5px', fontSize: '11.5px', color: 'var(--ink-secondary)', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'ui-monospace, monospace' }}>{o.id}</span>
                    {o.price_paise != null && <span>{inr(o.price_paise)}</span>}
                    {o.quantity != null && <span>Qty {o.quantity}</span>}
                    {o.distance_km != null && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><MapPin size={11} /> {o.distance_km} km</span>}
                    <span>{o.destination || o.vendor_locality || ''}</span>
                  </div>
                </div>
              </div>

              {isPending && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {o.status === 'allocated' && (
                    <>
                      <button onClick={() => act(o.id, 'acknowledge')} disabled={busy}
                        style={btnStyle('#1D4ED8', '#DBEAFE')}>Acknowledge</button>
                      <button onClick={() => act(o.id, 'accept')} disabled={busy}
                        style={btnStyle('#166534', '#DCFCE7')}>Accept order</button>
                    </>
                  )}
                  {o.status === 'acknowledged' && (
                    <button onClick={() => act(o.id, 'accept')} disabled={busy}
                      style={btnStyle('#166534', '#DCFCE7')}>Accept order</button>
                  )}
                  {['allocated', 'acknowledged'].includes(o.status) && (
                    <>
                      <button onClick={() => act(o.id, 'reject', { reason: 'vendor_unavailable' })} disabled={busy}
                        style={btnStyle('#B91C1C', '#FEE2E2')}>
                        <XCircle size={12} style={{ marginRight: '4px', verticalAlign: '-2px' }} />Reject
                      </button>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <input
                          type="number"
                          placeholder="New ₹ price"
                          aria-label={`Proposed price in rupees for ${o.id}`}
                          value={priceDraft[o.id] || ''}
                          onChange={(e) => setPriceDraft((p) => ({ ...p, [o.id]: e.target.value }))}
                          style={{ width: '110px', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-cream)', fontSize: '12px' }}
                        />
                        <button
                          onClick={() => {
                            const rupees = Number(priceDraft[o.id]);
                            if (rupees > 0) act(o.id, 'price-proposal', { price_paise: Math.round(rupees * 100), reason: 'vendor price update' });
                          }}
                          disabled={busy}
                          style={btnStyle('#4338CA', '#E0E7FF')}
                        >
                          <Tag size={12} style={{ marginRight: '4px', verticalAlign: '-2px' }} />Propose price
                        </button>
                      </span>
                    </>
                  )}
                  {o.status === 'accepted' && (
                    <button onClick={() => act(o.id, 'prepare')} disabled={Boolean(busy)}
                      style={btnStyle('#4338CA', '#E0E7FF')}>
                      <Package size={12} style={{ marginRight: '4px', verticalAlign: '-2px' }} />Start preparing
                    </button>
                  )}
                  {o.status === 'preparing' && (
                    <span style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        value={carrierDraft[o.id] || ''}
                        placeholder="Carrier name"
                        aria-label={`Shipping carrier for ${o.id}`}
                        onChange={(e) => setCarrierDraft((prev) => ({ ...prev, [o.id]: e.target.value }))}
                        style={{ width: '150px', padding: '7px 10px', borderRadius: '8px', border: '1px solid var(--border-cream)', fontSize: '12px' }}
                      />
                      <input
                        type="text"
                        value={trackingDraft[o.id] || ''}
                        placeholder="Carrier tracking reference"
                        aria-label={`Carrier tracking reference for ${o.id}`}
                        onChange={(e) => setTrackingDraft((prev) => ({ ...prev, [o.id]: e.target.value }))}
                        style={{ width: '210px', padding: '7px 10px', borderRadius: '8px', border: '1px solid var(--border-cream)', fontSize: '12px' }}
                      />
                      <button
                        onClick={() => act(o.id, 'dispatch', {
                          carrier_name: carrierDraft[o.id],
                          tracking_ref: trackingDraft[o.id].trim()
                        })}
                        disabled={Boolean(busy) || !carrierDraft[o.id] || !trackingDraft[o.id]?.trim()}
                        style={btnStyle('#166534', '#DCFCE7')}>
                        <Truck size={12} style={{ marginRight: '4px', verticalAlign: '-2px' }} />Confirm shipment
                      </button>
                    </span>
                  )}
                </div>
              )}

              {!isPending && o.status === 'dispatched' && (
                <div style={{ marginTop: '8px', fontSize: '11.5px', color: 'var(--ink-muted)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle size={13} color="#166534" /> Awaiting delivery confirmation
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function btnStyle(color, bg) {
  return {
    display: 'inline-flex', alignItems: 'center', fontSize: '12px', fontWeight: 700,
    padding: '7px 14px', borderRadius: '9999px', cursor: 'pointer',
    border: `1px solid ${color}`, color, background: bg
  };
}
