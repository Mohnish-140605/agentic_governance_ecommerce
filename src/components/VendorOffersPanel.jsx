import React, { useEffect, useState } from 'react';
import { MapPin, Package, ShieldCheck, Truck, ChevronDown, ChevronUp, Store } from 'lucide-react';
import { fetchProductOffers, allocateOrder } from '../services/api';

const inr = (paise) => `₹${(paise / 100).toLocaleString('en-IN')}`;

/**
 * VendorOffersPanel — shows ranked nearby vendor offers for a catalogue
 * product (Priority 4/5 buyer side). Buyer can pick a vendor or let Cairn
 * auto-allocate the best eligible one.
 */
export default function VendorOffersPanel({ productId, productName, buyerLocality, currentUser, onAllocated, onShowToast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allocating, setAllocating] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchProductOffers(productId, { locality: buyerLocality });
      setData(res);
    } catch (e) {
      setError('Could not load vendor offers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded && !data && !loading) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const handleAllocate = async (preferredVendorId = null) => {
    setAllocating(true);
    try {
      const res = await allocateOrder({
        product_id: productId,
        product_name: productName,
        user_id: currentUser?.id || 'usr_priya',
        locality: buyerLocality,
        quantity: 1,
        preferred_vendor_id: preferredVendorId || undefined,
      });
      if (res?.status === 'ALLOCATED') {
        onShowToast?.(`Order assigned to ${res.vendor.store_name} (${res.vendor.vendor_id})`);
        onAllocated?.(res);
      } else if (res?.status === 'NO_ELIGIBLE_VENDOR') {
        onShowToast?.('No eligible nearby vendor available for this item.');
      } else {
        onShowToast?.('Allocation failed. Please try again.');
      }
    } catch (e) {
      onShowToast?.('Could not allocate order. Backend may be offline.');
    } finally {
      setAllocating(false);
    }
  };

  const eligible = data?.eligible || [];
  const excluded = data?.excluded || [];

  return (
    <div style={{ marginTop: '10px', borderTop: '1px solid var(--border-cream-subtle)', paddingTop: '10px' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '12px', fontWeight: 700, color: 'var(--forest-green)', padding: 0
        }}
      >
        <Store size={13} />
        {expanded ? 'Hide nearby vendors' : 'Compare nearby vendors'}
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {expanded && (
        <div style={{ marginTop: '10px' }}>
          {loading && <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>Finding vendors near {buyerLocality || 'you'}…</div>}
          {error && <div style={{ fontSize: '12px', color: '#B91C1C' }}>{error}</div>}

          {!loading && !error && eligible.length === 0 && (
            <div style={{ fontSize: '12px', color: 'var(--ink-muted)', padding: '8px 0' }}>
              No eligible vendors serve this area right now.
              {excluded.length > 0 && ` (${excluded.length} vendor${excluded.length > 1 ? 's' : ''} excluded: ${[...new Set(excluded.map(e => e.reason))].join(', ')})`}
            </div>
          )}

          {!loading && eligible.length > 0 && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                {eligible.slice(0, 4).map((v, i) => (
                  <div key={v.vendor_id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '12px',
                    border: i === 0 ? '1.5px solid var(--forest-green)' : '1px solid var(--border-cream)',
                    background: i === 0 ? 'var(--forest-green-light)' : '#FFFFFF'
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>{v.store_name}</span>
                        {i === 0 && (
                          <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#166534', background: '#DCFCE7', padding: '1px 6px', borderRadius: '4px' }}>
                            BEST MATCH
                          </span>
                        )}
                        <span style={{ fontSize: '10px', color: 'var(--ink-muted)', fontFamily: 'ui-monospace, monospace' }}>{v.vendor_id}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '3px', fontSize: '11px', color: 'var(--ink-secondary)', flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <MapPin size={11} /> {v.distance_km} km · {v.locality}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Package size={11} /> {v.stock} in stock
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Truck size={11} /> ~{Math.round((v.estimated_fulfilment_minutes || 300) / 60)}h fulfilment
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#166534' }}>
                          <ShieldCheck size={11} /> Verified
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink)' }}>{inr(v.price_paise)}</div>
                      <button
                        onClick={() => handleAllocate(v.vendor_id)}
                        disabled={allocating}
                        style={{
                          marginTop: '4px', fontSize: '11px', fontWeight: 700,
                          padding: '4px 10px', borderRadius: '9999px', cursor: allocating ? 'wait' : 'pointer',
                          border: '1px solid var(--forest-green)', color: '#FFFFFF',
                          background: 'var(--forest-green)'
                        }}
                      >
                        Order here
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleAllocate(null)}
                disabled={allocating}
                style={{
                  width: '100%', padding: '9px', borderRadius: '9999px', cursor: allocating ? 'wait' : 'pointer',
                  border: '1.5px dashed var(--forest-green)', background: 'transparent',
                  fontSize: '12.5px', fontWeight: 700, color: 'var(--forest-green)'
                }}
              >
                {allocating ? 'Allocating…' : 'Let Cairn pick the best vendor'}
              </button>
              {excluded.length > 0 && (
                <div style={{ fontSize: '10.5px', color: 'var(--ink-muted)', marginTop: '8px' }}>
                  {excluded.length} vendor{excluded.length > 1 ? 's' : ''} excluded (out of stock, closed, or outside service area).
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
