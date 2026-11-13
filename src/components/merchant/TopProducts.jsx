import React from 'react';
import { ArrowRight, Package } from 'lucide-react';

export default function TopProducts({ products = [], isAvailable = true, onViewAll }) {
  return (
    <div style={{
      minWidth: 0,
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--border-cream)',
      borderRadius: '16px',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        minWidth: 0,
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
            Merchant catalog
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
            Current listings and stock
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
          Add listing
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Products List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {products.length > 0 ? products.map((product, index) => (
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
              backgroundColor: index < 3 ? 'var(--forest-green)' : '#FFFFFF',
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
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                    event.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
              )}
              <div style={{
                display: product.image ? 'none' : 'flex',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--forest-green-light)',
                color: 'var(--forest-green)'
              }}>
                <Package size={20} />
              </div>
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
                {product.stock} in stock
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--ink-muted)'
              }}>
                ₹{product.price.toLocaleString('en-IN')}
              </div>
            </div>

          </div>
        )) : (
          <div style={{ padding: '22px 12px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '13px' }}>
            {isAvailable
              ? 'No listings are recorded in the merchant catalog yet.'
              : 'Listing data is unavailable from the backend.'}
          </div>
        )}
      </div>
    </div>
  );
}
