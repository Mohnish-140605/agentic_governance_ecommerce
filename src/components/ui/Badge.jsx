import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, Clock, ShieldCheck } from 'lucide-react';

const badgeVariants = {
  placed: {
    backgroundColor: 'var(--status-placed-bg)',
    color: 'var(--status-placed-text)',
    border: '1px solid var(--status-placed-border)',
    icon: CheckCircle2
  },
  review: {
    backgroundColor: 'var(--status-review-bg)',
    color: 'var(--status-review-text)',
    border: '1px solid var(--status-review-border)',
    icon: Clock
  },
  failed: {
    backgroundColor: 'var(--status-failed-bg)',
    color: 'var(--status-failed-text)',
    border: '1px solid var(--status-failed-border)',
    icon: XCircle
  },
  neutral: {
    backgroundColor: '#F4EFE6',
    color: 'var(--ink-secondary)',
    border: '1px solid var(--border-cream)',
    icon: undefined
  },
  success: {
    backgroundColor: '#EAF7EE',
    color: '#166534',
    border: '1px solid #A7E4BA',
    icon: ShieldCheck
  },
  warning: {
    backgroundColor: '#FEF3C7',
    color: '#B45309',
    border: '1px solid #FCD34D',
    icon: AlertCircle
  }
};

const badgeSizes = {
  sm: {
    padding: '3px 10px',
    fontSize: '11px',
    gap: '4px'
  },
  md: {
    padding: '4px 12px',
    fontSize: '12px',
    gap: '6px'
  },
  lg: {
    padding: '6px 14px',
    fontSize: '13px',
    gap: '6px'
  }
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  icon = undefined,
  pulse = false,
  className = '',
  style = {}
}) {
  const variantStyle = badgeVariants[variant] || badgeVariants.neutral;
  const sizeStyle = badgeSizes[size] || badgeSizes.md;
  const Icon = icon || variantStyle.icon;

  return (
    <span
      className={`${pulse ? 'pulse-badge' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sizeStyle.gap,
        backgroundColor: variantStyle.backgroundColor,
        color: variantStyle.color,
        border: variantStyle.border,
        borderRadius: 'var(--radius-pill)',
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        fontWeight: 600,
        letterSpacing: '0.02em',
        ...style
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 12 : size === 'md' ? 13 : 14} />}
      {children}
    </span>
  );
}
