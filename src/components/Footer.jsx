import React from 'react';
import CairnLogo from './CairnLogo';
import { ShieldCheck, Store, ArrowLeft, BookOpen } from 'lucide-react';

export default function Footer({ 
  onNavigateToScreen, 
  dashboardMode = 'customer',
  setDashboardMode 
}) {
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
          <CairnLogo 
            size="small" 
            onClick={() => onNavigateToScreen(dashboardMode === 'customer' ? 'explore' : 'seller_hub')} 
          />
          <span style={{ color: 'var(--ink-muted)' }}>·</span>
          <span>
            {dashboardMode === 'customer' ? 'mindful shopping with Aria' : 'maker integrity & escrow platform'}
          </span>
        </div>

        {/* Center: Reassurance disclaimer */}
        <div style={{ fontSize: '12.5px', color: 'var(--ink-muted)', textAlign: 'center' }}>
          Protected by deterministic human-first limits · Tamper-evident receipts · Zero dark patterns
        </div>

        {/* Right: Role-specific contextual links */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {dashboardMode === 'customer' ? (
            <>
              <button
                onClick={() => onNavigateToScreen('how_aria_works')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '12.5px',
                  color: 'var(--ink-secondary)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none'
                }}
              >
                <BookOpen size={13} />
                <span>How Aria Works</span>
              </button>

              <button
                onClick={() => onNavigateToScreen('rules')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '12.5px',
                  color: 'var(--ink-secondary)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none'
                }}
              >
                <ShieldCheck size={13} />
                <span>My Safeguards</span>
              </button>

              <button
                onClick={() => {
                  if (setDashboardMode) setDashboardMode('seller');
                  onNavigateToScreen('seller_hub');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: 'var(--forest-green)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none'
                }}
              >
                <Store size={14} />
                <span>Artisan Studio (Sell) →</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigateToScreen('store_health')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: 'var(--forest-green)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none'
                }}
              >
                <ShieldCheck size={14} />
                <span>Store Health & Audit</span>
              </button>

              <button
                onClick={() => {
                  if (setDashboardMode) setDashboardMode('customer');
                  onNavigateToScreen('explore');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '12.5px',
                  color: 'var(--ink-secondary)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none'
                }}
              >
                <ArrowLeft size={13} />
                <span>Back to Customer Store</span>
              </button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
