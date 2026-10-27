import React from 'react';
import CairnLogo from './CairnLogo';
import { ShieldCheck } from 'lucide-react';

export default function Footer({ onNavigateToScreen }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-cream)',
      backgroundColor: '#FAF5ED',
      padding: '24px 24px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '13px',
        color: 'var(--ink-secondary)'
      }}>
        {/* Left: Cairn wordmark & tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CairnLogo size="small" onClick={() => onNavigateToScreen('explore')} />
          <span style={{ color: 'var(--ink-muted)' }}>·</span>
          <span>mindful shopping with Aria</span>
        </div>

        {/* Center: Reassurance disclaimer */}
        <div style={{ fontSize: '12.5px', color: 'var(--ink-muted)', textAlign: 'center' }}>
          Protected by deterministic human-first limits · No real payments demo
        </div>

        {/* Right: Store Health link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => onNavigateToScreen('store_health')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--forest-green)',
              cursor: 'pointer'
            }}
          >
            <ShieldCheck size={14} />
            <span>Store Health & Audit</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
