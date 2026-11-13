import React, { useEffect, useState } from 'react';
import { Activity, AlertCircle, Clock, FileCheck, RefreshCw, ShieldCheck } from 'lucide-react';
import { fetchAuditLogs, fetchGovernanceSummary, fetchSLAMetrics } from '../services/api';

const SLA_CARDS = [
  { key: 'gov_p95_ms', label: 'Governance p95 latency', target: '≤ 500 ms', unit: ' ms' },
  { key: 'llm_p95_s', label: 'LLM p95 latency', target: '≤ 5 seconds', unit: ' s' },
  { key: 'validity_pct', label: 'Structured-output validity', target: '≥ 95%', unit: '%' },
  { key: 'enforcement_pct', label: 'Governance enforcement', target: '100%', unit: '%' },
  { key: 'audit_completeness_pct', label: 'Audit completeness', target: '100%', unit: '%' }
];

const formatTimestamp = (timestamp) => {
  const numericTimestamp = Number(timestamp);
  const date = new Date(Number.isNaN(numericTimestamp) ? timestamp : numericTimestamp * 1000);
  return Number.isNaN(date.getTime()) ? 'Time unavailable' : date.toLocaleString();
};

const decisionLabel = (decision) => {
  if (decision === 'AUTO_EXECUTE') return 'Auto-executed';
  if (decision === 'HUMAN_APPROVAL') return 'Needs approval';
  if (decision === 'BLOCK') return 'Blocked';
  return decision || 'Unknown';
};

const fetchStoreHealthData = async () => {
  const [metrics, summary, logs] = await Promise.all([
    fetchSLAMetrics(),
    fetchGovernanceSummary(),
    fetchAuditLogs(10)
  ]);
  return { metrics, summary, logs };
};

