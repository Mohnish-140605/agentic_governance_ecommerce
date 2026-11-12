import React from 'react';
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../ui';

const GOVERNANCE_STATS = [
  {
    id: 'approved',
    label: 'Approved Actions',
    value: 24,
    icon: CheckCircle,
    color: '#166534',
    bgColor: '#EAF7EE'
  },
  {
    id: 'pending',
    label: 'Awaiting Approval',
    value: 3,
    icon: Clock,
    color: '#B45309',
    bgColor: '#FEF3C7'
  },
  {
    id: 'blocked',
    label: 'Blocked Actions',
    value: 1,
    icon: XCircle,
    color: '#B91C1C',
    bgColor: '#FEE2E2'
  },
  {
    id: 'compliance',
    label: 'Compliance Rate',
    value: '98.5%',
    icon: ShieldCheck,
    color: '#166534',
    bgColor: '#EAF7EE'
  }
];

const RECENT_DECISIONS = [
  {
    id: 'GOV-001',
    action: 'Inventory update approved',
    status: 'approved',
    timestamp: '2 hours ago',
    details: 'Price adjustment within allowed range'
  },
  {
    id: 'GOV-002',
    action: 'New listing submission',
    status: 'pending',
    timestamp: '5 hours ago',
    details: 'Awaiting origin verification'
  },
  {
    id: 'GOV-003',
    action: 'Bulk price change',
    status: 'blocked',
    timestamp: '1 day ago',
    details: 'Exceeded price variance threshold'
  }
];

export default function GovernanceOverview({ stats = null, decisions = null, onViewAll }) {
  const displayStats = stats || GOVERNANCE_STATS;
  const displayDecisions = decisions || RECENT_DECISIONS;

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--border-cream)',
      borderRadius: '16px',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <ShieldCheck size={18} color="var(--forest-green)" />
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--forest-green)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Shared Governance Engine
            </span>
          </div>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--ink)',
            marginBottom: '4px'
          }}>
            Governance Overview
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
            Real-time compliance monitoring
          </p>
        </div>
        <button
          onClick={onViewAll}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            backgroundColor: 'transparent',
            border: '1px solid var(--border-cream)',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--forest-green)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          View all
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {displayStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              style={{
                padding: '16px',
                backgroundColor: stat.bgColor,
                borderRadius: '12px',
                border: '1px solid var(--border-cream-subtle)'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px'
              }}>
                <Icon size={16} color={stat.color} />
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--ink)',
                marginBottom: '2px'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--ink-muted)',
                fontWeight: 500
              }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Decisions */}
      <div>
        <div style={{
          fontSize: '12px',
          fontWeight: 700,
          color: 'var(--ink-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '12px'
        }}>
          Recent Decisions
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {displayDecisions.map((decision) => (
            <div
              key={decision.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: 'var(--bg-cream-subtle)',
                borderRadius: '10px',
                border: '1px solid var(--border-cream-subtle)'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: decision.status === 'approved' ? '#EAF7EE' : 
                  decision.status === 'pending' ? '#FEF3C7' : '#FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {decision.status === 'approved' ? (
                  <CheckCircle size={16} color="#166534" />
                ) : decision.status === 'pending' ? (
                  <Clock size={16} color="#B45309" />
                ) : (
                  <XCircle size={16} color="#B91C1C" />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  marginBottom: '2px'
                }}>
                  {decision.action}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--ink-muted)'
                }}>
                  {decision.details} · {decision.timestamp}
                </div>
              </div>
              <Badge 
                variant={decision.status === 'approved' ? 'placed' : 
                  decision.status === 'pending' ? 'review' : 'failed'} 
                size="sm"
              >
                {decision.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
