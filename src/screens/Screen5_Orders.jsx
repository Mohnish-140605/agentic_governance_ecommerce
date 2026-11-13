import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileCheck, 
  ShieldCheck,
  ChevronRight,
  X,
  Truck
} from 'lucide-react';
import TrustReceipt from '../components/TrustReceipt';

const ORDER_STATUS_LABELS = {
  allocated: 'Awaiting vendor',
  acknowledged: 'Vendor acknowledged',
  accepted: 'Vendor accepted',
  preparing: 'Preparing',
  dispatched: 'On the way',
  delivered: 'Delivered',
  rejected: 'Vendor declined',
  cancelled: 'Cancelled',
  placed: 'Placed',
  needs_ok: 'Needs your OK',
  failed: 'Not placed'
};

const ACTIVE_ORDER_STATUSES = ['allocated', 'acknowledged', 'accepted', 'preparing'];

function getOrderStatusMessage(order) {
  switch (order.status) {
    case 'allocated':
      return `Assigned to ${order.vendor_name || order.merchant || 'a nearby store'}; waiting for vendor confirmation.`;
    case 'acknowledged':
      return 'The vendor acknowledged your order and is reviewing it.';
    case 'accepted':
      return 'The vendor accepted your order and is preparing the shipment.';
    case 'preparing':
      return 'Your order is being prepared by the vendor.';
    case 'dispatched':
      return order.tracking_ref
        ? `Your order was dispatched via ${order.carrier_name || 'the carrier'}. Tracking reference: ${order.tracking_ref}.`
        : 'Your order has been dispatched by the vendor.';
    case 'delivered':
      return 'Your order has been marked delivered.';
    case 'rejected':
      return 'The vendor declined. Cairn is checking for another eligible store.';
    case 'cancelled':
      return 'This order was cancelled.';
    case 'placed':
      return 'Your order was placed; fulfillment updates will appear here.';
    case 'needs_ok':
      return 'Waiting for your explicit OK before the order can proceed.';
    case 'failed':
      return order.flagReason || 'This order was not placed.';
    default:
      return 'Order status is being updated.';
  }
}

