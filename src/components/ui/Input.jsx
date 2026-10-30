import React from 'react';
import { Search, MapPin, Mic, X } from 'lucide-react';

const inputVariants = {
  default: {
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--border-cream)',
    boxShadow: 'var(--shadow-warm-sm)'
  },
  focused: {
    border: '1.5px solid var(--forest-green)',
    boxShadow: '0 0 0 3px rgba(31, 77, 58, 0.1)'
  },
  error: {
    border: '1.5px solid var(--coral)',
    boxShadow: '0 0 0 3px rgba(255, 107, 91, 0.1)'
  }
};

const inputSizes = {
  sm: {
    padding: '8px 12px',
    fontSize: '13px',
    borderRadius: '10px'
  },
  md: {
    padding: '10px 14px',
    fontSize: '14px',
    borderRadius: '12px'
  },
  lg: {
    padding: '12px 16px',
    fontSize: '15px',
    borderRadius: '14px'
  },
  pill: {
    padding: '12px 16px',
    fontSize: '15px',
    borderRadius: 'var(--radius-pill)'
  }
};

export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  iconPosition = 'left',
  onClear,
  error = false,
  disabled = false,
  size = 'md',
  fullWidth = false,
  className = '',
  style = {},
  ...props
}) {
  const [focused, setFocused] = React.useState(false);
  const sizeStyle = inputSizes[size] || inputSizes.md;
  const variantStyle = error ? inputVariants.error : focused ? inputVariants.focused : inputVariants.default;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: fullWidth ? '100%' : 'auto',
        ...style
      }}
    >
      {icon && iconPosition === 'left' && (
        <div style={{
          position: 'absolute',
          left: size === 'pill' ? '20px' : '14px',
          color: focused ? 'var(--forest-green)' : 'var(--ink-muted)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center'
        }}>
          {icon}
        </div>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          backgroundColor: variantStyle.backgroundColor,
          border: variantStyle.border,
          borderRadius: sizeStyle.borderRadius,
          padding: sizeStyle.padding,
          paddingLeft: icon && iconPosition === 'left' 
            ? size === 'pill' ? '48px' : '40px' 
            : sizeStyle.padding,
          paddingRight: (icon && iconPosition === 'right') || onClear
            ? size === 'pill' ? '48px' : '40px'
            : sizeStyle.padding,
          fontSize: sizeStyle.fontSize,
          color: 'var(--ink)',
          outline: 'none',
          boxShadow: variantStyle.boxShadow,
          transition: 'all 0.2s ease',
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'text'
        }}
        {...props}
      />

      {icon && iconPosition === 'right' && (
        <div style={{
          position: 'absolute',
          right: size === 'pill' ? '20px' : '14px',
          color: focused ? 'var(--forest-green)' : 'var(--ink-muted)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center'
        }}>
          {icon}
        </div>
      )}

      {onClear && value && (
        <button
          onClick={() => onChange({ target: { value: '' } })}
          style={{
            position: 'absolute',
            right: size === 'pill' ? '20px' : '14px',
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            color: 'var(--ink-muted)',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-cream-subtle)';
            e.currentTarget.style.color = 'var(--ink)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--ink-muted)';
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function SearchInput({ placeholder = 'Search...', ...props }) {
  return (
    <Input
      icon={<Search size={16} />}
      placeholder={placeholder}
      {...props}
    />
  );
}

export function LocationInput({ placeholder = 'Select location...', ...props }) {
  return (
    <Input
      icon={<MapPin size={16} />}
      placeholder={placeholder}
      {...props}
    />
  );
}

export function VoiceInput({ placeholder = 'What do you need?', ...props }) {
  return (
    <Input
      icon={<Mic size={18} />}
      placeholder={placeholder}
      {...props}
    />
  );
}
