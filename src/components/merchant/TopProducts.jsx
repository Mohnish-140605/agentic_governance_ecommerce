import React from 'react';
import {
  TrendingUp,
  Package,
  ArrowRight
} from 'lucide-react';

const TOP_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Kinto Slow Coffee Brewer',
    sku: 'SKU-7729',
    sales: 45,
    revenue: 155250,
    image: '/assets/kinto_coffee.jpg',
    trend: 'up'
  },
  {
    id: 'prod-2',
    name: 'Framework Laptop 13',
    sku: 'SKU-8190',
    sales: 32,
    revenue: 3039680,
    image: '/assets/framework_laptop.jpg',
    trend: 'up'
  },
  {
    id: 'prod-3',
    name: 'Tekla Percale Bedding',
    sku: 'SKU-9912',
    sales: 28,
    revenue: 313600,
    image: '/assets/tekla_bedding.jpg',
    trend: 'stable'
  },
  {
    id: 'prod-4',
    name: 'Minimal Ceramic Mug',
    sku: 'SKU-7730',
    sales: 24,
    revenue: 43200,
    image: '/assets/kinto_coffee.jpg',
    trend: 'up'
  },
  {
    id: 'prod-5',
    name: 'Walnut Monitor Shelf',
    sku: 'SKU-8191',
    sales: 18,
    revenue: 261000,
    image: '/assets/framework_laptop.jpg',
    trend: 'down'
  }
];

export default function TopProducts({ products = null, onViewAll }) {
  const displayProducts = products || TOP_PRODUCTS;

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
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--ink)',
            marginBottom: '4px'
          }}>
            Top Performing Products
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
            Best sellers this month
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

      {/* Products List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {displayProducts.map((product, index) => (
          <div
            key={product.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: 'var(--bg-cream-subtle)',
              borderRadius: '10px',
              border: '1px solid var(--border-cream-subtle)',
              transition: 'all 0.15s ease'
            }}
          >
            {/* Rank */}
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: index < 3 ? 'var(--forest-green)' : 'var(--bg-cream-subtle)',
              color: index < 3 ? '#FFFFFF' : 'var(--ink-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              flexShrink: 0
            }}>
              {index + 1}
            </div>

            {/* Product Image */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-cream)',
              flexShrink: 0
            }}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--forest-green-light);color:var(--forest-green);font-size:18px;font-weight:700;">' + product.name.charAt(0) + '</div>';
                }}
              />
            </div>

            {/* Product Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--ink)',
                marginBottom: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {product.name}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--ink-muted)',
                fontFamily: 'monospace'
              }}>
                {product.sku}
              </div>
            </div>

            {/* Stats */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--ink)',
                marginBottom: '2px'
              }}>
                {product.sales} sales
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--ink-muted)'
              }}>
                ₹{product.revenue.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Trend */}
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              backgroundColor: product.trend === 'up' ? '#EAF7EE' : product.trend === 'down' ? '#FEE2E2' : 'var(--bg-cream-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <TrendingUp
                size={14}
                color={product.trend === 'up' ? '#166534' : product.trend === 'down' ? '#B91C1C' : 'var(--ink-muted)'}
                style={{
                  transform: product.trend === 'down' ? 'rotate(180deg)' : 'none'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
