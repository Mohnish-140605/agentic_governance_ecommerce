import React from 'react';
import { 
  Activity, 
  FileCheck,
  CheckCircle2
} from 'lucide-react';

export default function Screen8_StoreHealth({ onShowToast: _onShowToast }) {
  const scoreGroups = [
    {
      id: 'authority',
      title: 'Authority',
      score: 99.8,
      subtitle: 'Delegated Caps & Cryptographic Enforcement',
      description: 'Zero hallucination rate. Aria strictly refuses any API order request exceeding client-signed budget contracts.',
      color: 'var(--forest-green)',
      items: [
        'Delegated spending caps compliance: 100.0%',
        'Cryptographic rule signature matches: 99.8%',
        'Unauthorized prompt injection halts: 14 today'
      ]
    },
    {
      id: 'routing',
      title: 'Routing',
      score: 100.0,
      subtitle: 'Direct OEM & Certified Artisan Sourcing',
      description: 'Zero drop-shippers, zero algorithmic affiliate link loops, and zero fake scarcity banners.',
      color: '#10B981',
      items: [
        'Direct-from-source manufacturer verification: 100%',
        'Zero drop-shipping middlemen: 0 unverified nodes',
        'Consolidated low-carbon parcel bundling: Active'
      ]
    },
    {
      id: 'traceability',
      title: 'Traceability',
      score: 100.0,
      subtitle: 'Trust Receipts & Immutable Ledger Proofs',
      description: 'Every order generates a public, client-verifiable SHA-256 voucher backed by the 15-minute tranquility window.',
      color: '#059669',
      items: [
        'SHA-256 receipt integrity audit: 100% valid',
        '15-minute tranquility cancellation honor: 100%',
        'Instant refunds without customer service friction: Guaranteed'
      ]
    }
  ];

  const recentAudits = [
    {
      id: 'AUD-9912',
      time: '2 mins ago',
      orderId: 'CRN-9842',
      check: 'Framework 13 cleared against Priya\'s hardware allowance (₹94,990 < ₹1,00,000)',
      result: 'PASS · SIGNED'
    },
    {
      id: 'AUD-9911',
      time: '18 mins ago',
      orderId: 'CRN-88421',
      check: 'Dell XPS 13 flagged for manual biometric OK (₹1,20,000 > ₹1,00,000 threshold)',
      result: 'HOLD · DECISION REQUIRED'
    },
    {
      id: 'AUD-9910',
      time: '1 hour ago',
      orderId: 'CRN-99410',
      check: 'MacBook Air halted: exceeds ₹50,000 monthly ceiling by ₹25,000',
      result: 'HALTED · 0 CHARGED'
    }
  ];

  return (
    <div className="store-health-screen-wrap animate-fade-in" style={{ paddingBottom: '80px' }}>
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '36px 24px'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '6px' }}>
            <Activity size={14} />
            <span>REAL-TIME AUDIT SANCTUARY</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: 500, color: 'var(--ink)', marginBottom: '8px' }}>
            Store Health & Audit
          </h1>

          <p style={{ fontSize: '17px', color: 'var(--ink-secondary)', maxWidth: '640px' }}>
            Big friendly number cards and verification scores. No noisy graphs, no hidden algorithms — just deterministic integrity.
          </p>
        </div>

        {/* 3 Primary Score Rings / Pillar Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {scoreGroups.map((group) => {
            const radius = 42;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (group.score / 100) * circumference;

            return (
              <div
                key={group.id}
                className="cairn-card"
                style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  {/* Top: Score Ring and Group Title */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--ink-muted)' }}>
                        PILLAR METRIC
                      </span>
                      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 600, color: 'var(--ink)', marginTop: '2px' }}>
                        {group.title}
                      </h2>
                    </div>

                    {/* Circular SVG Score Ring */}
                    <div style={{ position: 'relative', width: '96px', height: '96px' }}>
                      <svg width="96" height="96" viewBox="0 0 100 100">
                        {/* Background track circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r={radius}
                          stroke="#EBE4D8"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        {/* Foreground animated value circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r={radius}
                          stroke={group.color}
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                          style={{ transition: 'stroke-dashoffset 1s ease' }}
                        />
                      </svg>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-serif)',
                        fontSize: '17px',
                        fontWeight: 700,
                        color: 'var(--ink)'
                      }}>
                        {group.score}%
                      </div>
                    </div>
                  </div>

                  {/* Subtitle & Description */}
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--forest-green)', marginBottom: '8px' }}>
                    {group.subtitle}
                  </div>
                  <p style={{ fontSize: '13.5px', color: 'var(--ink-secondary)', lineHeight: 1.55, marginBottom: '20px' }}>
                    {group.description}
                  </p>
                </div>

                {/* Bullet Checklist */}
                <div style={{
                  backgroundColor: 'var(--bg-cream-subtle)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {group.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--ink)' }}>
                      <CheckCircle2 size={14} color="var(--forest-green)" style={{ flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Cryptographic Audit Feed */}
        <div className="cairn-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: 'var(--forest-green)' }}>
                IMMUTABLE AUDIT LOG
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600 }}>
                Recent Pre-Execution Checks
              </h3>
            </div>
            <span className="badge-neutral" style={{ fontSize: '12px' }}>
              AES-256 Enclave Synced
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentAudits.map((audit) => (
              <div
                key={audit.id}
                style={{
                  backgroundColor: 'var(--bg-cream-subtle)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--forest-green)',
                    boxShadow: 'var(--shadow-warm-sm)'
                  }}>
                    <FileCheck size={18} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--ink-muted)' }}>
                      <span style={{ fontFamily: 'monospace' }}>{audit.id}</span>
                      <span>·</span>
                      <span>{audit.orderId}</span>
                      <span>·</span>
                      <span>{audit.time}</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', marginTop: '2px' }}>
                      {audit.check}
                    </div>
                  </div>
                </div>

                <div>
                  <span className={audit.result.includes('PASS') ? 'badge-placed' : audit.result.includes('HOLD') ? 'badge-review' : 'badge-failed'}>
                    {audit.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
