import React from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Timer
} from 'lucide-react';
import { Badge } from '../ui';

const SLA_STATS = [
  {
    id: 'on_time',
    label: 'On-Time Delivery',
    value: '94.2%',
    status: 'good',
    icon: CheckCircle,
    color: '#166534',
    bgColor: '#EAF7EE'
  },
  {
    id: 'pending',
    label: 'Pending SLA',
    value: 5,
    status: 'warning',
    icon: Clock,
    color: '#B45309',
    bgColor: '#FEF3C7'
  },
  {
    id: 'breached',
    label: 'SLA Breaches',
    value: 2,
    status: 'critical',
    icon: XCircle,
    color: '#B91C1C',
    bgColor: '#FEE2E2'
  },
  {
    id: 'avg_time',
    label: 'Avg. Fulfillment',
    value: '18h',
    status: 'good',
    icon: Timer,
    color: '#166534',
    bgColor: '#EAF7EE'
  }
];

const SLA_ALERTS = [
  {
    id: 'sla-001',
    orderId: 'CRN-88421',
    product: 'Dell XPS 13 Plus',
    deadline: '2 hours remaining',
    status: 'warning',
    message: 'Approaching acknowledgement deadline'
  },
  {
    id: 'sla-002',
    orderId: 'CRN-9842',
    product: 'Framework Laptop 13',
    deadline: 'Overdue by 1 hour',
    status: 'critical',
    message: 'Fulfillment SLA breached'
  },
  {
    id: 'sla-003',
    orderId: 'CRN-8721',
    product: 'Kinto Slow Coffee Brewer',
    deadline: '6 hours remaining',
    status: 'good',
    message: 'On track for delivery'
  }
];

export default function SLAOverview({ stats = null, alerts = null, onViewAll }) {
  const displayStats = stats || SLA_STATS;
  const displayAlerts = alerts || SLA_ALERTS;

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
            <Clock size={18} color="var(--forest-green)" />
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--forest-green)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              SLA Management
            </span>
          </div>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--ink)',
            marginBottom: '4px'
          }}>
            Service Level Overview
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
            Order fulfillment and delivery compliance
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
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

      {/* Active Alerts */}
      <div>
        <div style={{
          fontSize: '12px',
          fontWeight: 700,
          color: 'var(--ink-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '12px'
        }}>
          Active SLA Alerts
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {displayAlerts.map((alert) => (
            <div
              key={alert.id}
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
                backgroundColor: alert.status === 'critical' ? '#FEE2E2' : 
                  alert.status === 'warning' ? '#FEF3C7' : '#EAF7EE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {alert.status === 'critical' ? (
                  <XCircle size={16} color="#B91C1C" />
                ) : alert.status === 'warning' ? (
                  <AlertTriangle size={16} color="#B45309" />
                ) : (
                  <CheckCircle size={16} color="#166534" />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  marginBottom: '2px'
                }}>
                  {alert.product}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--ink-muted)'
                }}>
                  {alert.orderId} · {alert.message}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: alert.status === 'critical' ? '#B91C1C' : 
                    alert.status === 'warning' ? '#B45309' : '#166534',
                  marginBottom: '2px'
                }}>
                  {alert.deadline}
                </div>
                <Badge 
                  variant={alert.status === 'critical' ? 'failed' : 
                    alert.status === 'warning' ? 'review' : 'placed'} 
                  size="sm"
                >
                  {alert.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
