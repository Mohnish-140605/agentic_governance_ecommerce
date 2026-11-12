import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  ChevronDown,
  Search,
  Menu
} from 'lucide-react';

export default function MerchantHeader({
  merchantName = 'Studio Hasami',
  merchantAvatar = null,
  onMenuClick,
  onProfileClick,
  notifications = 3
}) {
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [showDateMenu, setShowDateMenu] = useState(false);

  const dateOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'This year'];

  return (
    <header className="merchant-header" style={{
      height: '72px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border-cream)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Left: Mobile Menu & Greeting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onMenuClick}
          style={{
            display: 'none',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: '1px solid var(--border-cream)',
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--ink)'
          }}
          className="mobile-menu-btn"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar */}
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'var(--forest-green-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {merchantAvatar ? (
              <img
                src={merchantAvatar}
                alt={merchantName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--forest-green)'
              }}>
                {merchantName.charAt(0)}
              </span>
            )}
          </div>

          <div>
            <div style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--ink)',
              lineHeight: 1.2
            }}>
              Good morning, {merchantName}
            </div>
            <div style={{
              fontSize: '13px',
              color: 'var(--ink-muted)',
              marginTop: '2px'
            }}>
              Here's what's happening with your store today.
            </div>
          </div>
        </div>
      </div>

      {/* Right: Date Range, Notifications, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Date Range Selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDateMenu(!showDateMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-cream)',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--ink)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Calendar size={15} color="var(--ink-muted)" />
            <span>{dateRange}</span>
            <ChevronDown size={14} color="var(--ink-muted)" />
          </button>

          {showDateMenu && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-cream)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-warm-md)',
              padding: '8px',
              minWidth: '160px',
              zIndex: 50
            }}>
              {dateOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setDateRange(option);
                    setShowDateMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: 'none',
                    backgroundColor: dateRange === option ? 'var(--forest-green-light)' : 'transparent',
                    color: dateRange === option ? 'var(--forest-green)' : 'var(--ink)',
                    fontSize: '13px',
                    fontWeight: dateRange === option ? 600 : 500,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: '1px solid var(--border-cream)',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--ink)',
            transition: 'all 0.15s ease'
          }}
        >
          <Bell size={18} />
          {notifications > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: 'var(--coral)',
              color: '#FFFFFF',
              fontSize: '10px',
              fontWeight: 700,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #FFFFFF'
            }}>
              {notifications}
            </span>
          )}
        </button>

        {/* Profile Menu */}
        <button
          onClick={onProfileClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-cream)',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: 'var(--forest-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 700
          }}>
            {merchantName.charAt(0)}
          </div>
          <ChevronDown size={14} color="var(--ink-muted)" />
        </button>
      </div>
    </header>
  );
}
