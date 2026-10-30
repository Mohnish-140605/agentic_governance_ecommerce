import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Lock, 
  Check, 
  Hand, 
  X 
} from 'lucide-react';

export default function Screen6_Rules({
  rules,
  setRules,
  onShowToast
}) {
  const [activeScenario, setActiveScenario] = useState('scenarioA'); // 'scenarioA' | 'scenarioB' | 'scenarioC'
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Scenarios for real-time testing
  const scenarios = {
    scenarioA: {
      id: '#8491',
      name: 'Manual Japanese Carafe',
      merchant: 'Kinfolk Studio Ceramic Works',
      price: 3450,
      description: 'Safe to order autonomously. Protected by 15-minute Tranquility hold window.'
    },
    scenarioB: {
      id: '#8842',
      name: 'Dell XPS 13 Plus',
      merchant: 'Dell Direct Official Flagship',
      price: 120000,
      description: 'High-tier workstation purchase requiring explicit biometrics or manual approval.'
    },
    scenarioC: {
      id: '#9941',
      name: 'MacBook Air M2 Starlight',
      merchant: 'UnboxCraft Authorized Studio',
      price: 75000,
      description: 'Evaluated against your monthly cap ceiling.'
    }
  };

  const currentScenario = scenarios[activeScenario];

  // Dynamic evaluation based on current rules
  const exceedsCap = currentScenario.price > rules.monthlyCap;
  const exceedsThreshold = currentScenario.price > rules.approvalThreshold;

  let simStatus = 'auto_order'; // 'auto_order' | 'needs_ok' | 'failed'
  if (exceedsCap) {
    simStatus = 'failed';
  } else if (exceedsThreshold) {
    simStatus = 'needs_ok';
  }

  const handleSave = () => {
    setSaveSuccess(true);
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

        {/* 2-Column Split: Controls on Left / Live Rule Simulator on Right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '36px',
          alignItems: 'start'
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
                  <span style={{ color: 'var(--ink-secondary)' }}>Current Cycle Usage (March)</span>
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
                Last updated today, 10:42 AM
              </span>
            </div>
          </div>

          {/* Right Column: Live Rule Simulator (Real-Time!) */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div className="cairn-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', boxShadow: 'var(--shadow-warm-lg)' }}>
              {/* Simulator Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600 }}>
                    Live Rule Simulator
                  </span>
                </div>
                <span className="badge-neutral" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  REAL-TIME
                </span>
              </div>

              {/* Scenario Switcher Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '20px' }}>
                {[
                  { id: 'scenarioA', label: 'Scenario A' },
                  { id: 'scenarioB', label: 'Scenario B' },
                  { id: 'scenarioC', label: 'Scenario C' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveScenario(s.id)}
                    style={{
                      padding: '8px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: activeScenario === s.id ? 700 : 500,
                      backgroundColor: activeScenario === s.id ? 'var(--forest-green)' : 'var(--bg-cream-subtle)',
                      color: activeScenario === s.id ? '#FFFFFF' : 'var(--ink)',
                      textAlign: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Intent Preview Box */}
              <div style={{
                backgroundColor: 'var(--bg-cream-subtle)',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ink-muted)' }}>
                    ARIA INTENT AUDIT {currentScenario.id}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>
                    ₹{currentScenario.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>
                  {currentScenario.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginBottom: '12px' }}>
                  {currentScenario.merchant}
                </div>

                {/* Simulated Outcome Badge */}
                <div style={{ marginBottom: '10px' }}>
                  {simStatus === 'auto_order' && (
                    <span className="badge-placed">
                      ● Auto-Ordered (Under all caps)
                    </span>
                  )}
                  {simStatus === 'needs_ok' && (
                    <span className="badge-review">
                      ● Needs Confirmation (Exceeds approval threshold)
                    </span>
                  )}
                  {simStatus === 'failed' && (
                    <span className="badge-failed">
                      ● Guardrail Triggered (Breaches monthly cap)
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '12.5px', color: 'var(--ink-secondary)' }}>
                  {currentScenario.description}
                </p>
              </div>

              {/* Simulated Stamps */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--border-cream)',
                padding: '16px',
                marginBottom: '18px'
              }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: '10px' }}>
                  VERIFICATION LEDGER
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 120px), 1fr))', gap: '8px' }}>
                  {/* Budget Stamp */}
                  <div style={{
                    backgroundColor: exceedsCap ? 'var(--coral-light)' : 'var(--forest-green-light)',
                    border: `1px solid ${exceedsCap ? 'var(--coral-border)' : 'var(--forest-green-border)'}`,
                    borderRadius: '10px',
                    padding: '8px 6px',
                    textAlign: 'center'
                  }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#FFFFFF', margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {exceedsCap ? <X size={12} color="var(--coral-dark)" /> : <Check size={12} color="var(--forest-green)" />}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ink)' }}>WITHIN BUDGET</div>
                    <div style={{ fontSize: '9.5px', color: 'var(--ink-secondary)' }}>
                      {exceedsCap ? 'Breached' : 'Headroom OK'}
                    </div>
                  </div>

                  {/* Under Limit Stamp */}
                  <div style={{
                    backgroundColor: exceedsThreshold ? 'var(--butter-yellow-light)' : 'var(--forest-green-light)',
                    border: `1px solid ${exceedsThreshold ? 'var(--butter-yellow-border)' : 'var(--forest-green-border)'}`,
                    borderRadius: '10px',
                    padding: '8px 6px',
                    textAlign: 'center'
                  }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#FFFFFF', margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {exceedsThreshold ? <Hand size={12} color="var(--butter-yellow-dark)" /> : <Check size={12} color="var(--forest-green)" />}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ink)' }}>UNDER LIMIT</div>
                    <div style={{ fontSize: '9.5px', color: 'var(--ink-secondary)' }}>
                      {exceedsThreshold ? 'Needs OK' : 'Auto cleared'}
                    </div>
                  </div>

                  {/* Seller Stamp */}
                  <div style={{
                    backgroundColor: 'var(--forest-green-light)',
                    border: '1px solid var(--forest-green-border)',
                    borderRadius: '10px',
                    padding: '8px 6px',
                    textAlign: 'center'
                  }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#FFFFFF', margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={12} color="var(--forest-green)" />
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ink)' }}>SELLER VETTED</div>
                    <div style={{ fontSize: '9.5px', color: 'var(--ink-secondary)' }}>99.4% Trust</div>
                  </div>
                </div>

                {/* Barcode simulation */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed var(--border-cream)' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--ink-muted)' }}>CRN-8849-RULE-LOCK</span>
                  <div style={{ display: 'flex', gap: '2px', height: '14px', alignItems: 'flex-end' }}>
                    {[8, 14, 6, 12, 14, 4, 10, 14, 8, 12].map((h, i) => (
                      <div key={i} style={{ width: '2px', height: `${h}px`, backgroundColor: 'var(--ink-muted)' }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Explanatory Reassurance */}
              <div style={{
                backgroundColor: 'var(--bg-cream-subtle)',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '12px',
                color: 'var(--ink-secondary)',
                lineHeight: 1.5,
                marginBottom: '16px'
              }}>
                {simStatus === 'auto_order' && "Under all caps. Aria safely auto-orders this essential without interrupting you."}
                {simStatus === 'needs_ok' && "Exceeds auto threshold. Aria initiates a 15-minute Tranquility hold and alerts you."}
                {simStatus === 'failed' && "Breaches your monthly cap. Execution halts instantly with zero charge."}
              </div>

              {/* Deterministic Guarantee card */}
              <div style={{
                backgroundColor: '#FAF7F0',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid var(--border-cream)',
                display: 'flex',
                gap: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--forest-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0
                }}>
                  <Lock size={16} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginBottom: '3px' }}>
                    Deterministic Guarantee
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: 1.45, marginBottom: '6px' }}>
                    Aria cannot override your rules. Rules are enforced deterministically by code before payment intent is created. No hallucination or prompt injection can force payment beyond these limits.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: 'var(--forest-green)', fontWeight: 600 }}>
                    <span>✓ Client-Signed Contract</span>
                    <span>✓ AES-256 Guard Enclave</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
