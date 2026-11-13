import React from 'react';
import { 
  X, 
  Hand, 
  Check, 
  ShieldAlert, 
  ArrowRight, 
  Sliders, 
  MessageSquare, 
  Heart, 
  CheckCircle2, 
  Star
} from 'lucide-react';
import { ALTERNATIVE_PRODUCTS } from '../data/mockData';

export default function Screen4_NotPlaced({
  onNavigateToScreen,
  onAskAriaAboutProduct,
  rules,
  guardrailItem = {}
}) {
  const hasBlockedRequest = Boolean(guardrailItem.name);
  const monthlyCap = Number(guardrailItem.monthlyCap ?? (rules ? rules.monthlyCap : 50000));
  const blockedPrice = Number(guardrailItem.price);
  const blockedName = guardrailItem.name;
  const blockedMerchant = guardrailItem.merchant || 'Not provided';
  const shopperId = guardrailItem.shopperId || 'Not provided';
  const ticketRef = guardrailItem.ticketRef || 'Not provided';
  const blockReason = guardrailItem.reason || 'The governance service blocked this request.';

  if (!hasBlockedRequest) {
    return (
      <div className="not-placed-screen-wrap animate-fade-in" style={{ paddingBottom: '80px' }}>
        <main style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '36px 24px' }}>
          <section role="status" style={{
            maxWidth: '680px',
            margin: '48px auto',
            padding: '40px 28px',
            textAlign: 'center',
            background: '#FFFFFF',
            border: '1px solid var(--border-cream)',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-warm-sm)'
          }}>
            <ShieldAlert size={36} color="var(--forest-green)" style={{ margin: '0 auto 14px' }} />
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', marginBottom: '8px' }}>
              No blocked requests
            </h1>
            <p style={{ fontSize: '15px', marginBottom: '22px' }}>
              A request blocked by governance will appear here. No blocked purchase is recorded right now.
            </p>
            <button className="pill-button-primary" onClick={() => onNavigateToScreen('explore')}>
              Back to Explore <ArrowRight size={16} />
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="not-placed-screen-wrap animate-fade-in" style={{
      backgroundColor: '#FAF5EE',
      minHeight: '100%',
      paddingBottom: '80px',
      position: 'relative'
    }}>
      {/* Subtle warm coral glow at top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '240px',
        background: 'radial-gradient(circle, rgba(255, 107, 91, 0.08) 0%, rgba(251, 247, 240, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '36px 24px',
        position: 'relative'
      }}>
        {/* Top Guardrail Banner */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--coral-light)',
            color: 'var(--coral-dark)',
            border: '1px solid var(--coral-border)',
            padding: '5px 14px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            marginBottom: '16px'
          }}>
            <ShieldAlert size={14} />
            <span>GOVERNANCE BLOCK · NO ORDER RECORDED</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
            fontWeight: 500,
            color: 'var(--ink)',
            marginBottom: '14px'
          }}>
            This request was not placed.
          </h1>

          <p style={{
            fontSize: '17px',
            color: 'var(--ink-secondary)',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            <strong style={{ color: 'var(--ink)' }}>{blockedName}</strong> was not ordered. Governance reason: {blockReason}
          </p>
        </div>

        {/* Failed Trust Receipt Card */}
        <div style={{ maxWidth: '720px', margin: '0 auto 48px' }}>
          <div className="trust-receipt" style={{ border: '1px solid #FCD4CF', boxShadow: 'var(--shadow-warm-lg)' }}>
            {/* Header */}
            <div className="trust-receipt-header" style={{ backgroundColor: '#FFFBFB' }}>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--coral-dark)' }}>
                  GOVERNANCE RECORD
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '19px', fontWeight: 600 }}>
                  {blockedName}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                  Merchant information: {blockedMerchant}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>REQUESTED PRICE</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--coral-dark)' }}>
                  {Number.isFinite(blockedPrice) ? `₹${blockedPrice.toLocaleString('en-IN')}` : 'Not provided'}
                </div>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="trust-receipt-details" style={{ backgroundColor: '#FFFBFB' }}>
              <div className="receipt-meta-box">
                <div className="receipt-meta-label">Monthly cap</div>
                <div className="receipt-meta-value">₹{monthlyCap.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '10.5px', color: 'var(--ink-muted)' }}>Configured buyer rule</div>
              </div>

              <div className="receipt-meta-box">
                <div className="receipt-meta-label">Shopper ID</div>
                <div className="receipt-meta-value">{shopperId}</div>
                <div style={{ fontSize: '10.5px', color: 'var(--ink-muted)' }}>Aria autonomous guard</div>
              </div>

              <div className="receipt-meta-box">
                <div className="receipt-meta-label">Order status</div>
                <div className="receipt-meta-value" style={{ color: 'var(--coral-dark)' }}>No order recorded</div>
                <div style={{ fontSize: '10.5px', color: 'var(--ink-muted)' }}>Payment is not connected</div>
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="trust-receipt-perforation">
              <div className="trust-receipt-dash" />
            </div>

            {/* Triple Verification Stamps */}
            <div className="trust-receipt-stamps-wrap">
              <div className="stamps-header">
                <div className="stamps-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldAlert size={14} color="var(--coral-dark)" />
                  <span>GOVERNANCE DECISION</span>
                </div>
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ink-muted)' }}>
                  PROPOSAL REF #{ticketRef}
                </div>
              </div>

              <div className="stamps-grid">
                {/* Stamp 1: Failed (Red Coral) */}
                <div className="trust-stamp-card stamp-card-coral">
                  <div className="stamp-emblem">
                    <X size={22} strokeWidth={2.5} />
                  </div>
                  <div className="stamp-name" style={{ color: 'var(--coral-dark)' }}>DECISION</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--coral-dark)', marginBottom: '3px' }}>
                    Blocked by governance
                  </div>
                  <div className="stamp-desc">
                    {blockReason}
                  </div>
                </div>

                {/* Stamp 2: Paused (Amber/Grey) */}
                <div className="trust-stamp-card stamp-card-yellow">
                  <div className="stamp-emblem">
                    <Hand size={22} strokeWidth={2.5} />
                  </div>
                  <div className="stamp-name">ORDER</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--butter-yellow-dark)', marginBottom: '3px' }}>
                    Not recorded
                  </div>
                  <div className="stamp-desc">
                    No purchase was placed by this request.
                  </div>
                </div>

                {/* Stamp 3: Green */}
                <div className="trust-stamp-card stamp-card-green">
                  <div className="stamp-emblem">
                    <Check size={22} strokeWidth={2.5} />
                  </div>
                  <div className="stamp-name">SELLER DETAILS</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--forest-green)', marginBottom: '3px' }}>
                    Not verified
                  </div>
                  <div className="stamp-desc">
                    Seller identity and fulfillment are not verified in this demo.
                  </div>
                </div>
              </div>
            </div>

            {/* Reassurance and Actions */}
            <div style={{
              padding: '20px 28px',
              borderTop: '1px solid var(--border-cream-subtle)',
              backgroundColor: '#FCFAF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{ fontSize: '13px', color: 'var(--ink-secondary)', maxWidth: '300px' }}>
                Payment and fulfillment are not connected in this demo.
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  className="pill-button-secondary"
                  onClick={() => onNavigateToScreen('rules')}
                  style={{ fontSize: '13.5px' }}
                >
                  <Sliders size={14} />
                  <span>Review spending rules</span>
                </button>

                <button
                  className="pill-button-primary"
                  onClick={() => {
                    onAskAriaAboutProduct(`Could you help me find alternatives to ${blockedName} strictly within my ₹${monthlyCap.toLocaleString('en-IN')} cap?`);
                    onNavigateToScreen('explore');
                  }}                  style={{ fontSize: '13.5px' }}
                >
                  <MessageSquare size={14} />
                  <span>Chat with Aria about alternatives</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Curated Alternatives Section */}
        <section>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '4px' }}>
                <CheckCircle2 size={14} />
                <span>EXAMPLE ALTERNATIVES</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 600 }}>
                Options to consider under your ₹{monthlyCap.toLocaleString('en-IN')} cap
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--ink-secondary)' }}>
                These demo catalog examples are not independently verified. Confirm current price, seller, stock, and warranty before ordering.
              </p>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--forest-green-light)',
              color: 'var(--forest-green)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12.5px',
              fontWeight: 600
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span>Indicative only · governance check required</span>
            </div>
          </div>

          {/* 3 Large Alternative Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {ALTERNATIVE_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="cairn-card cairn-card-hover"
                style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  {/* Photo with Tag */}
                  <div style={{
                    position: 'relative',
                    height: '210px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    marginBottom: '16px',
                    backgroundColor: '#F5EFE6'
                  }}>
                    <img
                      src={prod.image}
                      alt={prod.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <span className="badge-placed" style={{ backgroundColor: 'rgba(234, 247, 238, 0.95)' }}>
                        <CheckCircle2 size={12} />
                        Demo suggestion
                      </span>
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.92)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      color: 'var(--ink)'
                    }}>
                      {prod.subtext}
                    </div>
                  </div>

                  {/* Brand & Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, color: 'var(--ink-muted)' }}>
                      {prod.brand}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>
                      <Star size={12} fill="#D97706" color="#D97706" />
                      {prod.rating}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
                    {prod.name}
                  </h3>

                  {/* Description */}
                  <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                    {prod.description}
                  </p>
                </div>

                {/* Price & Action */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-cream-subtle)'
                  }}>
                    <div>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Example price</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>
                        ₹{prod.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      className="pill-button-primary"
                      onClick={() => {
                        onAskAriaAboutProduct(`Let's order the ${prod.name} for ₹${prod.price.toLocaleString('en-IN')}`);
                        onNavigateToScreen('explore');
                      }}
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                      <span>Ask Aria to order</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Calming Reassurance Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid var(--border-cream)',
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: 'var(--shadow-warm-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--butter-yellow-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--butter-yellow-dark)'
              }}>
                <Heart size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--ink)' }}>
                  Shopping at your pace, not the algorithm's.
                </div>
                <div style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>
                  Your ₹{monthlyCap.toLocaleString('en-IN')} safety guardrail can be adjusted anytime from My Rules with biometric re-authentication.
                </div>
              </div>
            </div>

            <button
              className="pill-button-secondary"
              onClick={() => onNavigateToScreen('rules')}
              style={{ fontSize: '13px' }}
            >
              Review Active Guardrails
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
