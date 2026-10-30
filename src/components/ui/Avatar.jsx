import React from 'react';
import { User } from 'lucide-react';

const avatarSizes = {
  xs: { width: '24px', height: '24px', fontSize: '10px' },
  sm: { width: '32px', height: '32px', fontSize: '12px' },
  md: { width: '40px', height: '40px', fontSize: '14px' },
  lg: { width: '48px', height: '48px', fontSize: '16px' },
  xl: { width: '64px', height: '64px', fontSize: '20px' }
};

export default function Avatar({
  src,
  alt,
  name,
  size = 'md',
  variant = 'circle',
  className = '',
  style = {},
  onClick
}) {
  const sizeStyle = avatarSizes[size] || avatarSizes.md;
  const borderRadius = variant === 'circle' ? '50%' : variant === 'rounded' ? '12px' : '0';

  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        position: 'relative',
        width: sizeStyle.width,
        height: sizeStyle.height,
        borderRadius,
        backgroundColor: 'var(--bg-cream-subtle)',
        border: '1px solid var(--border-cream)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        flexShrink: 0,
        ...style
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: src ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: initials ? 'var(--forest-green)' : 'var(--bg-cream-subtle)',
          color: initials ? '#FFFFFF' : 'var(--ink-muted)'
        }}
      >
        {initials ? (
          <span style={{ fontSize: sizeStyle.fontSize, fontWeight: 600 }}>
            {initials}
          </span>
        ) : (
          <User size={size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'md' ? 16 : size === 'lg' ? 20 : 24} />
        )}
      </div>
    </div>
  );
}

export function AvatarGroup({ children, max = 3, size = 'md', className = '', style = {} }) {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        ...style
      }}
    >
      {visibleChildren.map((child, index) => (
        <div
          key={index}
          style={{
            marginLeft: index > 0 ? '-8px' : 0,
            border: '2px solid var(--bg-cream)',
            borderRadius: '50%'
          }}
        >
          {React.cloneElement(child, { size })}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          style={{
            marginLeft: '-8px',
            width: avatarSizes[size].width,
            height: avatarSizes[size].height,
            borderRadius: '50%',
            backgroundColor: 'var(--bg-cream-subtle)',
            border: '2px solid var(--bg-cream)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: avatarSizes[size].fontSize,
            fontWeight: 600,
            color: 'var(--ink-muted)'
          }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
