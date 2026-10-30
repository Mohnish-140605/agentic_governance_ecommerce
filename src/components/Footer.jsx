import React from 'react';
import CairnLogo from './CairnLogo';
import { ShieldCheck, Store, ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from './ui';

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
              <Button
                variant="ghost"
                size="sm"
                icon={<BookOpen size={13} />}
                iconPosition="left"
                onClick={() => onNavigateToScreen('how_aria_works')}
              >
                How Aria Works
              </Button>

              <Button
                variant="ghost"
                size="sm"
                icon={<ShieldCheck size={13} />}
                iconPosition="left"
                onClick={() => onNavigateToScreen('rules')}
              >
                My Safeguards
              </Button>

              <Button
                variant="ghost"
                size="sm"
                icon={<Store size={14} />}
                iconPosition="left"
                onClick={() => {
                  if (setDashboardMode) setDashboardMode('seller');
                  onNavigateToScreen('seller_hub');
                }}
                style={{ color: 'var(--forest-green)', fontWeight: 600 }}
              >
                Artisan Studio (Sell) →
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                icon={<ShieldCheck size={14} />}
                iconPosition="left"
                onClick={() => onNavigateToScreen('store_health')}
                style={{ color: 'var(--forest-green)', fontWeight: 600 }}
              >
                Store Health & Audit
              </Button>

              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowLeft size={13} />}
                iconPosition="left"
                onClick={() => {
                  if (setDashboardMode) setDashboardMode('customer');
                  onNavigateToScreen('explore');
                }}
              >
                Back to Customer Store
              </Button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
