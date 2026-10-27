import React from 'react';
import { X, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  orders,
  onNavigateToScreen
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      backgroundColor: 'rgba(27, 27, 24, 0.45)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease'
    }} onClick={onClose}>
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: 'var(--shadow-warm-float)',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600 }}>Active Curation Bag</div>
            <div style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>Controlled by your deterministic spending rules</div>
          </div>
          <button onClick={onClose} style={{ padding: '8px', borderRadius: '50%', background: 'var(--bg-cream-subtle)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Orders in bag / pending hold */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => (
            <div 
              key={order.id}
              style={{
                borderRadius: '16px',
                border: '1px solid var(--border-cream)',
                padding: '16px',
                backgroundColor: 'var(--bg-card-subtle)'
              }}
            >
              <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                <img 
                  src={order.image} 
                  alt={order.item} 
                  style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>{order.item}</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--forest-green)' }}>
                    ₹{order.price.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{order.id}</div>
                </div>
              </div>

              {/* Status pill & action */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-cream)' }}>
                {order.status === 'needs_ok' && (
                  <>
                    <span className="badge-review">
                      <Clock size={12} />
                      Hold active
                    </span>
                    <button 
                      className="pill-button-primary"
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                      onClick={() => {
                        onNavigateToScreen('needs_ok');
                        onClose();
                      }}
                    >
                      Review OK
                    </button>
                  </>
                )}

                {order.status === 'placed' && (
                  <>
                    <span className="badge-placed">
                      <CheckCircle2 size={12} />
                      Settled
                    </span>
                    <button 
                      className="pill-button-secondary"
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                      onClick={() => {
                        onNavigateToScreen('orders');
                        onClose();
                      }}
                    >
                      Receipt
                    </button>
                  </>
                )}

                {order.status === 'failed' && (
                  <>
                    <span className="badge-failed">Paused</span>
                    <button 
                      className="pill-button-secondary"
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                      onClick={() => {
                        onNavigateToScreen('not_placed');
                        onClose();
                      }}
                    >
                      Alternatives
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Guarantee */}
        <div style={{
          paddingTop: '20px',
          borderTop: '1px solid var(--border-cream)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--forest-green)', fontWeight: 600 }}>
            <ShieldCheck size={16} />
            <span>Zero-overrun guarantee enforced</span>
          </div>
          <button 
            className="pill-button-primary" 
            style={{ width: '100%' }}
            onClick={() => {
              onNavigateToScreen('chat');
              onClose();
            }}
          >
            Ask Aria to order anything
          </button>
        </div>
      </div>
    </div>
  );
}
