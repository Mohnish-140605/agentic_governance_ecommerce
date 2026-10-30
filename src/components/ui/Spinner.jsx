import React from 'react';

const spinnerSizes = {
  xs: { width: '16px', height: '16px', borderWidth: '2px' },
  sm: { width: '20px', height: '20px', borderWidth: '2px' },
  md: { width: '24px', height: '24px', borderWidth: '2.5px' },
  lg: { width: '32px', height: '32px', borderWidth: '3px' },
  xl: { width: '48px', height: '48px', borderWidth: '4px' }
};

export default function Spinner({
  size = 'md',
  color = 'var(--forest-green)',
  className = '',
  style = {}
}) {
  const sizeStyle = spinnerSizes[size] || spinnerSizes.md;

  return (
    <div
      className={className}
      style={{
        display: 'inline-block',
        width: sizeStyle.width,
        height: sizeStyle.height,
        borderRadius: '50%',
        border: `${sizeStyle.borderWidth} solid var(--border-cream)`,
        borderTopColor: color,
        animation: 'spin 0.8s linear infinite',
        ...style
      }}
    />
  );
}

export function PageSpinner({ message = 'Loading...' }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-cream)',
        zIndex: 9999
      }}
    >
      <Spinner size="xl" />
      <p style={{ marginTop: '16px', color: 'var(--ink-secondary)', fontSize: '14px' }}>
        {message}
      </p>
    </div>
  );
}

export function InlineSpinner({ size = 'sm', text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Spinner size={size} />
      {text && <span style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>{text}</span>}
    </div>
  );
}
