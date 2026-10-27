import React, { useState } from 'react';
import { 
  Check, 
  Hand, 
  X, 
  ShieldCheck, 
  Download, 
  ArrowRight, 
  FileCheck, 
  Copy, 
  CheckCheck,
  PauseCircle,
  Award
} from 'lucide-react';

export default function TrustReceipt({
  id = 'CRN-9842',
  item = 'Framework Laptop 13',
  price = 94990,
  priceDelta = null,
  status = 'placed', // 'placed' | 'needs_ok' | 'failed'
  title = 'Order Trust Ledger',
  subtitle = 'VERIFIED INTENT VOUCHER',
  authorizedAt = 'Today, 10:43 AM',
  paymentChannel = 'HDFC Priority ••4902',
  destination = 'Registered Delivery Address',
  sha256 = '7f920eb18a24c559d81a942001e',
  stamps = null,
  onTrackOrder = null,
  onApprove = null,
  onReject = null,
  onRaiseLimit = null,
  onChatAlternatives = null,
  showActions = true,
  variant = 'full', // 'full' | 'mini'
  onShowToast = null
}) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Default stamps if not provided
  const receiptStamps = stamps || {
    budget: {
      title: status === 'failed' ? 'Exceeds Monthly Cap' : 'Within Your Budget',
      desc: status === 'failed' 
        ? '₹75,000 exceeds ₹50,000 monthly allowance' 
        : `₹${price.toLocaleString('en-IN')} < ₹1,00,000 hardware cap`,
      status: status === 'failed' ? 'failed' : 'placed'
    },
    approval: {
      title: status === 'needs_ok' 
        ? 'Needs Confirmation' 
        : status === 'failed' 
          ? 'Approval Paused' 
          : 'Under Approval Limit',
      desc: status === 'needs_ok'
        ? `Exceeds threshold: ₹${price.toLocaleString('en-IN')} > ₹1,00,000`
        : status === 'failed'
          ? 'Pending deliberate user approval'
          : 'Pre-authorized single transaction limit ₹1,00,000',
      status: status === 'needs_ok' ? 'review' : status === 'failed' ? 'review' : 'placed'
    },
    merchant: {
      title: 'Seller Verified',
      desc: 'Authentic modular hardware partner',
      status: 'placed'
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(sha256);
    setCopiedHash(true);
    if (onShowToast) {
      onShowToast(`SHA-256 Ledger Hash copied to clipboard: ${sha256.slice(0, 14)}...`);
    }
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    if (onShowToast) {
      onShowToast(`Generating cryptographic Trust Receipt PDF for #${id}...`);
    }
    setTimeout(() => {
      setDownloading(false);
      // Trigger browser download simulation
      const element = document.createElement('a');
      const file = new Blob([
        `CAIRN DETERMINISTIC TRUST RECEIPT\n` +
        `Order Ref: ${id}\n` +
        `Item: ${item}\n` +
        `Total: INR ${price}\n` +
        `Status: ${status.toUpperCase()}\n` +
        `Cryptographic Hash: ${sha256}\n` +
        `Authorized At: ${authorizedAt}\n` +
        `Zero-Hallucination Safe Enclave Guarantee`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `Cairn-Trust-Receipt-${id}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      if (onShowToast) {
        onShowToast(`Trust Receipt #${id} downloaded successfully.`);
      }
    }, 800);
  };

  // Mini variant for lists and cards
  if (variant === 'mini') {
    return (
      <div className="trust-receipt-mini">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck size={16} color="var(--forest-green)" />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
              Trust Ledger #{id}
            </span>
          </div>
          {status === 'placed' && <span className="badge-placed">● Settled</span>}
          {status === 'needs_ok' && <span className="badge-review">● Needs OK</span>}
          {status === 'failed' && <span className="badge-failed">● Paused</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '10px' }}>
          {/* Stamp 1 */}
          <div style={{
            background: receiptStamps.budget.status === 'failed' ? '#FFF5F5' : '#F4FAF6',
            border: `1px solid ${receiptStamps.budget.status === 'failed' ? '#FECACA' : '#C8E8D5'}`,
            borderRadius: '10px',
            padding: '8px 6px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: receiptStamps.budget.status === 'failed' ? '#FEE2E2' : '#E2F5E9',
              margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {receiptStamps.budget.status === 'failed' ? <X size={12} color="#DC2626" /> : <Check size={12} color="#10B981" />}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ink)' }}>Budget</div>
          </div>

          {/* Stamp 2 */}
          <div style={{
            background: receiptStamps.approval.status === 'review' ? '#FFFBEB' : '#F4FAF6',
            border: `1px solid ${receiptStamps.approval.status === 'review' ? '#FDE68A' : '#C8E8D5'}`,
            borderRadius: '10px',
            padding: '8px 6px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: receiptStamps.approval.status === 'review' ? '#FEF3C7' : '#E2F5E9',
              margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {receiptStamps.approval.status === 'review' ? <Hand size={12} color="#D97706" /> : <Check size={12} color="#10B981" />}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ink)' }}>Approval</div>
          </div>

          {/* Stamp 3 */}
          <div style={{
            background: '#F4FAF6',
            border: '1px solid #C8E8D5',
            borderRadius: '10px',
            padding: '8px 6px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: '#E2F5E9',
              margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Award size={12} color="#10B981" />
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ink)' }}>Seller</div>
          </div>
        </div>
      </div>
    );
  }

  // Full Boarding Pass Trust Receipt
  return (
    <div className="trust-receipt animate-fade-in" id={`receipt-${id}`}>
      {/* Top Header */}
      <div className="trust-receipt-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: status === 'failed' ? 'var(--coral-light)' : status === 'needs_ok' ? 'var(--butter-yellow-light)' : 'var(--forest-green-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: status === 'failed' ? 'var(--coral-dark)' : status === 'needs_ok' ? 'var(--butter-yellow-dark)' : 'var(--forest-green)'
          }}>
            <FileCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--ink-secondary)' }}>
              {subtitle}
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>
              {title} <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--ink-secondary)', fontWeight: 500 }}>#{id}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {status === 'placed' && (
            <span className="badge-placed">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              SETTLED & CONFIRMED
            </span>
          )}
          {status === 'needs_ok' && (
            <span className="badge-review">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              DECISION REQUIRED
            </span>
          )}
          {status === 'failed' && (
            <span className="badge-failed">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
              UNPLACED · PAUSED
            </span>
          )}
        </div>
      </div>

      {/* Item & Transaction Metadata Grid */}
      <div className="trust-receipt-details">
        <div className="receipt-meta-box">
          <div className="receipt-meta-label">Item</div>
          <div className="receipt-meta-value" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item}
          </div>
        </div>

        <div className="receipt-meta-box">
          <div className="receipt-meta-label">
            {status === 'failed' ? 'Requested Total' : 'Settlement Total'}
          </div>
          <div className="receipt-meta-value" style={{ color: status === 'failed' ? 'var(--coral-dark)' : 'var(--ink)' }}>
            ₹{price.toLocaleString('en-IN')}
            {priceDelta && (
              <span style={{ fontSize: '11px', color: 'var(--coral-dark)', marginLeft: '6px', fontWeight: 500 }}>
                {priceDelta}
              </span>
            )}
          </div>
        </div>

        <div className="receipt-meta-box">
          <div className="receipt-meta-label">Authorized At</div>
          <div className="receipt-meta-value" style={{ fontSize: '13px' }}>
            {authorizedAt}
          </div>
        </div>

        <div className="receipt-meta-box">
          <div className="receipt-meta-label">Payment Channel</div>
          <div className="receipt-meta-value" style={{ fontSize: '13px' }}>
            {paymentChannel}
          </div>
        </div>

        <div className="receipt-meta-box">
          <div className="receipt-meta-label">Delivery Destination</div>
          <div className="receipt-meta-value" style={{ fontSize: '13px' }}>
            {destination}
          </div>
        </div>
      </div>

      {/* Tactile Perforated Boarding Pass Divider */}
      <div className="trust-receipt-perforation">
        <div className="trust-receipt-dash" />
      </div>

      {/* Triple-Verification Safeguards Stamps */}
      <div className="trust-receipt-stamps-wrap">
        <div className="stamps-header">
          <div className="stamps-title">
            DETERMINISTIC SAFEGUARDS — Triple-Verification Integrity
          </div>
          <div className="stamps-security-badge">
            <ShieldCheck size={14} />
            <span>Zero-Hallucination Safe</span>
          </div>
        </div>

        <div className="stamps-grid">
          {/* Stamp 1: Budget */}
          <div className={`trust-stamp-card ${receiptStamps.budget.status === 'failed' ? 'stamp-card-coral' : 'stamp-card-green'}`}>
            <div className="stamp-emblem">
              {receiptStamps.budget.status === 'failed' ? (
                <X size={22} strokeWidth={2.5} />
              ) : (
                <Check size={22} strokeWidth={2.5} />
              )}
            </div>
            <div className="stamp-name">
              {receiptStamps.budget.title}
            </div>
            <div className="stamp-desc">
              {receiptStamps.budget.desc}
            </div>
          </div>

          {/* Stamp 2: Approval */}
          <div className={`trust-stamp-card ${
            receiptStamps.approval.status === 'review' 
              ? 'stamp-card-yellow' 
              : receiptStamps.approval.status === 'failed' 
                ? 'stamp-card-coral' 
                : 'stamp-card-green'
          }`}>
            <div className="stamp-emblem">
              {receiptStamps.approval.status === 'review' ? (
                <Hand size={22} strokeWidth={2.5} />
              ) : receiptStamps.approval.status === 'failed' ? (
                <PauseCircle size={22} strokeWidth={2.5} />
              ) : (
                <Check size={22} strokeWidth={2.5} />
              )}
            </div>
            <div className="stamp-name">
              {receiptStamps.approval.title}
            </div>
            <div className="stamp-desc">
              {receiptStamps.approval.desc}
            </div>
          </div>

          {/* Stamp 3: Seller Verification */}
          <div className={`trust-stamp-card ${receiptStamps.merchant.status === 'failed' ? 'stamp-card-coral' : 'stamp-card-green'}`}>
            <div className="stamp-emblem">
              {receiptStamps.merchant.status === 'failed' ? (
                <X size={22} strokeWidth={2.5} />
              ) : (
                <Award size={22} strokeWidth={2.5} />
              )}
            </div>
            <div className="stamp-name">
              {receiptStamps.merchant.title}
            </div>
            <div className="stamp-desc">
              {receiptStamps.merchant.desc}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons & SHA-256 Ledger Hash */}
      {showActions && (
        <div className="receipt-actions-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {status === 'placed' && (
              <>
                {onTrackOrder && (
                  <button className="pill-button-primary" onClick={onTrackOrder}>
                    <span>Track order</span>
                    <ArrowRight size={15} />
                  </button>
                )}
                <button 
                  className="pill-button-ghost" 
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  style={{ fontSize: '13px' }}
                >
                  <Download size={14} />
                  <span>{downloading ? 'Preparing...' : 'Download Trust Receipt PDF'}</span>
                </button>
              </>
            )}

            {status === 'needs_ok' && (
              <>
                {onApprove && (
                  <button className="pill-button-primary" onClick={onApprove}>
                    <span>Yes, order it (₹{price.toLocaleString('en-IN')})</span>
                    <ArrowRight size={15} />
                  </button>
                )}
                {onReject && (
                  <button className="pill-button-secondary" onClick={onReject}>
                    <span>Not now</span>
                  </button>
                )}
              </>
            )}

            {status === 'failed' && (
              <>
                {onRaiseLimit && (
                  <button className="pill-button-secondary" onClick={onRaiseLimit} style={{ fontSize: '13px' }}>
                    <span>Raise my rule limit to ₹{price.toLocaleString('en-IN')}</span>
                  </button>
                )}
                {onChatAlternatives && (
                  <button className="pill-button-primary" onClick={onChatAlternatives} style={{ fontSize: '13px' }}>
                    <span>Chat with Aria about alternatives</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Cryptographic hash badge */}
          <div 
            className="receipt-hash-code"
            onClick={handleCopyHash}
            title="Click to copy full SHA-256 ledger proof"
            style={{ cursor: 'pointer' }}
          >
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>SHA-256</span>
            <span>{sha256.slice(0, 7)}...{sha256.slice(-4)}</span>
            {copiedHash ? <CheckCheck size={12} color="#10B981" /> : <Copy size={12} />}
          </div>
        </div>
      )}
    </div>
  );
}
