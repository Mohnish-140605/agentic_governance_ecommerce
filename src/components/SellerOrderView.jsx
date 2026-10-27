import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MapPin
} from 'lucide-react';

export default function SellerOrderView({
  orders: _orders,
  currentLocation,
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('all');

  const sellerOrders = [
    {
      id: 'CRN-ORD-8812',
      buyer: 'Priya Sharma (priya.sharma@gmail.com)',
      item: 'Kinto Slow Coffee Brewer (600ml Carafe)',
      qty: 1,
      total: 3450,
      escrowStatus: 'Tranquility Hold (12m left)',
      status: 'hold',
      address: `${currentLocation.locality}, ${currentLocation.city}`,
      dispatchHub: currentLocation.hub,
      stamps: ['Origin OEM Verified', 'Direct Batch #401', 'No Middleman']
    },
    {
      id: 'CRN-ORD-9102',
      buyer: 'Arjun Mehta (arjun.m@gmail.com)',
      item: 'Solid Walnut Monitor Shelf (Dual Deck)',
      qty: 1,
      total: 14500,
      escrowStatus: 'Escrow Released · Ready for Dispatch',
      status: 'ready',
      address: 'Indiranagar 100ft Rd, Bengaluru',
      dispatchHub: 'Bengaluru Tech Corridor Hub',
      stamps: ['Artisan Crafted', 'GOTS Certified Timber', 'Inspected']
    },
    {
      id: 'CRN-ORD-7740',
      buyer: 'Elena Rostova (elena.r@cairn.io)',
      item: 'Minimal Japanese Ceramic Mug (Chalk White)',
      qty: 2,
      total: 3600,
      escrowStatus: 'Settled to Bank Ledger',
      status: 'settled',
      address: 'Shoreditch High St, London',
      dispatchHub: 'European Guild Center',
      stamps: ['Hand thrown', 'Food Safe Glaze', 'Direct Escrow']
    }
  ];

  const handleDispatch = (orderId) => {
    if (onShowToast) {
      onShowToast(`📦 Order #${orderId} marked for immediate dispatch. Courier partner notified.`);
    }
  };

  const filteredOrders = activeTab === 'all' 
    ? sellerOrders 
    : sellerOrders.filter(o => o.status === activeTab);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '36px 24px'
      }}>
        {/* Title */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--forest-green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              <Package size={14} />
              <span>MERCHANT ESCROW & FULFILLMENT DESK</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: 'var(--ink)', fontWeight: 500 }}>
              Buyer Orders & Escrow Vault
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '16px', maxWidth: '600px' }}>
              Direct buyer orders locked in smart escrow. Zero chargebacks, guaranteed maker payouts, and autonomous 15-minute buyer tranquility holds.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '14px 20px',
              border: '1px solid var(--border-cream)',
              boxShadow: 'var(--shadow-warm-sm)'
            }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-muted)', fontWeight: 600 }}>
                Escrow In Vault
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--forest-green)', marginTop: '2px' }}>
                ₹21,550
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
                Chargebacks
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#166534', marginTop: '2px' }}>
                0.00%
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px'
        }}>
          {[
            { id: 'all', label: 'All Orders (3)' },
            { id: 'hold', label: 'In Tranquility Window (1)' },
            { id: 'ready', label: 'Ready for Dispatch (1)' },
            { id: 'settled', label: 'Settled to Bank (1)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
        </div>

        {/* Orders List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="cairn-card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid var(--border-cream)',
                boxShadow: 'var(--shadow-warm-sm)'
              }}
            >
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>
                      {ord.id}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: '9999px',
                      backgroundColor: ord.status === 'hold' ? 'var(--butter-yellow)' : ord.status === 'ready' ? '#DCFCE7' : '#F1F5F9',
                      color: ord.status === 'hold' ? 'var(--butter-yellow-dark)' : ord.status === 'ready' ? '#166534' : 'var(--ink-secondary)',
                      border: ord.status === 'hold' ? '1px solid var(--butter-yellow-border)' : ord.status === 'ready' ? '1px solid #86EFAC' : '1px solid #E2E8F0'
                    }}>
                      {ord.escrowStatus}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginTop: '4px' }}>
                    Buyer: <strong style={{ color: 'var(--ink)' }}>{ord.buyer}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--forest-green)' }}>
                    ₹{ord.total.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                    Instant Escrow Guaranteed
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>
                    {ord.item} (Qty: {ord.qty})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--ink-secondary)', marginTop: '4px' }}>
                    <MapPin size={14} color="var(--forest-green)" />
                    <span>Delivery to: <strong>{ord.address}</strong></span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '2px' }}>
                    Dispatch through: {ord.dispatchHub}
                  </div>
                </div>

                {/* Verification badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {ord.stamps.map((st, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: 'var(--bg-cream-subtle)',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        color: 'var(--ink-secondary)',
                        border: '1px solid var(--border-cream)'
                      }}
                    >
                      ✓ {st}
                    </span>
                  ))}
                </div>

                {/* Action */}
                <div style={{ textAlign: 'right' }}>
                  {ord.status === 'ready' ? (
                    <button
                      onClick={() => handleDispatch(ord.id)}
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
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-warm-sm)'
                      }}
                    >
                      <Truck size={15} />
                      <span>Dispatch Now</span>
                    </button>
                  ) : ord.status === 'hold' ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--butter-yellow-dark)', fontWeight: 600 }}>
                      <Clock size={14} />
                      <span>Tranquility window expires in 12m</span>
                    </div>
                  ) : (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#166534', fontWeight: 600 }}>
                      <CheckCircle2 size={15} />
                      <span>Funds Deposited in HDFC ••9021</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
