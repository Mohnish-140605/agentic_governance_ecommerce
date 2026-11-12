import React from 'react';
import {
  Package,
  ShoppingCart,
  XCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

const KPI_CONFIG = [
  {
    id: 'products',
    label: 'Active Products',
    icon: Package,
    iconBg: 'var(--forest-green-light)',
    iconColor: 'var(--forest-green)',
    value: '48',
    change: '+12',
    changeType: 'up',
    subtitle: 'vs last month'
  },
  {
    id: 'orders',
    label: 'Completed Orders',
    icon: ShoppingCart,
    iconBg: 'var(--butter-yellow-light)',
    iconColor: 'var(--butter-yellow-dark)',
    value: '156',
    change: '+8.3%',
    changeType: 'up',
    subtitle: 'This month'
  },
  {
    id: 'cancelled',
    label: 'Cancelled Orders',
    icon: XCircle,
    iconBg: 'var(--coral-light)',
    iconColor: 'var(--coral)',
    value: '3',
    change: '-1.2%',
    changeType: 'down',
    subtitle: 'vs last month'
  },
  {
    id: 'revenue',
    label: 'Total Revenue',
    icon: DollarSign,
    iconBg: 'var(--forest-green-light)',
    iconColor: 'var(--forest-green)',
    value: '₹4,82,500',
    change: '+12.5%',
    changeType: 'up',
    subtitle: 'vs last month'
  }
];

function TrendIcon({ type }) {
  if (type === 'up') return <ArrowUpRight size={14} color="#166534" />;
  if (type === 'down') return <ArrowDownRight size={14} color="#B91C1C" />;
  return <Minus size={14} color="var(--ink-muted)" />;
}

export default function KPICards({ metrics = null }) {
  // Use real metrics if provided, otherwise use demo data
  const kpis = metrics ? [
    {
      ...KPI_CONFIG[0],
      value: metrics.activeProducts?.toString() || KPI_CONFIG[0].value,
      change: metrics.productsChange || KPI_CONFIG[0].change
    },
    {
      ...KPI_CONFIG[1],
      value: metrics.completedOrders?.toString() || KPI_CONFIG[1].value,
      change: metrics.ordersChange || KPI_CONFIG[1].change
    },
    {
      ...KPI_CONFIG[2],
      value: metrics.cancelledOrders?.toString() || KPI_CONFIG[2].value,
      change: metrics.cancelledChange || KPI_CONFIG[2].change
    },
    {
      ...KPI_CONFIG[3],
      value: metrics.revenue ? `₹${metrics.revenue.toLocaleString('en-IN')}` : KPI_CONFIG[3].value,
      change: metrics.revenueChange || KPI_CONFIG[3].change
    }
  ] : KPI_CONFIG;

  return (
    <div className="kpi-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-cream)',
              borderRadius: '16px',
              padding: '20px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: kpi.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={20} color={kpi.iconColor} />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 600,
                color: kpi.changeType === 'up' ? '#166534' : kpi.changeType === 'down' ? '#B91C1C' : 'var(--ink-muted)'
              }}>
                <TrendIcon type={kpi.changeType} />
                <span>{kpi.change}</span>
              </div>
            </div>
            <div style={{
              fontSize: '13px',
              color: 'var(--ink-muted)',
              marginBottom: '4px',
              fontWeight: 500
            }}>
              {kpi.label}
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--ink)',
              lineHeight: 1.2
            }}>
              {kpi.value}
            </div>
            <div style={{
              fontSize: '11px',
              color: 'var(--ink-muted)',
              marginTop: '4px'
            }}>
              {kpi.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
}
