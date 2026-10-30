import React from 'react';

const skeletonVariants = {
  default: {
    backgroundColor: 'var(--bg-cream-subtle)',
    borderRadius: '8px'
  },
  circle: {
    backgroundColor: 'var(--bg-cream-subtle)',
    borderRadius: '50%'
  },
  text: {
    backgroundColor: 'var(--bg-cream-subtle)',
    borderRadius: '4px'
  }
};

export default function Skeleton({
  variant = 'default',
  width,
  height,
  className = '',
  style = {},
  animate = true
}) {
  const variantStyle = skeletonVariants[variant] || skeletonVariants.default;

  return (
    <div
      className={`${animate ? 'skeleton-pulse' : ''} ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
        backgroundColor: variantStyle.backgroundColor,
        borderRadius: variantStyle.borderRadius,
        ...style
      }}
    />
  );
}

export function SkeletonCard({ className = '', style = {} }) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-cream)',
        borderRadius: 'var(--radius-card)',
        padding: '20px',
        ...style
      }}
    >
      <Skeleton variant="text" height="200px" style={{ marginBottom: '16px' }} />
      <Skeleton variant="text" width="70%" height="24px" style={{ marginBottom: '8px' }} />
      <Skeleton variant="text" width="40%" height="20px" style={{ marginBottom: '12px' }} />
      <Skeleton variant="text" width="100%" height="16px" style={{ marginBottom: '8px' }} />
      <Skeleton variant="text" width="80%" height="16px" />
    </div>
  );
}

export function SkeletonProductCard({ className = '', style = {} }) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-cream)',
        borderRadius: 'var(--radius-card)',
        padding: '20px',
        ...style
      }}
    >
      <Skeleton variant="text" height="240px" style={{ marginBottom: '16px', borderRadius: '18px' }} />
      <Skeleton variant="text" width="60%" height="24px" style={{ marginBottom: '8px' }} />
      <Skeleton variant="text" width="30%" height="20px" style={{ marginBottom: '12px' }} />
      <Skeleton variant="text" width="100%" height="16px" style={{ marginBottom: '8px' }} />
      <Skeleton variant="text" height="48px" style={{ borderRadius: '12px', marginTop: '20px' }} />
    </div>
  );
}
