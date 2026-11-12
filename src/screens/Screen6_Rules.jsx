import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  Check
} from 'lucide-react';
import { updatePolicyRules } from '../services/api';

export default function Screen6_Rules({
  rules,
  setRules,
  onShowToast
}) {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    updatePolicyRules(rules).catch(() => { });
    if (onShowToast) {
      onShowToast("Personal safeguards cryptographically saved and deployed to Aria Enclave.");
    }
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="rules-screen-wrap animate-fade-in" style={{ paddingBottom: '80px' }}>
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '36px 24px'
      }}>
        {/* Top Header */}
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
              <ShieldCheck size={14} />
              <span>DETERMINISTIC SPENDING SAFEGUARDS</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: 500, color: 'var(--ink)', marginBottom: '8px' }}>
              Personal Safeguards
            </h1>
            <p style={{ fontSize: '16.5px', color: 'var(--ink-secondary)', maxWidth: '620px' }}>
              Aria works strictly within bounds defined by you. Every order intent is audited by cryptographically hardcoded rules before any transaction is initiated.
            </p>
          </div>

          {/* Active Guard Status Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-pill)',
            border: '1.5px solid var(--forest-green-border)',
            padding: '10px 20px',
            boxShadow: 'var(--shadow-warm-sm)'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'var(--forest-green-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--forest-green)'
            }}>
              <ShieldCheck size={16} />
            </div>
            <div>
              <div style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--ink-muted)', fontWeight: 700 }}>Guard Status</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--forest-green)' }}>
                Active & Enforcing ●
              </div>
            </div>
          </div>
        </div>

        {/* Single Column: Guardrail Controls */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '36px',
          alignItems: 'start',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Left Column: Guardrail Sliders and Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Guardrail 01: Monthly Spending Cap */}
            <div className="cairn-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)' }}>
                  GUARDRAIL 01
                </span>
                <span style={{
                  backgroundColor: 'var(--bg-cream-subtle)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--ink)'
                }}>
                  ₹{rules.monthlyCap.toLocaleString('en-IN')}
                </span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, marginBottom: '6px' }}>
                Monthly Spending Cap
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginBottom: '20px' }}>
                Absolute spending ceiling across all merchant channels for this cycle.
              </p>

              {/* Progress bar */}
              <div style={{
                backgroundColor: 'var(--bg-cream-subtle)',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--ink-secondary)' }}>Current Cycle Usage ({new Date().toLocaleString('en-US', { month: 'long' })})</span>
                  <strong style={{ color: 'var(--ink)' }}>₹{rules.currentUsage.toLocaleString('en-IN')} of ₹{rules.monthlyCap.toLocaleString('en-IN')}</strong>
                </div>

                <div style={{
                  height: '8px',
                  backgroundColor: '#E6E0D4',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    width: `${Math.min(100, (rules.currentUsage / rules.monthlyCap) * 100)}%`,
                    height: '100%',
                    backgroundColor: (rules.currentUsage / rules.monthlyCap) > 0.9 ? 'var(--coral-dark)' : 'var(--forest-green)',
                    borderRadius: '9999px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ink-muted)', marginTop: '8px' }}>
                  <span>₹0</span>
                  <span style={{ color: 'var(--forest-green)', fontWeight: 600 }}>
                    ₹{Math.max(0, rules.monthlyCap - rules.currentUsage).toLocaleString('en-IN')} headroom remaining
                  </span>
                  <span>Max ₹2,00,000</span>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="10000"
                max="200000"
                step="5000"
                value={rules.monthlyCap}
                onChange={(e) => setRules({ ...rules, monthlyCap: Number(e.target.value) })}
                style={{
                  width: '100%',
                  accentColor: 'var(--forest-green)',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--ink-muted)', marginTop: '6px' }}>
                <span>Range: ₹10,000</span>
                <span>Step: ₹5,000</span>
                <span>₹2,00,000</span>
              </div>
            </div>

            {/* Guardrail 02: Ask me before orders above */}
            <div className="cairn-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)' }}>
                  GUARDRAIL 02
                </span>
                <span style={{
                  backgroundColor: 'var(--bg-cream-subtle)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--ink)'
                }}>
                  ₹{rules.approvalThreshold.toLocaleString('en-IN')}
                </span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, marginBottom: '6px' }}>
                Ask me before orders above
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginBottom: '18px' }}>
                Purchases exceeding this amount require biometrics or manual approval.
              </p>

              {/* 3 Quick Preset Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 120px), 1fr))', gap: '8px', marginBottom: '16px' }}>
                {[
                  { label: '₹25,000 (Conservative)', value: 25000 },
                  { label: '₹1,00,000 (Balanced)', value: 100000 },
                  { label: '₹1,50,000 (Relaxed)', value: 150000 }
                ].map((preset) => {
                  const isSelected = rules.approvalThreshold === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setRules({ ...rules, approvalThreshold: preset.value })}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '12px',
                        fontSize: '11.5px',
                        fontWeight: isSelected ? 700 : 500,
                        backgroundColor: isSelected ? 'var(--forest-green-light)' : '#FFFFFF',
                        color: isSelected ? 'var(--forest-green)' : 'var(--ink)',
                        border: `1.5px solid ${isSelected ? 'var(--forest-green)' : 'var(--border-cream)'}`,
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Fine Slider */}
              <input
                type="range"
                min="10000"
                max="250000"
                step="5000"
                value={rules.approvalThreshold}
                onChange={(e) => setRules({ ...rules, approvalThreshold: Number(e.target.value) })}
                style={{
                  width: '100%',
                  accentColor: 'var(--forest-green)',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Guardrail 03: Hold & Review Tranquility Window */}
            <div className="cairn-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)' }}>
                  GUARDRAIL 03
                </span>
                {/* Switch Toggle */}
                <div
                  onClick={() => setRules({ ...rules, tranquilityHoldEnabled: !rules.tranquilityHoldEnabled })}
                  style={{
                    width: '48px',
                    height: '26px',
                    borderRadius: '9999px',
                    backgroundColor: rules.tranquilityHoldEnabled ? 'var(--forest-green)' : '#D1C8B8',
                    padding: '2px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    transform: rules.tranquilityHoldEnabled ? 'translateX(22px)' : 'translateX(0)',
                    transition: 'transform 0.2s ease'
                  }} />
                </div>
              </div>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, marginBottom: '6px' }}>
                Hold & Review Tranquility Window
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginBottom: '14px' }}>
                A 15-minute anti-impulse buffer. During this window, you can undo any autonomous purchase with a single tap before fulfillment locks.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--forest-green)', fontWeight: 600 }}>
                <Clock size={15} />
                <span>Buffer duration: <strong>{rules.tranquilityHoldMinutes} Minutes</strong> after each order placement</span>
              </div>
            </div>

            {/* Guardrail 04: If a merchant's offer breaks my budget */}
            <div className="cairn-card" style={{ padding: '24px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)', marginBottom: '8px', display: 'block' }}>
                GUARDRAIL 04
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, marginBottom: '6px' }}>
                If a merchant's offer breaks my budget
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginBottom: '18px' }}>
                Instruct Aria's autonomous negotiator when prices fluctuate higher than stored benchmarks.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  onClick={() => setRules({ ...rules, outOfBudgetBehavior: 'alternatives' })}
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    border: `1.5px solid ${rules.outOfBudgetBehavior === 'alternatives' ? 'var(--forest-green)' : 'var(--border-cream)'}`,
                    backgroundColor: rules.outOfBudgetBehavior === 'alternatives' ? 'var(--forest-green-light)' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)' }}>
                      Ask me with alternatives
                    </div>
                    <span className="badge-review" style={{ fontSize: '10.5px' }}>RECOMMENDED</span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--ink-secondary)' }}>
                    Aria surfaces 2 vetted ethical alternatives within target budget for approval.
                  </div>
                </div>

                <div
                  onClick={() => setRules({ ...rules, outOfBudgetBehavior: 'notify_only' })}
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    border: `1.5px solid ${rules.outOfBudgetBehavior === 'notify_only' ? 'var(--forest-green)' : 'var(--border-cream)'}`,
                    backgroundColor: rules.outOfBudgetBehavior === 'notify_only' ? 'var(--forest-green-light)' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)', marginBottom: '4px' }}>
                    Never order & notify me
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--ink-secondary)' }}>
                    Immediately halt execution. No transaction attempts or retries without your explicit prompt.
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                className="pill-button-primary"
                onClick={handleSave}
                style={{ padding: '14px 28px', fontSize: '15px' }}
              >
                <Check size={16} />
                <span>{saveSuccess ? 'Saved & Deployed!' : 'Save Rule Preferences'}</span>
              </button>
              <span style={{ fontSize: '12.5px', color: 'var(--ink-muted)' }}>
                Last updated {new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })} today
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