export default function Screen5_Orders({
  orders,
  onNavigateToScreen,
  onShowToast,
  currentUser: _currentUser,
  currentLocation: _currentLocation
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ACTIVE_ORDER_STATUSES.includes(order.status);
    return order.status === activeTab;
  });

  const getCount = (status) => {
    if (status === 'all') return orders.length;
    if (status === 'active') return orders.filter((order) => ACTIVE_ORDER_STATUSES.includes(order.status)).length;
    return orders.filter(o => o.status === status).length;
  };

  return (
    <div className="orders-screen-wrap animate-fade-in" style={{ paddingBottom: '80px' }}>
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '36px 24px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '4px' }}>
              <ShieldCheck size={14} />
              <span>DETERMINISTIC ACQUISITION LEDGER</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 500, color: 'var(--ink)' }}>
              Order Sanctuary
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ink-secondary)', marginTop: '4px' }}>
              Track vendor confirmation, preparation, and shipment updates.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-pill)',
            padding: '8px 18px',
            border: '1px solid var(--border-cream)',
            boxShadow: 'var(--shadow-warm-sm)'
          }}>
            <span style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>Orders:</span>
            <strong style={{ fontSize: '14px', color: 'var(--forest-green)' }}>
              {orders.length}
            </strong>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '32px',
          borderBottom: '1px solid var(--border-cream)',
          paddingBottom: '12px'
        }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'needs_ok', label: 'Needs my OK' },
            { id: 'active', label: 'In progress' },
            { id: 'dispatched', label: 'On the way' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'placed', label: 'Placed' },
            { id: 'failed', label: 'Not placed' }
          ].map((tab) => {
            const count = getCount(tab.id);
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: isActive ? 'var(--forest-green)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--ink)',
                  border: `1px solid ${isActive ? 'var(--forest-green)' : 'var(--border-cream)'}`,
                  fontSize: '13.5px',
                  fontWeight: isActive ? 600 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'var(--bg-cream-subtle)',
                  color: isActive ? '#FFFFFF' : 'var(--ink-muted)'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {filteredOrders.length === 0 ? (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid var(--border-cream)',
              padding: '60px 24px',
              textAlign: 'center'
            }}>
              <FileCheck size={36} color="var(--ink-muted)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '6px' }}>No orders in this view</h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-secondary)' }}>All clear under your active shopping profile.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="cairn-card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '24px',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedOrder(order)}
              >
                {/* Left: Product photo & Basic info */}
                <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
                  <img
                    src={order.image || '/assets/framework_laptop.jpg'}
                    alt={order.item}
                    onError={(e) => { e.currentTarget.src = '/assets/framework_laptop.jpg'; }}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '16px',
                      objectFit: 'cover',
                      backgroundColor: '#FAF5ED',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11.5px', fontFamily: 'monospace', color: 'var(--ink-muted)' }}>
                        #{order.id}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        color: ['failed', 'rejected', 'cancelled'].includes(order.status) ? '#B91C1C' : 'var(--forest-green)',
                        background: ['failed', 'rejected', 'cancelled'].includes(order.status) ? '#FEE2E2' : 'var(--forest-green-light)'
                      }}>
                        {ORDER_STATUS_LABELS[order.status] || 'Status update pending'}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
                      {order.item}
                    </h3>

                    <div style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginBottom: '6px' }}>
                      {order.subtitle}
                    </div>

                    <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)' }}>
                      {order.price == null ? 'Price unavailable' : `₹${Number(order.price).toLocaleString('en-IN')}`}
                    </div>
                  </div>
                </div>

                {/* Center: Friendly Status Line & Mini Trust Receipt */}
                <div>
                  <div style={{
                    backgroundColor: 'var(--bg-cream-subtle)',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    marginBottom: '12px',
                    fontSize: '13px',
                    color: 'var(--ink)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {order.status === 'dispatched' ? <Truck size={16} color="var(--forest-green)" /> : null}
                    {ACTIVE_ORDER_STATUSES.includes(order.status) || order.status === 'needs_ok'
                      ? <Clock size={16} color="var(--butter-yellow-dark)" />
                      : null}
                    {order.status === 'delivered' || order.status === 'placed'
                      ? <CheckCircle2 size={16} color="var(--forest-green)" />
                      : null}
                    {['failed', 'rejected', 'cancelled'].includes(order.status)
                      ? <XCircle size={16} color="var(--coral-dark)" />
                      : null}

                    <span>
                      {getOrderStatusMessage(order)}
                    </span>
                  </div>

                  {/* Mini Trust Receipt Component */}
                  <TrustReceipt
                    id={order.id}
                    item={order.item}
                    price={order.price}
                    status={order.status}
                    stamps={order.stamps}
                    variant="mini"
                  />
                </div>

                {/* Right: Quick Action Pill */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '8px' }}>
                  <button
                    className="pill-button-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(order);
                    }}
                    style={{ fontSize: '13.5px' }}
                  >
                    <span>View Full Trust Receipt</span>
                    <ChevronRight size={14} />
                  </button>

                  {order.status === 'needs_ok' && (
                    <button
                      className="pill-button-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToScreen('needs_ok');
                      }}
                      style={{ fontSize: '13px', padding: '8px 16px' }}
                    >
                      Authorize Now →
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal: Full Trust Receipt Inspection */}
        {selectedOrder && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(27, 27, 24, 0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }} onClick={() => setSelectedOrder(null)}>
            <div style={{ width: '100%', maxWidth: '700px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  position: 'absolute',
                  top: '-44px',
                  right: '0',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px'
                }}
              >
                <span>Close</span>
                <X size={18} />
              </button>

              <TrustReceipt
                id={selectedOrder.id}
                item={selectedOrder.item}
                price={selectedOrder.price}
                status={selectedOrder.status}
                authorizedAt={selectedOrder.timestamp}
                paymentChannel={selectedOrder.paymentChannel}
                destination={selectedOrder.destination}
                sha256={selectedOrder.sha256}
                stamps={selectedOrder.stamps}
                onShowToast={onShowToast}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
