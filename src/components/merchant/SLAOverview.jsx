import React from 'react';
import { Activity, CheckCircle, Clock, FileCheck, ShieldCheck } from 'lucide-react';

const METRICS = [
  { key: 'gov_p95_ms', label: 'Governance p95', unit: ' ms', icon: ShieldCheck, target: 'Target ≤ 500 ms' },
  { key: 'llm_p95_s', label: 'LLM p95', unit: ' s', icon: Clock, target: 'Target ≤ 5 s' },
  { key: 'validity_pct', label: 'Structured validity', unit: '%', icon: CheckCircle, target: 'Target ≥ 95%' },
  { key: 'enforcement_pct', label: 'Governance enforced', unit: '%', icon: ShieldCheck, target: 'Target 100%' },
  { key: 'audit_completeness_pct', label: 'Audit completeness', unit: '%', icon: FileCheck, target: 'Target 100%' }
];

export default function SLAOverview({ metrics = null, isLoading = false }) {
  const evaluations = Number(metrics?.total_evaluations || 0);

  return (
    <section style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--border-cream)',
      borderRadius: '16px',
      padding: '24px'
    }}>
      <header style={{ marginBottom: '18px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
          color: 'var(--forest-green)',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          <Activity size={18} />
          Backend telemetry
        </div>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--ink)',
          marginBottom: '4px'
        }}>
          Service-level objectives
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
          Measurements reported by the governance and agent services
        </p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
        gap: '10px'
      }}>
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          const value = metrics?.[metric.key];
          return (
            <div key={metric.key} style={{
              padding: '14px',
              borderRadius: '11px',
              background: 'var(--bg-cream-subtle)',
              border: '1px solid var(--border-cream-subtle)'
            }}>
              <Icon size={16} color="var(--forest-green)" style={{ marginBottom: '9px' }} />
              <div style={{ fontSize: '19px', fontWeight: 700, color: 'var(--ink)' }}>
                {value == null ? '—' : `${value}${metric.unit}`}
              </div>
              <div style={{ marginTop: '3px', fontSize: '11px', fontWeight: 600, color: 'var(--ink-secondary)' }}>
                {metric.label}
              </div>
              <div style={{ marginTop: '4px', fontSize: '10px', color: 'var(--ink-muted)' }}>
                {metric.target}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '14px',
        padding: '11px 12px',
        borderRadius: '10px',
        background: 'var(--forest-green-light)',
        color: 'var(--ink-secondary)',
        fontSize: '11px',
        lineHeight: 1.5
      }}>
        {isLoading
          ? 'Loading measurements…'
          : metrics
            ? `${evaluations.toLocaleString()} recorded evaluations. Values are unavailable where the backend has not reported a measurement.`
            : 'Telemetry is unavailable. No SLA values are being inferred or shown as live measurements.'}
      </div>
    </section>
  );
}
