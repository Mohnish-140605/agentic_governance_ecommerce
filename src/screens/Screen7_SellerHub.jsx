import React from 'react';
import { 
  Building2, 
  RefreshCw,
  PlusCircle
} from 'lucide-react';
import { SELLER_LISTINGS } from '../data/mockData';

export default function Screen7_SellerHub({ 
  sellerListings = SELLER_LISTINGS,
  onOpenAddListing,
  currentLocation,
  onShowToast 
}) {
  const sellerTrustOutcomes = [
    {
      id: 'CRN-INV-301',
      title: 'Own inventory update',
      status: 'placed',
      badge: 'APPROVED & PUBLISHED',
      badgeClass: 'badge-placed',
      headline: 'Kinto Slow Coffee Carafe Batch #401',
      description: 'Stock quantity +40 and price verified against direct OEM distributor credentials. Zero intermediary markups.',
      stamps: [
        { name: 'ORIGIN AUDIT', status: 'pass', desc: 'Direct OEM API Verified' },
        { name: 'PRICE CEILING', status: 'pass', desc: 'Compliant with MSRP rules' },
        { name: 'SETTLEMENT', status: 'pass', desc: 'Instant ledger escrow' }
      ]
    },
    {
      id: 'CRN-INV-402',
      title: "Another seller's price",
      status: 'failed',
      badge: 'REJECTED · OWNERSHIP CONFLICT',
      badgeClass: 'badge-failed',
      headline: 'Tekla Percale Bedding Queen (Grey)',
      description: 'That product belongs to another seller. Cairn strictly prohibits duplicate listings, unauthorized drop-shipping, and predatory arbitrage.',
      stamps: [
        { name: 'ORIGIN AUDIT', status: 'fail', desc: 'Unauthorized reseller attempt' },
        { name: 'EXCLUSIVE RIGHTS', status: 'fail', desc: 'Owned by Tekla Official' },
        { name: 'CATALOG SAFE', status: 'pass', desc: 'Clean listing preserved' }
      ]
    },
    {
      id: 'CRN-INV-509',
      title: "Promotion that breaks buyer's budget",
      status: 'review',
      badge: 'NEEDS HUMAN REVIEW',
      badgeClass: 'badge-review',
      headline: 'Framework Modular Expansion Modules',
      description: 'Surge pricing / dynamic markup detected (+18% above 30-day baseline). Breaches shopper budget contracts. Hold active pending manual review.',
      stamps: [
        { name: 'ORIGIN AUDIT', status: 'pass', desc: 'Verified artisan seller' },
        { name: 'PRICE INTEGRITY', status: 'review', desc: 'Surge variance flagged (+18%)' },
        { name: 'ESCROW LOCK', status: 'review', desc: 'Settlement suspended' }
      ]
    }
  ];

  return (
    <div className="seller-hub-screen-wrap animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* Top Header Banner with Deep Forest Green */}
      <div style={{
        backgroundColor: 'var(--forest-green)',
        color: '#FFFFFF',
        padding: '54px 24px 64px',
        borderBottom: '1px solid var(--forest-green-hover)'
      }}>
        <div style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              marginBottom: '12px'
            }}>
              <Building2 size={14} />
              <span>CAIRN MERCHANT & ARTISAN SANCTUARY</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', color: '#FFFFFF', fontWeight: 500, marginBottom: '10px' }}>
              Seller Integrity Hub
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.82)', fontSize: '17px', maxWidth: '620px', lineHeight: 1.6 }}>
              Where responsible makers sell directly to mindful shoppers. No bidding wars, no ad placement auctions, and no predatory algorithms.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '16px 20px',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.05em' }}>
                Active Listings
              </div>
              <div style={{ fontSize: '26px', fontWeight: 700, marginTop: '2px' }}>48</div>
              <div style={{ fontSize: '11px', color: '#A7E4BA' }}>100% Origin Vetted</div>
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '16px 20px',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.05em' }}>
                Chargeback Rate
              </div>
              <div style={{ fontSize: '26px', fontWeight: 700, marginTop: '2px' }}>0.00%</div>
              <div style={{ fontSize: '11px', color: '#A7E4BA' }}>Protected by Trust Receipts</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '-28px auto 0',
        padding: '0 24px'
      }}>
        {/* Section: Three Outcomes Shown as Trust Receipts */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid var(--border-cream)',
            padding: '28px',
            boxShadow: 'var(--shadow-warm-lg)',
            marginBottom: '32px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--forest-green)', marginBottom: '4px' }}>
                CATALOG ENFORCEMENT ENGINE
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600 }}>
                Three Outcomes Verified by Trust Receipts
              </h2>
              <p style={{ fontSize: '14.5px', color: 'var(--ink-secondary)', marginTop: '4px' }}>
                Every seller submission passes deterministic verification before appearing in Aria's catalog.
              </p>
            </div>

            {/* 3 Outcome Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {sellerTrustOutcomes.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: 'var(--bg-card-subtle)',
                    borderRadius: '20px',
                    border: '1px solid var(--border-cream)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ink-muted)' }}>
                        {item.id}
                      </span>
                      <span className={item.badgeClass} style={{ fontSize: '11px' }}>
                        {item.badge}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                      {item.headline}
                    </h3>

                    <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                      {item.description}
                    </p>

                    {/* Perforated mini dash */}
                    <div className="trust-receipt-perforation" style={{ margin: '8px 0 12px' }}>
                      <div className="trust-receipt-dash" />
                    </div>

                    {/* 3 mini stamps */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                      {item.stamps.map((st, idx) => (
                        <div
                          key={idx}
                          style={{
                            backgroundColor: st.status === 'pass' ? '#F4FAF6' : st.status === 'fail' ? '#FFF5F5' : '#FFFBEB',
                            border: `1px solid ${st.status === 'pass' ? '#C8E8D5' : st.status === 'fail' ? '#FECACA' : '#FDE68A'}`,
                            borderRadius: '10px',
                            padding: '8px 6px',
                            textAlign: 'center'
                          }}
                        >
                          <div style={{ fontSize: '9.5px', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>
                            {st.name}
                          </div>
                          <div style={{ fontSize: '9px', color: 'var(--ink-secondary)', lineHeight: 1.2 }}>
                            {st.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-cream-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '12px', color: 'var(--forest-green)', fontWeight: 600, cursor: 'pointer' }} onClick={() => onShowToast && onShowToast(`Audited ledger for ${item.id}`)}>
                      Inspect cryptographic proof →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Airy Merchant Inventory Table */}
        <div className="cairn-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600 }}>
                Verified Artisan Inventory ({sellerListings.length})
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>
                Products live on Aria's direct shopping engine with zero ad fees · Nearest Hub: {currentLocation?.hub || 'Regional Dispatch Hub'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {onOpenAddListing && (
                <button
                  className="pill-button-primary"
                  onClick={onOpenAddListing}
                  style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
                >
                  <PlusCircle size={15} />
                  <span>Add Product</span>
                </button>
              )}
              <button 
                className="pill-button-secondary" 
                onClick={() => onShowToast && onShowToast("Inventory sync completed with direct warehouses.")}
                style={{ fontSize: '13px' }}
              >
                <RefreshCw size={14} />
                <span>Sync Stock</span>
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-cream)', fontSize: '11.5px', textTransform: 'uppercase', color: 'var(--ink-muted)', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 16px' }}>SKU</th>
                  <th style={{ padding: '12px 16px' }}>Product</th>
                  <th style={{ padding: '12px 16px' }}>Merchant</th>
                  <th style={{ padding: '12px 16px' }}>Stock</th>
                  <th style={{ padding: '12px 16px' }}>Base Price</th>
                  <th style={{ padding: '12px 16px' }}>Cairn Audit</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {sellerListings.map((listing) => (
                  <tr key={listing.id} style={{ borderBottom: '1px solid var(--border-cream-subtle)', fontSize: '14px' }}>
                    <td style={{ padding: '16px', fontFamily: 'monospace', color: 'var(--ink-muted)' }}>{listing.id}</td>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--ink)' }}>{listing.name}</td>
                    <td style={{ padding: '16px', color: 'var(--ink-secondary)' }}>{listing.merchant}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontWeight: 600, color: listing.stock > 0 ? 'var(--ink)' : 'var(--coral-dark)' }}>
                        {listing.stock} units
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 700, color: 'var(--ink)' }}>
                      ₹{listing.price.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span className={listing.badge === 'VERIFIED' ? 'badge-placed' : 'badge-review'}>
                        {listing.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button 
                        className="pill-button-ghost" 
                        onClick={() => onShowToast && onShowToast(`Inspecting inventory ledger for ${listing.name}`)}
                        style={{ fontSize: '12.5px' }}
                      >
                        Ledger Proof
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
