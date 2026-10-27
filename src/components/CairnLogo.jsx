import React from 'react';

export default function CairnLogo({ size = 'default', showWordmark = true, onClick }) {
  const isLarge = size === 'large';
  
  return (
    <div 
      className="cairn-logo-wrapper"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isLarge ? '14px' : '10px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      {/* Zen Stone Cairn Icon */}
      <svg 
        width={isLarge ? 36 : 26} 
        height={isLarge ? 36 : 26} 
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Bottom smooth base stone */}
        <ellipse cx="32" cy="50" rx="24" ry="9.5" fill="#1F4D3A" />
        {/* Middle balanced pebble */}
        <ellipse cx="33" cy="35" rx="17" ry="7.8" fill="#2E6B52" />
        {/* Upper balanced stone */}
        <ellipse cx="31" cy="22" rx="11" ry="6.2" fill="#4B8C70" />
        {/* Summit golden touch pebble */}
        <ellipse cx="32" cy="11" rx="5.5" ry="3.8" fill="#D97706" />
      </svg>

      {showWordmark && (
        <span 
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: isLarge ? '26px' : '21px',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
            lineHeight: 1
          }}
        >
          cairn
        </span>
      )}
    </div>
  );
}
