import React, { useState } from 'react';
import { 
  Activity, 
  FileCheck,
  CheckCircle2,
  Zap,
  Clock,
  ShieldCheck,
  Cpu,
  Server,
  Lock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function Screen8_StoreHealth({ onShowToast }) {
  const [selectedBenchmark, setSelectedBenchmark] = useState('routine');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshSla = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      if (onShowToast) onShowToast("SLA telemetry synchronized with live Governance Enclave.");
    }, 600);
  };

  const slaMetrics = [
    {
      id: 'gov-latency',
      label: 'Governance Latency',
      current: '148 ms',
      target: '≤ 500 ms (95th %ile)',
      compliance: '99.4%',
      status: 'Optimal',
      icon: <Zap size={16} color="var(--forest-green)" />,
      progress: 99.4,
      note: 'Deterministic in-memory evaluation before tool execution'
    },
    {
      id: 'llm-latency',
      label: 'LLM Response Time',
      current: '2.64 s',
      target: '≤ 5.0 s (95th %ile)',
      compliance: '98.1%',
      status: 'Optimal',
      icon: <Clock size={16} color="var(--forest-green)" />,
      progress: 98.1,
      note: 'Qwen / Gemma open-weight local inference'
    },
    {
      id: 'output-validity',
      label: 'Structured Output Validity',
      current: '99.1%',
      target: '≥ 95.0% after retries',
      compliance: '99.1%',
      status: 'Optimal',
      icon: <CheckCircle2 size={16} color="var(--forest-green)" />,
      progress: 99.1,
      note: 'Pydantic schema validation for all agent proposals'
    },
    {
      id: 'gov-enforcement',
      label: 'Governance Enforcement',
      current: '100.0%',
      target: '100% (Zero bypass)',
      compliance: '100.0%',
      status: 'Locked',
      icon: <ShieldCheck size={16} color="var(--forest-green)" />,
      progress: 100,
      note: 'All consequential actions intercepted prior to tool call'
    },
    {
      id: 'audit-completeness',
      label: 'Audit Completeness',
      current: '100.0%',
      target: '100% recorded',
      compliance: '100.0%',
      status: 'Locked',
      icon: <FileCheck size={16} color="var(--forest-green)" />,
      progress: 100,
      note: 'Every proposal, decision, and outcome hashed with SHA-256'
    },
    {
      id: 'app-availability',
      label: 'System Availability',
      current: '99.9%',
      target: '≥ 95.0% test uptime',
      compliance: '99.9%',
      status: 'Optimal',
      icon: <Server size={16} color="var(--forest-green)" />,
      progress: 99.9,
      note: 'Graceful fallback guards preventing application crashes'
    }
  ];

  const benchmarkDetails = {
    routine: {
      title: 'Benchmark 1: Routine Search & Semantic Comparison',
      llmTime: '2.32 s',
      govTime: '42 ms',
      outcome: 'AUTO-EXECUTE ELIGIBLE',
      details: 'Evaluates catalog search and acoustic filtering against stored user preferences. Low transaction risk.'
    },
    highValue: {
      title: 'Benchmark 2: High-Value Acquisition (Dell XPS 13 Plus)',
      llmTime: '3.10 s',
      govTime: '154 ms',
      outcome: 'HUMAN APPROVAL HOLD (15 MINS)',
      details: 'Detected order value (₹1,20,000) exceeding ₹1,00,000 auto-threshold. Suspended on tranquil human approval hold.'
    },
    conflict: {
      title: 'Benchmark 3: Policy Conflict & Spending Cap Breach',
      llmTime: '1.95 s',
      govTime: '36 ms',
      outcome: 'PRE-EXECUTION BLOCK (0 FUNDS DEBITED)',
      details: 'Detected ₹75,000 item violating ₹50,000 monthly ceiling. Immediate policy block with zero payment network debit.'
    }
  };

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
      check: 'Framework 13 cleared against hardware allowance (₹94,990 < ₹1,00,000)',
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
      check: 'Gaming laptop halted: exceeds ₹50,000 monthly ceiling by ₹25,000',
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
        <div style={{ marginBottom: '36px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '6px' }}>
              <Activity size={14} />
              <span>REAL-TIME AUDIT &amp; SLA SANCTUARY</span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: 500, color: 'var(--ink)', marginBottom: '8px' }}>
              Store Health &amp; SLA Telemetry
            </h1>

            <p style={{ fontSize: '17px', color: 'var(--ink-secondary)', maxWidth: '640px' }}>
              Deterministic governance scores and live Service-Level Agreement targets. No opaque algorithms — every metric is auditable.
            </p>
          </div>

          <button
            onClick={handleRefreshSla}
            className="pill-button-secondary"
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Telemetry'}</span>
          </button>
        </div>

        {/* ─── LIVE SLA TELEMETRY GRID (Research & Engineering SLA per LLM_SLA.docx) ─── */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid var(--forest-green-border)',
            padding: '28px',
            boxShadow: 'var(--shadow-warm-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                  <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--forest-green)' }}>
                    RESEARCH SLA COMMITMENT STATUS
                  </span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600, color: 'var(--ink)', marginTop: '2px' }}>
                  Live Engineering Performance Benchmarks
                </h2>
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--forest-green-light)',
                color: 'var(--forest-green)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                fontWeight: 700
              }}>
                <ShieldCheck size={14} />
                <span>ALL 6 SLA TARGETS COMPLIANT</span>
              </div>
            </div>

            {/* 6 SLA KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '16px',
              marginBottom: '28px'
            }}>
              {slaMetrics.map((sla) => (
                <div
                  key={sla.id}
                  style={{
                    backgroundColor: 'var(--bg-cream-subtle)',
                    borderRadius: '16px',
                    padding: '18px 20px',
                    border: '1px solid var(--border-cream-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'var(--shadow-warm-sm)'
                        }}>
                          {sla.icon}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{sla.label}</span>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: '#DCFCE7',
                        color: '#166534'
                      }}>
                        {sla.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--forest-green)' }}>
                        {sla.current}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--ink-muted)' }}>
                        Target: {sla.target}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{
                      width: '100%',
                      height: '5px',
                      backgroundColor: '#E6E0D4',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${sla.progress}%`,
                        backgroundColor: 'var(--forest-green)',
                        borderRadius: '9999px'
                      }} />
                    </div>
                  </div>

                  <div style={{ fontSize: '11.5px', color: 'var(--ink-secondary)', lineHeight: 1.4 }}>
                    {sla.note}
                  </div>
                </div>
              ))}
            </div>

            {/* Benchmark Scenario Selector */}
            <div style={{
              backgroundColor: '#FCFAF6',
              borderRadius: '16px',
              border: '1px solid var(--border-cream)',
              padding: '18px 20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-muted)', letterSpacing: '0.04em' }}>
                  Interactive Benchmark Trace
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { id: 'routine', label: 'Routine Search' },
                    { id: 'highValue', label: 'High-Value Hold' },
                    { id: 'conflict', label: 'Policy Block' }
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBenchmark(b.id)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '11.5px',
                        fontWeight: selectedBenchmark === b.id ? 700 : 500,
                        backgroundColor: selectedBenchmark === b.id ? 'var(--forest-green)' : '#FFFFFF',
                        color: selectedBenchmark === b.id ? '#FFFFFF' : 'var(--ink)',
                        border: `1px solid ${selectedBenchmark === b.id ? 'var(--forest-green)' : 'var(--border-cream)'}`,
                        cursor: 'pointer'
                      }}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Benchmark Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>
                    {benchmarkDetails[selectedBenchmark].title}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                    {benchmarkDetails[selectedBenchmark].details}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>LLM Latency</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>{benchmarkDetails[selectedBenchmark].llmTime}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Gov Latency</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--forest-green)' }}>{benchmarkDetails[selectedBenchmark].govTime}</div>
                  </div>
                  <div>
                    <span className="badge-placed" style={{ fontSize: '11px', padding: '4px 10px' }}>
                      {benchmarkDetails[selectedBenchmark].outcome}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Primary Score Rings / Pillar Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
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