export default function Screen8_StoreHealth() {
  const [serverSla, setServerSla] = useState(null);
  const [govSummary, setGovSummary] = useState(null);
  const [auditLogs, setAuditLogs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(null);

  const loadData = async ({ manual = false } = {}) => {
    if (manual) {
      setIsRefreshing(true);
      setRefreshError(null);
    }
    try {
      const { metrics, summary, logs } = await fetchStoreHealthData();
      setServerSla(metrics);
      setGovSummary(summary);
      setAuditLogs(logs);
    } catch (error) {
      console.error('[Store health] Failed to load backend data:', error);
      setRefreshError('Unable to refresh telemetry. Try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetchStoreHealthData().then(({ metrics, summary, logs }) => {
      if (active) {
        setServerSla(metrics);
        setGovSummary(summary);
        setAuditLogs(logs);
      }
    }).catch((error) => {
      console.error('[Store health] Failed to load backend data:', error);
      if (active) setRefreshError('Unable to load telemetry.');
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => { active = false; };
  }, []);

  const backendAvailable = Boolean(serverSla || govSummary || Array.isArray(auditLogs));
  const summaryStats = [
    { key: 'total_proposals_evaluated', label: 'Evaluations' },
    { key: 'auto_executed_actions', label: 'Auto-executed' },
    { key: 'actions_requiring_approval', label: 'Needs approval' },
    { key: 'blocked_actions', label: 'Blocked' }
  ];

  return (
    <div className="store-health-screen-wrap animate-fade-in" style={{ minHeight: '100%', background: 'var(--bg-cream)', paddingBottom: '80px' }}>
      <main className="merchant-content" style={{ maxWidth: '1480px', margin: '0 auto' }}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              color: 'var(--forest-green)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              marginBottom: '7px'
            }}>
              <Activity size={15} />
              Merchant governance and telemetry
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 3vw, 32px)', marginBottom: '6px' }}>
              Store health &amp; audit
            </h1>
            <p style={{ maxWidth: '760px', fontSize: '14px' }}>
              Review backend-reported SLA measurements, deterministic governance outcomes, and recent audit records.
            </p>
          </div>
          <button
            type="button"
            onClick={() => loadData({ manual: true })}
            disabled={isRefreshing}
            className="pill-button-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '12px' }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refreshing…' : 'Refresh data'}
          </button>
        </header>

        {!backendAvailable && !isLoading && (
          <div role="status" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '18px',
            padding: '12px 14px',
            border: '1px solid var(--status-review-border)',
            borderRadius: '12px',
            background: 'var(--status-review-bg)',
            color: 'var(--status-review-text)',
            fontSize: '13px'
          }}>
            <AlertCircle size={16} />
            Backend telemetry is unavailable. Metrics and governance summaries are not being replaced with demo values.
          </div>
        )}
        {refreshError && (
          <div role="alert" style={{ marginBottom: '18px', color: '#B91C1C', fontSize: '13px' }}>
            {refreshError}
          </div>
        )}

        <section style={{
          padding: '22px',
          marginBottom: '20px',
          background: '#FFFFFF',
          border: '1px solid var(--border-cream)',
          borderRadius: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'var(--forest-green)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                <Clock size={15} />
                LLM_SLA targets
              </div>
              <h2 style={{ marginTop: '5px', fontSize: '18px' }}>Service-level measurements</h2>
            </div>
            <span style={{ alignSelf: 'center', color: 'var(--ink-muted)', fontSize: '11px' }}>
              {serverSla?.total_evaluations ?? '—'} recorded evaluations
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))',
            gap: '12px'
          }}>
            {SLA_CARDS.map((metric) => {
              const value = serverSla?.[metric.key];
              return (
                <div key={metric.key} style={{
                  padding: '15px',
                  background: 'var(--bg-cream-subtle)',
                  border: '1px solid var(--border-cream-subtle)',
                  borderRadius: '12px'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-muted)' }}>{metric.label}</div>
                  <div style={{ marginTop: '7px', fontSize: '22px', fontWeight: 700, color: 'var(--ink)' }}>
                    {value == null ? '—' : `${value}${metric.unit}`}
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '10px', color: 'var(--ink-muted)' }}>{metric.target}</div>
                </div>
              );
            })}
          </div>
          {serverSla?.status && (
            <div style={{ marginTop: '14px', color: 'var(--ink-secondary)', fontSize: '12px' }}>
              Backend status: <strong>{serverSla.status.replace(/_/g, ' ').toLowerCase()}</strong>
            </div>
          )}
        </section>

        <section style={{
          padding: '22px',
          marginBottom: '20px',
          background: '#FFFFFF',
          border: '1px solid var(--border-cream)',
          borderRadius: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <ShieldCheck size={17} color="var(--forest-green)" />
            <div>
              <h2 style={{ fontSize: '18px' }}>Governance evaluation summary</h2>
              <p style={{ marginTop: '3px', fontSize: '12px', color: 'var(--ink-muted)' }}>
                Counts aggregated from the backend audit ledger
              </p>
            </div>
          </div>
          {govSummary ? (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))',
                gap: '12px'
              }}>
                {summaryStats.map((stat) => (
                  <div key={stat.key} style={{ padding: '15px', background: 'var(--bg-cream-subtle)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{stat.label}</div>
                    <div style={{ marginTop: '5px', fontSize: '22px', fontWeight: 700, color: 'var(--ink)' }}>
                      {Number(govSummary[stat.key] ?? 0).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', marginTop: '15px', fontSize: '12px', color: 'var(--ink-secondary)' }}>
                <span>Unauthorized actions prevented: <strong>{govSummary.unauthorized_actions_prevented ?? '—'}</strong></span>
                <span>Policy violations detected: <strong>{govSummary.policy_violations_detected ?? '—'}</strong></span>
                <span>Average risk score: <strong>{govSummary.average_risk_score ?? '—'}</strong></span>
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--ink-muted)', fontSize: '13px' }}>
              {isLoading ? 'Loading governance summary…' : 'No governance summary was returned by the backend.'}
            </p>
          )}
        </section>

        <section style={{
          padding: '22px',
          background: '#FFFFFF',
          border: '1px solid var(--border-cream)',
          borderRadius: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <FileCheck size={17} color="var(--forest-green)" />
            <div>
              <h2 style={{ fontSize: '18px' }}>Recent audit records</h2>
              <p style={{ marginTop: '3px', fontSize: '12px', color: 'var(--ink-muted)' }}>
                Decisions recorded by the Governance Engine
              </p>
            </div>
          </div>
          {Array.isArray(auditLogs) && auditLogs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {auditLogs.map((log) => (
                <article key={log.id || log.proposal_id} style={{
                  padding: '13px',
                  background: 'var(--bg-cream-subtle)',
                  border: '1px solid var(--border-cream-subtle)',
                  borderRadius: '11px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '12px', fontWeight: 650, color: 'var(--ink)' }}>
                      {(log.action_type || 'Action').replace(/_/g, ' ')} · {log.proposal_id || `Audit ${log.id}`}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: log.decision === 'BLOCK' ? '#B91C1C' : log.decision === 'HUMAN_APPROVAL' ? '#B45309' : '#166534' }}>
                      {decisionLabel(log.decision)}
                    </span>
                  </div>
                  <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--ink-secondary)' }}>
                    {log.reason_code || 'No reason code provided'}
                    {log.requested_price != null && ` · ₹${Number(log.requested_price).toLocaleString('en-IN')}`}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginTop: '6px', fontSize: '10px', color: 'var(--ink-muted)' }}>
                    <span>{formatTimestamp(log.timestamp)}</span>
                    <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                      SHA-256: {log.sha256_hash || 'Unavailable'}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--ink-muted)', fontSize: '13px' }}>
              {isLoading
                ? 'Loading audit records…'
                : Array.isArray(auditLogs)
                  ? 'No audit records were returned.'
                  : 'Audit records are unavailable from the backend.'}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
