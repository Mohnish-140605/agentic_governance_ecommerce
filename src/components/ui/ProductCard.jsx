import React from 'react';
import { ShoppingBag, CheckCircle2, Star } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';

export default function ProductCard({
  product,
  onQuickOrder,
  variant = 'default',
  className = '',
  style = {}
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Card
      variant={variant}
      hoverable
      padding="20px"
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: hovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)',
        ...style
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        {/* Product Image with Tag */}
        <div
          style={{
            position: 'relative',
            height: '260px',
            borderRadius: '20px',
            overflow: 'hidden',
            marginBottom: '18px',
            backgroundColor: '#F5EFE6',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: hovered ? 'scale(1.08)' : 'scale(1)'
            }}
          />
          {/* Gradient overlay on hover */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 50%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }} />
          {/* Top Tag */}
          {product.tag && (
            <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
              <Badge
                variant={product.tagType || 'neutral'}
                size="sm"
                icon={product.tagType === 'placed' ? CheckCircle2 : null}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                {product.tag}
              </Badge>
            </div>
          )}
          {/* Corner Badge */}
          {product.badge && (
            <div
              style={{
                position: 'absolute',
                bottom: '14px',
                right: '14px',
                backgroundColor: 'rgba(27, 27, 24, 0.9)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                padding: '6px 12px',
                borderRadius: '10px',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)'
              }}
            >
              {product.badge}
            </div>
          )}
          {/* Rating Badge */}
          {product.rating && (
            <div
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                color: 'var(--ink)',
                fontSize: '12px',
                fontWeight: 700,
                padding: '6px 10px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)'
              }}
            >
              <Star size={13} fill="#FFB800" color="#FFB800" />
              {product.rating}
            </div>
          )}
        </div>

        {/* Name & Price */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '21px',
              fontWeight: 700,
              color: 'var(--ink)',
              lineHeight: 1.2,
              transition: 'color 0.3s ease'
            }}
          >
            {product.name}
          </h3>
          <div style={{
            fontSize: '19px',
            fontWeight: 700,
            color: 'var(--forest-green)',
            transition: 'transform 0.3s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)'
          }}>
            ₹{product.price.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Specs */}
        <div style={{
          fontSize: '13.5px',
          color: 'var(--ink-secondary)',
          marginBottom: '14px',
          lineHeight: 1.5
        }}>
          {product.specs}
        </div>

        {/* Rationale Quote */}
        {product.rationale && (
          <div
            style={{
              backgroundColor: 'var(--bg-cream-subtle)',
              borderRadius: '14px',
              padding: '12px 16px',
              fontSize: '13px',
              color: 'var(--ink-secondary)',
              marginBottom: '24px',
              border: '1px solid var(--border-cream-subtle)',
              fontStyle: 'italic',
              lineHeight: 1.6,
              transition: 'all 0.3s ease',
              boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            {product.rationale}
          </div>
        )}
      </div>

      {/* Action */}
      <Button
        fullWidth
        size="md"
        icon={<ShoppingBag size={16} />}
        iconPosition="right"
        onClick={() => onQuickOrder(product)}
        style={{
          fontWeight: 600,
          letterSpacing: '-0.01em',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        Ask Aria to order
      </Button>
    </Card>
  );
}
