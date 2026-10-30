import React from 'react';

const cardVariants = {
  default: {
    backgroundColor: 'var(--bg-card)',
    border: '1.5px solid var(--border-cream)',
    boxShadow: '0 4px 20px -2px rgba(27, 27, 24, 0.08), 0 2px 8px -1px rgba(27, 27, 24, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.5)',
    borderRadius: 'var(--radius-card)'
  },
  elevated: {
    backgroundColor: 'var(--bg-card)',
    border: '1.5px solid var(--border-cream)',
    boxShadow: '0 12px 48px -4px rgba(27, 27, 24, 0.12), 0 4px 12px -2px rgba(27, 27, 24, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.5)',
    borderRadius: 'var(--radius-card)'
  },
  subtle: {
    backgroundColor: 'var(--bg-card-subtle)',
    border: '1px solid var(--border-cream-subtle)',
    boxShadow: '0 2px 12px -2px rgba(27, 27, 24, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.3)',
    borderRadius: 'var(--radius-inner)'
  },
  flat: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-cream)',
    boxShadow: 'none',
    borderRadius: 'var(--radius-inner)'
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 8px 32px rgba(27, 27, 24, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.3)',
    borderRadius: 'var(--radius-card)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)'
  }
};

export default function Card({
  children,
  variant = 'default',
  hoverable = false,
  padding = '28px',
  className = '',
  style = {},
  ...props
}) {
  const variantStyle = cardVariants[variant] || cardVariants.default;

  return (
    <div
      className={`${hoverable ? 'cairn-card-hover' : ''} ${className}`}
      style={{
        backgroundColor: variantStyle.backgroundColor,
        border: variantStyle.border,
        borderRadius: variantStyle.borderRadius,
        boxShadow: variantStyle.boxShadow,
        backdropFilter: variantStyle.backdropFilter,
        WebkitBackdropFilter: variantStyle.WebkitBackdropFilter,
        padding,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, style = {} }) {
  return (
    <div style={{ marginBottom: '16px', ...style }}>
      {children}
    </div>
  );
}

export function CardBody({ children, style = {} }) {
  return (
    <div style={{ ...style }}>
      {children}
    </div>
  );
}

export function CardFooter({ children, style = {} }) {
  return (
    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-cream-subtle)', ...style }}>
      {children}
    </div>
  );
}
