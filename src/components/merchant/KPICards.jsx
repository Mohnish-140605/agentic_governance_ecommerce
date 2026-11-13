import React from 'react';
import {
  Package,
  ShoppingCart,
  XCircle,
  DollarSign
} from 'lucide-react';

const KPI_CONFIG = [
  {
    id: 'products',
    label: 'Active Products',
    icon: Package,
    iconBg: 'var(--forest-green-light)',
    iconColor: 'var(--forest-green)',
    metric: 'activeProducts'
  },
  {
    id: 'orders',
    label: 'Recorded Orders',
    icon: ShoppingCart,
    iconBg: 'var(--butter-yellow-light)',
    iconColor: 'var(--butter-yellow-dark)',
    metric: 'recordedOrders'
  },
  {
    id: 'cancelled',
    label: 'Cancelled Orders',
    icon: XCircle,
    iconBg: 'var(--coral-light)',
    iconColor: 'var(--coral)',
    metric: 'cancelledOrders'
  },
  {
    id: 'revenue',
    label: 'Recorded Order Value',
    icon: DollarSign,
    iconBg: 'var(--forest-green-light)',
    iconColor: 'var(--forest-green)',
    metric: 'recordedOrderValue'
  }
];

export default function KPICards({ metrics = null, ordersUnavailable = false, listingsUnavailable = false }) {
  return (
    <div className="kpi-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {KPI_CONFIG.map((kpi) => {
        const Icon = kpi.icon;
        const value = metrics?.[kpi.metric];
        const isUnavailable = kpi.id === 'products' ? listingsUnavailable : ordersUnavailable;
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
              {kpi.id === 'revenue' && value != null
                ? `₹${Number(value).toLocaleString('en-IN')}`
                : value ?? '—'}
            </div>
            <div style={{
              fontSize: '11px',
              color: 'var(--ink-muted)',
              marginTop: '4px'
            }}>
              {isUnavailable
                ? 'Backend data unavailable'
                : kpi.id === 'revenue'
                  ? 'Placed or dispatched order prices; not settlement data'
                  : 'From backend records'}
            </div>
          </div>
        );
      })}
    </div>
  );
}
