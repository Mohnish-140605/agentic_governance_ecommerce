import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, MapPin, Package, RefreshCw, Truck } from 'lucide-react';
import { dispatchOrder, fetchOrders } from '../services/api';

const ORDER_STATUSES = [
  { id: 'needs_ok', label: 'Awaiting approval' },
  { id: 'placed', label: 'Placed' },
  { id: 'dispatched', label: 'Dispatched' },
  { id: 'failed', label: 'Failed' },
  { id: 'cancelled', label: 'Cancelled' }
];

const statusLabel = (status) => (
  ORDER_STATUSES.find((entry) => entry.id === status)?.label || 'Unknown status'
);

export default function SellerOrderView({
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [dispatchingOrderId, setDispatchingOrderId] = useState(null);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [ordersAvailable, setOrdersAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(null);

  const loadOrders = useCallback(async ({ manual = false } = {}) => {
    if (manual) {
      setIsRefreshing(true);
      setRefreshError(null);
    }
    try {
      const orders = await fetchOrders();
      const available = Array.isArray(orders);
      setOrdersAvailable(available);
      setSellerOrders(available ? orders.map((order) => {
        const createdAt = Number(order.created_at);
        return {
          ...order,
          id: String(order.id),
          item: order.product_name,
          price: order.price == null ? null : Number(order.price),
          timestamp: Number.isFinite(createdAt) && createdAt > 0
            ? new Date(createdAt * 1000).toLocaleString()
            : null
        };
      }) : []);
    } catch (error) {
      console.error('[Merchant orders] Failed to load backend orders:', error);
      setSellerOrders([]);
      setOrdersAvailable(false);
      setRefreshError('Unable to load order data. Try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const refreshOrders = () => loadOrders({ manual: true });
  const recordedOrderValue = sellerOrders
    .filter((order) => ['placed', 'dispatched'].includes(order.status))
    .reduce((total, order) => total + (Number(order.price) || 0), 0);
  const filteredOrders = activeTab === 'all'
    ? sellerOrders
    : sellerOrders.filter((order) => order.status === activeTab);

  const handleDispatch = async (orderId) => {
    setDispatchingOrderId(orderId);
    try {
      const result = await dispatchOrder(orderId);
      if (result?.status !== 'DISPATCHED') {
        throw new Error('The backend did not confirm dispatch.');
      }
      setSellerOrders((orders) => orders.map((order) => (
        order.id === orderId ? { ...order, status: 'dispatched' } : order
      )));
      onShowToast?.(`Order ${orderId} marked as dispatched.`);
    } catch (error) {
      console.error(`[Merchant orders] Failed to dispatch ${orderId}:`, error);
      onShowToast?.(`Could not dispatch order ${orderId}: ${error.message}`);
    } finally {
      setDispatchingOrderId(null);
    }
  };

  const tabs = [
    { id: 'all', label: `All orders (${sellerOrders.length})` },
    ...ORDER_STATUSES.map((status) => ({
      ...status,
      label: `${status.label} (${sellerOrders.filter((order) => order.status === status.id).length})`
    }))
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '36px 24px' }}>
        <header style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--forest-green)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '8px'
            }}>
              <Package size={14} />
              <span>Merchant order records</span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.2rem, 4vw, 3rem)',
              color: 'var(--ink)',
              fontWeight: 500
            }}>
              Buyer orders
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '16px', maxWidth: '650px' }}>
              Orders recorded by this app’s backend. Payment settlement and chargeback data are not connected.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={refreshOrders}
              disabled={isRefreshing}
              aria-label="Refresh orders"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '9px 13px',
                border: '1px solid var(--border-cream)',
                borderRadius: '9999px',
                background: '#FFFFFF',
                color: 'var(--ink-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: isRefreshing ? 'wait' : 'pointer'
              }}
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh orders
            </button>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '14px 20px',
              border: '1px solid var(--border-cream)',
              boxShadow: 'var(--shadow-warm-sm)'
            }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-muted)', fontWeight: 600 }}>
                Recorded orders
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--forest-green)', marginTop: '2px' }}>
                {ordersAvailable ? sellerOrders.length : '—'}
              </div>
            </div>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '14px 20px',
              border: '1px solid var(--border-cream)',
              boxShadow: 'var(--shadow-warm-sm)'
            }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-muted)', fontWeight: 600 }}>
                Placed order value
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--forest-green)', marginTop: '2px' }}>
                {ordersAvailable ? `₹${recordedOrderValue.toLocaleString('en-IN')}` : '—'}
              </div>
            </div>
          </div>
        </header>

        {!isLoading && !ordersAvailable && (
          <div role="status" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '18px',
            padding: '12px 14px',
            border: '1px solid var(--status-review-border)',
            borderRadius: '12px',
            background: 'var(--status-review-bg)',
            color: 'var(--status-review-text)',
            fontSize: '13px'
          }}>
            <AlertCircle size={16} />
            Order data is unavailable from the backend. No sample orders are being shown.
          </div>
        )}
        {refreshError && (
          <div role="alert" style={{ marginBottom: '18px', color: '#B91C1C', fontSize: '13px' }}>
            {refreshError}
          </div>
        )}
        {isLoading && (
          <div role="status" style={{ color: 'var(--ink-muted)', fontSize: '13px' }}>
            Loading orders from the backend…
          </div>
        )}

        {!isLoading && ordersAvailable && (
          <>
            <nav aria-label="Filter orders" style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '24px'
            }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={activeTab === tab.id}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '13px',
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    backgroundColor: activeTab === tab.id ? 'var(--forest-green)' : '#FFFFFF',
                    color: activeTab === tab.id ? '#FFFFFF' : 'var(--ink-secondary)',
                    border: activeTab === tab.id ? 'none' : '1px solid var(--border-cream)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {sellerOrders.length === 0 ? (
              <div role="status" style={{
                padding: '32px 20px',
                textAlign: 'center',
                background: '#FFFFFF',
                border: '1px solid var(--border-cream)',
                borderRadius: '16px',
                color: 'var(--ink-muted)'
              }}>
                No orders are recorded in the backend yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredOrders.map((order) => {
                  const canDispatch = order.status === 'placed';
                  const amount = Number(order.price);
                  return (
                    <article key={order.id} className="cairn-card" style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '24px',
                      border: '1px solid var(--border-cream)',
                      boxShadow: 'var(--shadow-warm-sm)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px',
                        borderBottom: '1px solid var(--border-cream-subtle)',
                        paddingBottom: '16px',
                        marginBottom: '16px'
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>
                              {order.id}
                            </span>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '3px 9px',
                              borderRadius: '9999px',
                              backgroundColor: canDispatch ? '#DCFCE7' : 'var(--bg-cream-subtle)',
                              color: canDispatch ? '#166534' : 'var(--ink-secondary)',
                              border: '1px solid var(--border-cream)'
                            }}>
                              {statusLabel(order.status)}
                            </span>
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginTop: '4px' }}>
                            Buyer ID: <strong style={{ color: 'var(--ink)' }}>{order.user_id || 'Not recorded'}</strong>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--forest-green)' }}>
                            {Number.isFinite(amount) ? `₹${amount.toLocaleString('en-IN')}` : 'Amount unavailable'}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                            Backend-recorded order amount
                          </div>
                        </div>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '16px',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>
                            {order.item || 'Product name unavailable'}
                          </div>
                          {order.destination && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '12.5px',
                              color: 'var(--ink-secondary)',
                              marginTop: '6px'
                            }}>
                              <MapPin size={14} color="var(--forest-green)" />
                              <span>Delivery to: <strong>{order.destination}</strong></span>
                            </div>
                          )}
                          {order.timestamp && (
                            <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '5px' }}>
                              Recorded {order.timestamp}
                            </div>
                          )}
                        </div>

                        {canDispatch && (
                          <div style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => handleDispatch(order.id)}
                              disabled={dispatchingOrderId === order.id}
                              style={{
                                backgroundColor: 'var(--forest-green)',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '10px 18px',
                                fontSize: '13px',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: dispatchingOrderId === order.id ? 'wait' : 'pointer',
                                opacity: dispatchingOrderId === order.id ? 0.7 : 1,
                                boxShadow: 'var(--shadow-warm-sm)'
                              }}
                            >
                              {dispatchingOrderId === order.id ? <Clock size={15} /> : <Truck size={15} />}
                              <span>{dispatchingOrderId === order.id ? 'Updating…' : 'Mark dispatched'}</span>
                            </button>
                          </div>
                        )}
                        {order.status === 'dispatched' && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#166534',
                            fontSize: '12px',
                            fontWeight: 600,
                            justifyContent: 'flex-end'
                          }}>
                            <CheckCircle2 size={15} />
                            <span>Dispatched</span>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
