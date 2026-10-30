import React from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';

const buttonVariants = {
  primary: {
    backgroundColor: 'var(--forest-green)',
    color: '#FFFFFF',
    border: 'none',
    boxShadow: '0 4px 12px rgba(31, 77, 58, 0.25), 0 0 0 1px rgba(31, 77, 58, 0.1)',
    hoverBackgroundColor: 'var(--forest-green-hover)',
    hoverBoxShadow: '0 8px 24px rgba(31, 77, 58, 0.35), 0 0 0 2px rgba(31, 77, 58, 0.15)'
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    color: 'var(--ink)',
    border: '1.5px solid var(--border-cream)',
    boxShadow: '0 2px 8px rgba(27, 27, 24, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.5)',
    hoverBackgroundColor: 'var(--bg-cream-subtle)',
    hoverBorderColor: '#DDD4C5',
    hoverBoxShadow: '0 4px 16px rgba(27, 27, 24, 0.1), 0 0 0 2px rgba(255, 255, 255, 0.8)'
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--ink-secondary)',
    border: 'none',
    boxShadow: 'none',
    hoverBackgroundColor: 'rgba(27, 27, 24, 0.06)',
    hoverColor: 'var(--ink)'
  },
  danger: {
    backgroundColor: 'var(--coral)',
    color: '#FFFFFF',
    border: 'none',
    boxShadow: '0 4px 12px rgba(255, 107, 91, 0.25), 0 0 0 1px rgba(255, 107, 91, 0.1)',
    hoverBackgroundColor: 'var(--coral-dark)',
    hoverBoxShadow: '0 8px 24px rgba(255, 107, 91, 0.35), 0 0 0 2px rgba(255, 107, 91, 0.15)'
  },
  success: {
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    border: 'none',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.1)',
    hoverBackgroundColor: '#059669',
    hoverBoxShadow: '0 8px 24px rgba(16, 185, 129, 0.35), 0 0 0 2px rgba(16, 185, 129, 0.15)'
  }
};

const buttonSizes = {
  sm: {
    padding: '8px 16px',
    fontSize: '13px',
    gap: '6px'
  },
  md: {
    padding: '12px 24px',
    fontSize: '15px',
    gap: '8px'
  },
  lg: {
    padding: '16px 32px',
    fontSize: '16px',
    gap: '10px'
  }
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  style = {},
  ...props
}) {
  const variantStyle = buttonVariants[variant] || buttonVariants.primary;
  const sizeStyle = buttonSizes[size] || buttonSizes.md;

  return (
    <button
      disabled={disabled || loading}
      className={className}
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
        fontWeight: 500,
        letterSpacing: '-0.01em',
        boxShadow: variantStyle.boxShadow,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = variantStyle.hoverBackgroundColor;
          e.currentTarget.style.transform = 'translateY(-2px)';
          if (variantStyle.hoverBoxShadow) {
            e.currentTarget.style.boxShadow = variantStyle.hoverBoxShadow;
          }
          if (variantStyle.hoverBorderColor) {
            e.currentTarget.style.borderColor = variantStyle.hoverBorderColor;
          }
          if (variantStyle.hoverColor) {
            e.currentTarget.style.color = variantStyle.hoverColor;
          }
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = variantStyle.backgroundColor;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = variantStyle.boxShadow;
        if (variantStyle.border) {
          e.currentTarget.style.borderColor = variantStyle.border;
        }
        if (variantStyle.color) {
          e.currentTarget.style.color = variantStyle.color;
        }
      }}
      onMouseDown={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
        }
      }}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
}
