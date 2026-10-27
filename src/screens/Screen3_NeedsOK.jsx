import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Hand, 
  Check, 
  ArrowRight, 
  Leaf, 
  Cpu, 
  HardDrive, 
  Monitor, 
  Award,
  Lock,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Screen3_NeedsOK({
  orders,
  onApproveOrder,
  onRejectOrder,
  onShowToast,
  onNavigateToScreen,
  currentUser,
  rules
}) {
  const userName = currentUser ? currentUser.name.split(' ')[0] : 'Priya';
  const pendingOrder = (orders && orders.find(o => o.id === 'CRN-88421')) || (orders && orders.find(o => o.status === 'needs_ok')) || {
    id: 'CRN-88421',
    item: 'Dell XPS 13 Plus',
    price: 120000,
    merchant: 'Dell Direct Official Flagship'
  };
  const orderId = pendingOrder.id;

  // 15-minute countdown timer (default 10:45 = 645 seconds)
  const [secondsLeft, setSecondsLeft] = useState(645);
  const [isApproved, setIsApproved] = useState(pendingOrder.status === 'placed');
  const [isReleased, setIsReleased] = useState(pendingOrder.status === 'failed');

  useEffect(() => {
    if (secondsLeft <= 0 || isApproved || isReleased) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft, isApproved, isReleased]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleApprove = () => {
    setIsApproved(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1F4D3A', '#FFE9A8', '#34D399', '#FF6B5B']
    });
    if (onApproveOrder) {
      onApproveOrder(orderId);
    }
    if (onShowToast) {
      onShowToast(`Order #${orderId} approved! Trust Receipt stamped and verified.`);
    }
  };

  const handleReject = () => {
    setIsReleased(true);
    if (onRejectOrder) {
      onRejectOrder(orderId);
    }
    if (onShowToast) {
      onShowToast("Hold released gently. No funds were debited.");
    }
  };

  return (
    <div className="needs-ok-screen-wrap animate-fade-in" style={{ paddingBottom: '80px' }}>
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '36px 24px'
      }}>
        {/* Top Decision Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--coral-dark)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--coral-dark)' }} />
            <span>DECISION REQUIRED</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
            fontWeight: 500,
            color: 'var(--ink)',
            marginBottom: '10px'
          }}>
            Needs your OK, {userName}.
          </h1>

          <p style={{ fontSize: '18px', color: 'var(--ink-secondary)', maxWidth: '640px' }}>
            This is above your usual <strong style={{ color: 'var(--ink)' }}>₹{rules ? rules.approvalThreshold.toLocaleString('en-IN') : '1,00,000'}</strong> autonomous threshold. Want me to go ahead with this order?
          </p>
        </div>

        {/* 15-Minute Tranquility Hold Timer Banner */}
        <div style={{
          backgroundColor: isApproved ? 'var(--forest-green-light)' : isReleased ? '#F4EFE6' : 'var(--butter-yellow-light)',
          borderRadius: 'var(--radius-pill)',
          border: `1px solid ${isApproved ? 'var(--forest-green-border)' : isReleased ? 'var(--border-cream)' : 'var(--butter-yellow-border)'}`,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '36px',
          boxShadow: 'var(--shadow-warm-sm)',
          transition: 'all 0.3s ease'
        }}>
          <Clock size={18} color={isApproved ? 'var(--forest-green)' : isReleased ? 'var(--ink-muted)' : 'var(--butter-yellow-dark)'} />
          <span style={{ fontSize: '14.5px', fontWeight: 600, color: isApproved ? 'var(--forest-green)' : isReleased ? 'var(--ink-secondary)' : 'var(--butter-yellow-dark)' }}>
            {isApproved 
              ? 'Authorized & Settled · Priority fulfillment locked'
              : isReleased 
                ? 'Reservation released · Your intent remains safe' 
                : `Holding this reserved unit for ${formatTimer(secondsLeft)}`}
          </span>
        </div>

        {/* Split Layout: Left Product / Right Trust Receipt */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '36px',
          alignItems: 'start'
        }}>
          {/* Left Column: Product Card & Specifications */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid var(--border-cream)',
            padding: '24px',
            boxShadow: 'var(--shadow-warm-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, color: 'var(--forest-green)' }}>
                ✦ EDITORIAL SELECTION #084
              </span>
              <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>Dell Flagship Store</span>
            </div>

            {/* Large Product Photo */}
            <div style={{
              position: 'relative',
              borderRadius: '18px',
              overflow: 'hidden',
              height: '280px',
              backgroundColor: '#FAF5ED',
              marginBottom: '20px'
            }}>
              <img
                src="/assets/dell_xps.jpg"
                alt="Dell XPS 13 Plus"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--ink)',
                border: '1px solid var(--border-cream)'
              }}>
                Single Reserve Unit Allocated
              </span>
            </div>

            {/* Product Title & Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600 }}>
                Dell XPS 13 Plus
              </h2>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--forest-green)' }}>
                ₹1,20,000
              </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--ink-secondary)', marginBottom: '18px' }}>
              Pure White Edition · CNC Machined Aluminum & Gorilla Glass
            </p>

            {/* Verified Specifications Table */}
            <div style={{
              backgroundColor: 'var(--bg-cream-subtle)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.04em', marginBottom: '2px' }}>
                VERIFIED SPECIFICATIONS
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-secondary)' }}>
                  <Cpu size={14} color="var(--forest-green)" />
                  <span>Processor</span>
                </div>
                <strong style={{ color: 'var(--ink)' }}>Intel Core i7-1360P (13th Gen)</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-secondary)' }}>
                  <HardDrive size={14} color="var(--forest-green)" />
                  <span>Memory & Drive</span>
                </div>
                <strong style={{ color: 'var(--ink)' }}>32GB LPDDR5 · 1TB NVMe PCIe 4</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-secondary)' }}>
                  <Monitor size={14} color="var(--forest-green)" />
                  <span>Display</span>
                </div>
                <strong style={{ color: 'var(--ink)' }}>3.5K OLED InfinityEdge (Touch)</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-secondary)' }}>
                  <Award size={14} color="var(--forest-green)" />
                  <span>Warranty & Origin</span>
                </div>
                <strong style={{ color: 'var(--ink)' }}>Dell Direct Official · 3-Yr Onsite</strong>
              </div>
            </div>

            {/* Sustainability Note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--forest-green)', marginBottom: '16px' }}>
              <Leaf size={14} />
              <span>Sustainably boxed in 100% ocean-bound and recycled molded pulp with zero plastic wrappers.</span>
            </div>

            {/* Flagged Reason Card */}
            <div style={{
              backgroundColor: 'var(--butter-yellow-light)',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid var(--butter-yellow-border)'
            }}>
              <div style={{ fontSize: '13px', color: 'var(--ink)' }}>
                Why Aria flagged this purchase
              </div>
              <span className="badge-review" style={{ fontSize: '11px' }}>
                Rule #04 triggered
              </span>
            </div>
          </div>

          {/* Right Column: Trust Receipt with Middle Yellow Stamp */}
          <div>
            <div className="trust-receipt" style={{ maxWidth: '100%' }}>
              {/* Receipt Header */}
              <div className="trust-receipt-header">
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--ink-muted)' }}>
                    TRUST LEDGER INTENT
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600 }}>
                    Order Intent #CRN-88421
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>TIMESTAMP</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 600 }}>Today · 10:41 AM IST</div>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="trust-receipt-details">
                <div className="receipt-meta-box">
                  <div className="receipt-meta-label">Item Cost</div>
                  <div className="receipt-meta-value" style={{ color: 'var(--ink)' }}>₹1,20,000</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--ink-muted)' }}>GST Included (18%)</div>
                </div>

                <div className="receipt-meta-box">
                  <div className="receipt-meta-label">Shipping & Care</div>
                  <div className="receipt-meta-value" style={{ color: 'var(--forest-green)' }}>Complimentary</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--ink-muted)' }}>White Glove Handled</div>
                </div>

                <div className="receipt-meta-box">
                  <div className="receipt-meta-label">Destination</div>
                  <div className="receipt-meta-value">Jor Bagh</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--ink-muted)' }}>Priya's Residence</div>
                </div>
              </div>

              {/* Perforated divider */}
              <div className="trust-receipt-perforation">
                <div className="trust-receipt-dash" />
              </div>

              {/* Pre-Execution Verification (3 Stamps) */}
              <div className="trust-receipt-stamps-wrap">
                <div className="stamps-header">
                  <div className="stamps-title">
                    HUMAN-FIRST PRE-EXECUTION VERIFICATION
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-muted)', fontWeight: 600 }}>
                    Deterministic Check 3 of 3
                  </div>
                </div>

                <div className="stamps-grid">
                  {/* Stamp 1: Green */}
                  <div className="trust-stamp-card stamp-card-green">
                    <div className="stamp-emblem">
                      <Check size={22} strokeWidth={2.5} />
                    </div>
                    <div className="stamp-name">BUDGET APPROVED</div>
                    <div className="stamp-desc">
                      Within overall wallet budget (₹1,50,000 balance available)
                    </div>
                  </div>

                  {/* Stamp 2: Yellow (or green if approved) */}
                  <div className={`trust-stamp-card ${isApproved ? 'stamp-card-green' : 'stamp-card-yellow'}`}>
                    <div className="stamp-emblem">
                      {isApproved ? <Check size={22} strokeWidth={2.5} /> : <Hand size={22} strokeWidth={2.5} />}
                    </div>
                    <div className="stamp-name">
                      {isApproved ? 'USER APPROVED' : 'NEEDS CONFIRMATION'}
                    </div>
                    <div className="stamp-desc">
                      {isApproved ? `Explicit authorization granted by ${userName}` : `Exceeds auto threshold: ₹1,20,000 > ₹${rules ? rules.approvalThreshold.toLocaleString('en-IN') : '1,00,000'} limit`}
                    </div>
                  </div>

                  {/* Stamp 3: Green */}
                  <div className="trust-stamp-card stamp-card-green">
                    <div className="stamp-emblem">
                      <Award size={22} strokeWidth={2.5} />
                    </div>
                    <div className="stamp-name">AUTHENTIC SELLER</div>
                    <div className="stamp-desc">
                      Verified flagship merchant · Direct OEM Fulfilment
                    </div>
                  </div>
                </div>

                {/* Hashes & Signatures */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginTop: '16px',
                  fontSize: '11px',
                  fontFamily: 'ui-monospace, monospace',
                  color: 'var(--ink-muted)'
                }}>
                  <span>CRN-AUTH-HASH: 9e88fa12c309b4d</span>
                  <span>Signed by Aria Engine v4.2 · Rule Set: Priya-Primary-2026</span>
                </div>
              </div>

              {/* Two Big Pill Buttons */}
              <div style={{
                padding: '24px 28px',
                borderTop: '1px solid var(--border-cream-subtle)',
                backgroundColor: '#FCFAF6',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                {!isApproved && !isReleased ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                    <button
                      className="pill-button-primary"
                      onClick={handleApprove}
                      style={{ padding: '16px 24px', fontSize: '16px' }}
                    >
                      <span>Yes, order it (₹1,20,000)</span>
                      <ArrowRight size={18} />
                    </button>

                    <button
                      className="pill-button-secondary"
                      onClick={handleReject}
                      style={{ padding: '16px 20px', fontSize: '15px' }}
                    >
                      <span>Not now</span>
                    </button>
                  </div>
                ) : isApproved ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--forest-green)', fontWeight: 600 }}>
                      <Check size={18} />
                      <span>Order #CRN-88421 placed successfully!</span>
                    </div>
                    <button
                      className="pill-button-primary"
                      onClick={() => onNavigateToScreen('orders')}
                    >
                      View in Orders Sanctuary
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ color: 'var(--ink-secondary)', fontSize: '14px' }}>
                      Hold gently released. Unit returned to Dell Flagship store.
                    </div>
                    <button
                      className="pill-button-secondary"
                      onClick={() => setIsReleased(false)}
                      style={{ fontSize: '13px' }}
                    >
                      <RotateCcw size={14} />
                      <span>Re-engage hold</span>
                    </button>
                  </div>
                )}

                {/* Reassurance statement */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: 'var(--ink-muted)'
                }}>
                  <Lock size={13} />
                  <span>No funds are moved until you tap approve. If the timer runs out, the hold is gently released.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
