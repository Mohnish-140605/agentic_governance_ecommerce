import React, { useState } from 'react';
import { 
  Clock, 
  Hand, 
  Check, 
  ArrowRight, 
  Package,
  Cpu, 
  HardDrive, 
  Monitor, 
  Award,
  Lock
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
  const pendingOrder = orders?.find((order) => order.status === 'needs_ok');
  const orderId = pendingOrder?.id;
  const [completedAction, setCompletedAction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isApproved = completedAction?.orderId === orderId && completedAction.status === 'approved';
  const isReleased = completedAction?.orderId === orderId && completedAction.status === 'released';
  const amount = pendingOrder?.price == null ? NaN : Number(pendingOrder.price);
  const formattedAmount = Number.isFinite(amount) ? amount.toLocaleString('en-IN') : null;

  const handleApprove = async () => {
    if (!pendingOrder || isApproved || isReleased || isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (!onApproveOrder) {
        onShowToast?.('Approval is unavailable because no governance handler is connected.');
        return;
      }
      const confirmed = await onApproveOrder?.(orderId);
      if (confirmed !== true) return;
      setCompletedAction({ orderId, status: 'approved' });
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1F4D3A', '#FFE9A8', '#34D399', '#FF6B5B']
      });
      onShowToast?.(`Approval for order #${orderId} was recorded.`);
    } catch (error) {
      console.error(`Unable to approve order ${orderId}:`, error);
      onShowToast?.('Approval could not be confirmed. The order remains pending.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!pendingOrder || isApproved || isReleased || isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (!onRejectOrder) {
        onShowToast?.('Release is unavailable because no governance handler is connected.');
        return;
      }
      const confirmed = await onRejectOrder?.(orderId);
      if (confirmed !== true) return;
      setCompletedAction({ orderId, status: 'released' });
      onShowToast?.(`Order #${orderId} was released.`);
    } catch (error) {
      console.error(`Unable to release order ${orderId}:`, error);
      onShowToast?.('Release could not be confirmed. The order remains pending.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!pendingOrder) {
    return (
      <div className="needs-ok-screen-wrap animate-fade-in" style={{ paddingBottom: '80px' }}>
        <main style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '36px 24px' }}>
          <section
            role="status"
            style={{
              maxWidth: '680px',
              margin: '48px auto',
              padding: '40px 28px',
              textAlign: 'center',
              background: '#FFFFFF',
              border: '1px solid var(--border-cream)',
              borderRadius: '24px',
              boxShadow: 'var(--shadow-warm-sm)'
            }}
          >
            <Package size={36} color="var(--forest-green)" style={{ margin: '0 auto 14px' }} />
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', marginBottom: '8px' }}>
              No approvals pending
            </h1>
            <p style={{ fontSize: '15px', marginBottom: '22px' }}>
              Orders that need your decision will appear here. There is no order awaiting approval right now.
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
            color: '#B45309',
            backgroundColor: '#FEF3C7',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '10px',
            border: '1px solid #FCD34D'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <span>HUMAN APPROVAL GATE · SAFETY THRESHOLD</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
            fontWeight: 500,
            color: 'var(--ink)',
            marginBottom: '10px'
          }}>
            Review this order
          </h1>

          <p style={{ fontSize: '17px', color: 'var(--ink-secondary)', maxWidth: '680px', lineHeight: 1.5 }}>
            This order needs your explicit decision before it can proceed. Your automatic approval threshold is{' '}
            <strong style={{ color: 'var(--ink)' }}>
              ₹{Number(rules?.approvalThreshold || 0).toLocaleString('en-IN')}
            </strong>.
          </p>
        </div>

        {/* Do not display a countdown unless the backend supplies an expiry time. */}
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
              ? 'Approval recorded · Seller fulfillment is still pending'
              : isReleased 
                ? 'Order released after your decision'
                : 'Awaiting your decision · No countdown is available'}
          </span>
        </div>

        {/* Split Layout: Left Product / Right Trust Receipt */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
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
                ORDER AWAITING REVIEW
              </span>
              <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{pendingOrder.merchant || 'Merchant not provided'}</span>
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
              {pendingOrder.image ? (
                <img
                  src={pendingOrder.image}
                  alt={pendingOrder.item || 'Order product'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Package size={48} color="var(--forest-green)" style={{ position: 'absolute', inset: 0, margin: 'auto' }} />
              )}
            </div>

            {/* Product Title & Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600 }}>
                {pendingOrder.item}
              </h2>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--forest-green)' }}>
                {formattedAmount ? `₹${formattedAmount}` : 'Price unavailable'}
              </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--ink-secondary)', marginBottom: '18px' }}>
              {pendingOrder.subtitle || 'No additional product details were provided.'}
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
                PRODUCT DETAILS
              </div>

              {pendingOrder.subtitle ? (
                pendingOrder.subtitle.split('·').map((spec, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-secondary)' }}>
                      {idx === 0 ? <Cpu size={14} color="var(--forest-green)" /> :
                       idx === 1 ? <HardDrive size={14} color="var(--forest-green)" /> :
                       idx === 2 ? <Monitor size={14} color="var(--forest-green)" /> :
                       <Award size={14} color="var(--forest-green)" />}
                      <span>Spec {idx + 1}</span>
                    </div>
                    <strong style={{ color: 'var(--ink)', textAlign: 'right', maxWidth: '55%' }}>{spec.trim()}</strong>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>
                  Product specifications are not available for this order.
                </p>
              )}
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
                Why this order needs your review
              </div>
              <span className="badge-review" style={{ fontSize: '11px' }}>
                {pendingOrder.flagReason || 'Awaiting approval'}
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
                    Order Intent #{orderId}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>TIMESTAMP</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 600 }}>{pendingOrder.timestamp || 'Not recorded'}</div>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="trust-receipt-details">
                <div className="receipt-meta-box">
                  <div className="receipt-meta-label">Item Cost</div>
                  <div className="receipt-meta-value" style={{ color: 'var(--ink)' }}>
                    {formattedAmount ? `₹${formattedAmount}` : 'Not provided'}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--ink-muted)' }}>As recorded by the order service</div>
                </div>

                <div className="receipt-meta-box">
                  <div className="receipt-meta-label">Merchant</div>
                  <div className="receipt-meta-value" style={{ color: 'var(--ink)' }}>
                    {pendingOrder.merchant || 'Not provided'}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--ink-muted)' }}>Seller verification is not shown here</div>
                </div>

                <div className="receipt-meta-box">
                  <div className="receipt-meta-label">Destination</div>
                  <div className="receipt-meta-value">{pendingOrder.destination || 'Not provided'}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--ink-muted)' }}>Delivery details as recorded</div>
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
                    Decision pending
                  </div>
                </div>

                <div className="stamps-grid">
                  <div className="trust-stamp-card stamp-card-yellow">
                    <div className="stamp-emblem">
                      <Hand size={22} strokeWidth={2.5} />
                    </div>
                    <div className="stamp-name">BUYER DECISION</div>
                    <div className="stamp-desc">
                      {isApproved ? 'Approval recorded.' : isReleased ? 'Order released.' : 'Waiting for your explicit choice.'}
                    </div>
                  </div>

                  <div className="trust-stamp-card stamp-card-yellow">
                    <div className="stamp-emblem">
                      <Clock size={22} />
                    </div>
                    <div className="stamp-name">AUTOMATIC THRESHOLD</div>
                    <div className="stamp-desc">
                      ₹{Number(rules?.approvalThreshold || 0).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="trust-stamp-card stamp-card-green">
                    <div className="stamp-emblem">
                      <Award size={22} strokeWidth={2.5} />
                    </div>
                    <div className="stamp-name">ORDER ID</div>
                    <div className="stamp-desc">
                      {orderId}
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
                  <span>Audit hash: {pendingOrder.sha256 || 'Not provided'}</span>
                  <span>{userName} · Governance decision record</span>
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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '12px' }}>
                    <button
                      className="pill-button-primary"
                      onClick={handleApprove}
                      disabled={isSubmitting || !formattedAmount}
                      style={{ padding: '16px 24px', fontSize: '16px' }}
                    >
                      <span>{isSubmitting ? 'Confirming…' : `Approve order${formattedAmount ? ` (₹${formattedAmount})` : ''}`}</span>
                      <ArrowRight size={18} />
                    </button>

                    <button
                      className="pill-button-secondary"
                      onClick={handleReject}
                      disabled={isSubmitting}
                      style={{ padding: '16px 20px', fontSize: '15px' }}
                    >
                      <span>{isSubmitting ? 'Confirming…' : 'Reject & release'}</span>
                    </button>
                  </div>
                ) : isApproved ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--forest-green)', fontWeight: 600 }}>
                      <Check size={18} />
                      <span>Approval recorded for order #{orderId}.</span>
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
                      Order #{orderId} was released.
                    </div>
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
                  <span>This demo records governance decisions only; payment and fulfillment are not connected.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
