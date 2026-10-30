import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function AskAriaFab({ onOpenChat, activeScreen }) {
  if (activeScreen === 'chat' || activeScreen === 'explore') return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 'clamp(16px, 3vw, 28px)',
      right: 'clamp(16px, 3vw, 28px)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center'
    }}>
      <button
        onClick={onOpenChat}
        className="ask-aria-pinned-btn"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'var(--forest-green)',
          color: '#FFFFFF',
          padding: 'clamp(10px, 2.5vw, 14px) clamp(16px, 3.5vw, 24px)',
          borderRadius: 'var(--radius-pill)',
          boxShadow: 'var(--shadow-warm-float)',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          fontSize: '15px',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 24px 48px -6px rgba(31, 77, 58, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = 'var(--shadow-warm-float)';
        }}
      >
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#34D399',
          boxShadow: '0 0 8px #34D399'
        }} />
        <span>Ask Aria</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
