import React from 'react';
import { AlertCircle, CheckCircle, Clock, ShieldCheck, XCircle } from 'lucide-react';
import { Badge } from '../ui';

const STAT_PRESENTATION = {
  evaluated: { icon: ShieldCheck, color: '#1F4D3A', background: '#EAF4EE' },
  approved: { icon: CheckCircle, color: '#166534', background: '#EAF7EE' },
  pending: { icon: Clock, color: '#B45309', background: '#FEF3C7' },
  blocked: { icon: XCircle, color: '#B91C1C', background: '#FEE2E2' }
};

const DECISION_PRESENTATION = {
  approved: { label: 'Auto-executed', variant: 'placed', icon: CheckCircle },
  pending: { label: 'Needs approval', variant: 'review', icon: Clock },
  blocked: { label: 'Blocked', variant: 'failed', icon: AlertCircle }
};

export default function GovernanceOverview({ stats = [], decisions = [] }) {
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
          <ShieldCheck size={18} />
          Deterministic governance
        </div>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--ink)',
          marginBottom: '4px'
        }}>
          Proposal decisions
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
          Evaluations and recent outcomes from the audit ledger
        </p>
      </header>

      {stats.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(125px, 1fr))',
          gap: '10px',
          marginBottom: '22px'
        }}>
          {stats.map((stat) => {
            const presentation = STAT_PRESENTATION[stat.id] || STAT_PRESENTATION.evaluated;
            const Icon = presentation.icon;
            return (
              <div key={stat.id} style={{
                padding: '13px',
                borderRadius: '11px',
                background: presentation.background,
                border: '1px solid var(--border-cream-subtle)'
              }}>
                <Icon size={17} color={presentation.color} style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)' }}>
                  {Number(stat.value).toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{stat.label}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          padding: '20px 12px',
          marginBottom: '18px',
          textAlign: 'center',
          color: 'var(--ink-muted)',
          fontSize: '13px',
          background: 'var(--bg-cream-subtle)',
          borderRadius: '10px'
        }}>
          Governance summary is unavailable.
        </div>
      )}

      <div style={{
        marginBottom: '10px',
        color: 'var(--ink-muted)',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase'
      }}>
        Recent audited decisions
      </div>
      {decisions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {decisions.map((decision) => {
            const presentation = DECISION_PRESENTATION[decision.status] || DECISION_PRESENTATION.blocked;
            const Icon = presentation.icon;
            return (
              <div key={decision.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '11px',
                borderRadius: '10px',
                background: 'var(--bg-cream-subtle)',
                border: '1px solid var(--border-cream-subtle)'
              }}>
                <Icon size={16} color={decision.status === 'approved' ? '#166534' : decision.status === 'pending' ? '#B45309' : '#B91C1C'} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', fontWeight: 650, color: 'var(--ink)' }}>
                      {decision.action}
                    </span>
                    <Badge variant={presentation.variant} size="sm">{presentation.label}</Badge>
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '11px', lineHeight: 1.4, color: 'var(--ink-secondary)' }}>
                    {decision.details}
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '10px', color: 'var(--ink-muted)' }}>
                    {decision.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: '14px 0', color: 'var(--ink-muted)', fontSize: '12px' }}>
          No recent audited decisions are available.
        </div>
      )}
    </section>
  );
}
