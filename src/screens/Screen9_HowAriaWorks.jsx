import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  FileCheck, 
  Clock, 
  HeartHandshake
} from 'lucide-react';
import TrustReceipt from '../components/TrustReceipt';

export default function Screen9_HowAriaWorks({ onNavigateToScreen }) {
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      num: '01',
      title: 'You Express Intent',
      subtitle: 'Natural language without tedious filters',
      narrative: 'No scrolling through endless ad banners or misleading search sponsored tags. You simply speak or type what you need—like "Find me a quiet study laptop under ₹60,000".',
      technical: 'Natural Language Understanding is quarantined to intent parsing only. It is strictly forbidden from initiating financial settlement transactions directly.',
      icon: <Sparkles size={24} color="var(--forest-green)" />
    },
    {
      num: '02',
      title: 'Aria Audits Your Rules',
      subtitle: 'Deterministic safeguards before any money moves',
      narrative: 'Behind the scenes, Aria acts as your personal fiduciary. It compares the cart against your personal monthly budget cap, single-order threshold, and verified seller list.',
      technical: 'Deterministic Rule Engine evaluates client-signed constraints stored locally. If (Price > UserCap), transaction drops into Safe Hold buffer immediately.',
      icon: <ShieldCheck size={24} color="var(--forest-green)" />
    },
    {
      num: '03',
      title: 'The Trust Receipt is Minted',
      subtitle: 'The tangible three-stamp guarantee',
      narrative: 'Before your card is debited, a boarding-pass-style Trust Receipt is stamped: Within budget, Under approval limit, and Seller verified. No surprises or surge markups.',
      technical: 'A SHA-256 state hash is computed across all 3 verification outputs. The digital receipt acts as a tamper-evident voucher for delivery escrow.',
      icon: <FileCheck size={24} color="var(--forest-green)" />
    },
    {
      num: '04',
      title: '15-Minute Tranquility Hold',
      subtitle: 'A pause to reflect and undo if needed',
      narrative: 'Buyer remorse is designed out of Cairn. Every order sits on a tranquil 15-minute hold. You can undo or adjust with one click before the parcel is packed.',
      technical: 'Merchant API fulfillment queue is delayed by exactly 900 seconds. Instant cancellation releases reserve hold without payment gateway fees.',
      icon: <Clock size={24} color="var(--forest-green)" />
    }
  ];

  return (
    <div className="how-aria-works-wrap animate-fade-in" style={{ paddingBottom: '90px' }}>
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '36px 24px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '36px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '6px' }}>
              <HeartHandshake size={14} />
              <span>THE ARCHITECTURE OF CALM</span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: 500, color: 'var(--ink)', marginBottom: '8px' }}>
              How Cairn Keeps You Safe
            </h1>

            <p style={{ fontSize: '17px', color: 'var(--ink-secondary)', maxWidth: '640px' }}>
              Built around the Trust Receipt: human-first delegation, zero dark patterns, and deterministic code you can inspect.
            </p>
          </div>

          {/* Simple Mode vs Deep Audit Mode Toggle */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-cream)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: 'var(--shadow-warm-sm)'
          }}>
            <button
              onClick={() => setIsSimpleMode(true)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '13px',
                fontWeight: isSimpleMode ? 700 : 500,
                backgroundColor: isSimpleMode ? 'var(--forest-green)' : 'transparent',
                color: isSimpleMode ? '#FFFFFF' : 'var(--ink-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              Simple Mode
            </button>
            <button
              onClick={() => setIsSimpleMode(false)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '13px',
                fontWeight: !isSimpleMode ? 700 : 500,
                backgroundColor: !isSimpleMode ? 'var(--forest-green)' : 'transparent',
                color: !isSimpleMode ? '#FFFFFF' : 'var(--ink-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              Deep Architecture Audit
            </button>
          </div>
        </div>

        {/* 4-Step Interactive Story Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '48px'
        }}>
          {steps.map((st, i) => {
            const isSelected = activeStep === (i + 1);
            return (
              <div
                key={st.num}
                onClick={() => setActiveStep(i + 1)}
                className="cairn-card cairn-card-hover"
                style={{
                  padding: '24px',
                  border: isSelected ? '2px solid var(--forest-green)' : '1px solid var(--border-cream)',
                  backgroundColor: isSelected ? '#FFFFFF' : 'var(--bg-card)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {/* Step Number & Icon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: isSelected ? 'var(--forest-green)' : 'var(--ink-muted)'
                  }}>
                    {st.num}
                  </div>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--forest-green-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {st.icon}
                  </div>
                </div>

                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '19px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
                  {st.title}
                </h3>
                <div style={{ fontSize: '12.5px', color: 'var(--forest-green)', fontWeight: 600, marginBottom: '12px' }}>
                  {st.subtitle}
                </div>

                <p style={{ fontSize: '13.5px', color: 'var(--ink-secondary)', lineHeight: 1.55 }}>
                  {isSimpleMode ? st.narrative : st.technical}
                </p>

                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '16px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--forest-green)'
                  }}>
                    ● Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Interactive Trust Receipt Showcase in Center */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid var(--border-cream)',
          padding: '36px',
          boxShadow: 'var(--shadow-warm-lg)'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 28px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '6px' }}>
              THE SIGNATURE ELEMENT
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600 }}>
              The Trust Receipt in Action
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--ink-secondary)', marginTop: '6px' }}>
              Notice the perforated edges, cryptographic ledger hash, and three deterministic stamps. It makes AI ordering completely tangible.
            </p>
          </div>

          <TrustReceipt
            id="CRN-2026-SAFE"
            item="Framework Laptop 13 + Silent Typing Module"
            price={94990}
            status="placed"
            authorizedAt="Today, 10:43 AM"
            paymentChannel="HDFC Priority ••4902 (AES-256)"
            destination="Jor Bagh, Priya's Residence"
            sha256="4e89bb02a819c991a03f421...910a"
            onTrackOrder={() => onNavigateToScreen('orders')}
          />
        </div>
      </div>
    </div>
  );
}
