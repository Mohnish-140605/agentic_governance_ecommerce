import React, { useEffect, useRef, useState } from 'react';
import CairnLogo from './CairnLogo';
import {
  Search,
  MapPin,
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  Store,
  User,
  PlusCircle,
  ChevronDown,
  ArrowLeft,
  Briefcase,
  Settings,
  Mic,
  Camera
} from 'lucide-react';
import { CUSTOMER_NAV_SCREENS, SELLER_NAV_SCREENS, formatFirstName } from '../data/navigation';
import { GoogleLogo } from './GoogleAuthModal';

export default function Header({
  activeScreen,
  setActiveScreen,
  dashboardMode,
  setDashboardMode,
  currentUser,
  currentLocation,
  onOpenSearch,
  onOpenCart,
  onOpenGoogleAuth,
  onOpenLocationModal,
  onOpenAddListing,
  onSwitchRole,
  cartCount = 2,
  pendingApprovalsCount = 1,
  pendingSellerOrdersCount = 0
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);
  const userMenuTriggerRef = useRef(null);

  const navItems = dashboardMode === 'customer' ? CUSTOMER_NAV_SCREENS : SELLER_NAV_SCREENS;

  useEffect(() => {
    if (!userDropdownOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!userMenuRef.current?.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
        userMenuTriggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [userDropdownOpen]);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backgroundColor: 'rgba(251, 247, 240, 0.94)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-cream)',
      transition: 'all 0.2s ease'
    }}>
      {/* Main Header Row */}
      <div className="app-header-row">
        {/* Left: Logo & Role Isolation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <CairnLogo onClick={() => setActiveScreen(dashboardMode === 'customer' ? 'explore' : 'seller_hub')} />

          {dashboardMode === 'seller' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--forest-green)',
                color: '#FFFFFF',
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '11.5px',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}>
                <Store size={12} />
                <span>MERCHANT STUDIO</span>
              </div>
              <button
                onClick={() => {
                  setDashboardMode('customer');
                  setActiveScreen('explore');
                }}
                title="Switch back to shopping as customer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-cream)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--ink-secondary)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-warm-sm)',
                  transition: 'all 0.15s ease'
                }}
              >
                <ArrowLeft size={13} />
                <span>Return to Store</span>
              </button>
            </div>
          ) : (
            <span className="header-tagline-text" style={{
              fontSize: '12px',
              color: 'var(--ink-muted)',
              fontStyle: 'italic',
            }}>
              governed shopping with Aria
            </span>
          )}
        </div>

        {/* Center: Search pill with shortcut ⌘K (Customer) or Merchant Quick Actions (Seller) */}
        {dashboardMode === 'customer' ? (
          <button
            type="button"
            aria-label="Open search or ask Aria"
            onClick={onOpenSearch}
            style={{
              flex: '1 1 auto',
              minWidth: 0,
              maxWidth: '460px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-cream)',
              borderRadius: 'var(--radius-pill)',
              padding: '9px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-warm-sm)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
            }}
            className="search-pill-container"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-secondary)', fontSize: '13.5px' }}>
              <Search size={15} color="var(--ink-muted)" />
              <span style={{ color: 'var(--ink-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                Search or ask Aria...
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span title="Voice & visual search ready" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ink-muted)' }}>
                <Camera size={14} />
                <Mic size={14} />
              </span>
              <kbd style={{
                fontFamily: 'inherit',
                fontSize: '10.5px',
                fontWeight: 600,
                color: 'var(--ink-muted)',
                backgroundColor: 'var(--bg-cream-subtle)',
                padding: '2px 6px',
                borderRadius: '6px',
                border: '1px solid var(--border-cream)'
              }}>
                ⌘K
              </kbd>
            </div>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onOpenAddListing}
              style={{
                backgroundColor: 'var(--forest-green)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-warm-sm)'
              }}
            >
              <PlusCircle size={15} />
              <span>+ Add Artisan Listing</span>
            </button>
            <span className="merchant-id-badge" style={{
              fontSize: '11.5px',
              color: 'var(--ink-muted)',
              backgroundColor: '#FFFFFF',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-cream)'
            }}>
              Merchant ID: <strong>HA-7729</strong> (Studio Hasami)
            </span>
          </div>
        )}

        {/* Right: Live Location, Google Auth, Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Interactive Live Location Pill */}
          <button
            type="button"
            className="header-location-button"
            onClick={onOpenLocationModal}
            aria-label={`Change delivery location. Current city: ${currentLocation?.city || 'not selected'}`}
            title="Click to calibrate GPS or switch delivery city"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: currentLocation?.isLiveGPS ? '1.5px solid #86EFAC' : '1px solid var(--border-cream)',
              borderRadius: 'var(--radius-pill)',
              padding: '6px 12px',
              fontSize: '12.5px',
              fontWeight: 500,
              color: 'var(--ink)',
              boxShadow: 'var(--shadow-warm-sm)',
              cursor: 'pointer'
            }}
          >
            <MapPin size={13} color="var(--forest-green)" />
            <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentLocation ? `${currentLocation.city}` : 'Select Area'}
            </span>
            {currentLocation?.isLiveGPS && (
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#22C55E'
              }} />
            )}
          </button>

          {/* Cart Icon (Customer View) */}
          {dashboardMode === 'customer' && (
            <button
              type="button"
              className="header-cart-button"
              onClick={onOpenCart}
              aria-label={`Shopping bag, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
              style={{
                position: 'relative',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ink)',
                boxShadow: 'var(--shadow-warm-sm)',
                cursor: 'pointer'
              }}
            >
              <ShoppingBag size={19} aria-hidden="true" />
              {cartCount > 0 && (
                <span aria-hidden="true" style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  backgroundColor: 'var(--coral)',
                  color: '#FFFFFF',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF'
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Google Login / Authenticated User Pill */}
          {currentUser ? (
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                type="button"
                id="account-menu-trigger"
                ref={userMenuTriggerRef}
                className="header-account-trigger"
                aria-label={`Account menu for ${currentUser.name}`}
                aria-expanded={userDropdownOpen}
                aria-controls="account-menu-panel"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-cream)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '4px 10px 4px 4px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-warm-sm)'
                }}
              >
                <div style={{
                  position: 'relative',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  overflow: 'hidden'
                }}>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=1F4D3A&color=fff`;
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <GoogleLogo size={8} />
                  </div>
                </div>

                <span className="header-user-name" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                  {formatFirstName(currentUser.name, 'Account')}
                </span>
                <ChevronDown size={12} color="var(--ink-muted)" />
              </button>

              {/* User Dropdown */}
              <div
                id="account-menu-panel"
                aria-labelledby="account-menu-trigger"
                className={userDropdownOpen ? 'animate-fade-in header-account-panel' : 'header-account-panel'}
                hidden={!userDropdownOpen}
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: 'min(260px, calc(100vw - 48px))',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1.5px solid var(--border-cream)',
                  boxShadow: 'var(--shadow-warm-md)',
                  padding: '12px',
                  zIndex: 50
                }}
              >
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-cream-subtle)', marginBottom: '10px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '6px' }}>
                      {currentUser.email}
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#166534', fontWeight: 600 }}>
                      <GoogleLogo size={10} />
                      <span>Google Verified</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <button
                      type="button"
                      className="header-menu-action"
                      onClick={() => {
                        setActiveScreen('rules');
                        setUserDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '13px',
                        color: 'var(--ink)',
                        border: 'none',
                        background: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-cream-subtle)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <User size={15} />
                      <span>Safeguards & Profile</span>
                    </button>

                    {dashboardMode === 'customer' && (
                      <button
                        type="button"
                        className="header-menu-action"
                        aria-current={activeScreen === 'settings' ? 'page' : undefined}
                        onClick={() => {
                          setActiveScreen('settings');
                          setUserDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '13px',
                          color: 'var(--ink)',
                          border: 'none',
                          background: activeScreen === 'settings' ? 'var(--bg-cream-subtle)' : 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <Settings size={15} aria-hidden="true" />
                        <span>Settings</span>
                      </button>
                    )}

                    {dashboardMode === 'customer' ? (
                      <button
                        type="button"
                        className="header-menu-action"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setDashboardMode('seller');
                          setActiveScreen('seller_hub');
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '13px',
                          color: 'var(--forest-green)',
                          fontWeight: 600,
                          border: 'none',
                          background: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--forest-green-light)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <Store size={15} />
                        <span>Merchant Studio (Seller)</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="header-menu-action"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setDashboardMode('customer');
                          setActiveScreen('explore');
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '13px',
                          color: 'var(--forest-green)',
                          fontWeight: 600,
                          border: 'none',
                          background: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--forest-green-light)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <Sparkles size={15} />
                        <span>Return to Customer Store</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="header-menu-action"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenGoogleAuth();
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '13px',
                        color: 'var(--ink-secondary)',
                        border: 'none',
                        background: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-cream-subtle)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <GoogleLogo size={15} />
                      <span>Switch Google Account</span>
                    </button>

                    {onSwitchRole && (
                      <button
                        type="button"
                        className="header-menu-action"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onSwitchRole();
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '13px',
                          color: '#B91C1C',
                          fontWeight: 600,
                          border: 'none',
                          background: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          borderTop: '1px solid var(--border-cream-subtle)',
                          marginTop: '8px',
                          paddingTop: '14px',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <ArrowLeft size={15} />
                        <span>Switch Role / Sign Out</span>
                      </button>
                    )}
                  </div>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenGoogleAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid var(--border-cream)',
                borderRadius: 'var(--radius-pill)',
                padding: '7px 14px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--ink)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-warm-sm)'
              }}
            >
              <GoogleLogo size={16} />
              <span>Sign in with Google</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            style={{
              display: 'none',
              padding: '6px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-cream)'
            }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Subnavigation Bar: Tailored to Active Role */}
      <nav aria-label={dashboardMode === 'customer' ? 'Customer navigation' : 'Seller navigation'} style={{
        borderTop: '1px solid var(--border-cream-subtle)',
        backgroundColor: dashboardMode === 'seller' ? 'rgba(234, 244, 238, 0.85)' : '#FAF6F0'
      }}>
        <div style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          padding: '4px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            const hasBadge = 
              (item.badgeKey === 'approvals' && pendingApprovalsCount > 0) ||
              (item.badgeKey === 'sellerOrders' && pendingSellerOrdersCount > 0);
            const badgeCount = item.badgeKey === 'approvals' ? pendingApprovalsCount : pendingSellerOrdersCount;
            return (
              <button
                key={item.id}
                type="button"
                className="header-nav-item"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => {
                  setActiveScreen(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#FFFFFF' : 'var(--ink-secondary)',
                  backgroundColor: isActive ? 'var(--forest-green)' : 'transparent',
                  border: isActive ? '1px solid var(--forest-green)' : '1px solid transparent',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>{item.label}</span>
                {hasBadge && (
                  <span style={{
                    backgroundColor: isActive ? '#FFFFFF' : '#FEF3C7',
                    color: isActive ? 'var(--forest-green)' : '#B45309',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    border: isActive ? 'none' : '1px solid #FCD34D'
                  }}>
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
          {dashboardMode === 'customer' && (
            <button
              type="button"
              className="header-nav-item header-merchant-nav-item"
              onClick={() => {
                setDashboardMode('seller');
                setActiveScreen('seller_hub');
              }}
              style={{
                marginLeft: 'auto',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--forest-green)',
                backgroundColor: 'var(--forest-green-light)',
                border: '1px solid var(--forest-green-border)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D1E7DD'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--forest-green-light)'}
            >
              <Briefcase size={13} />
              <span>Merchant Studio</span>
            </button>
          )}
          {dashboardMode === 'seller' && (
            <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--forest-green)', fontWeight: 600, paddingRight: '6px' }}>
              Merchant Checkpoint
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Drawer */}
      <nav id="mobile-navigation" aria-label="Mobile navigation" hidden={!mobileMenuOpen} style={{
          padding: '16px 24px 20px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-cream)',
          display: mobileMenuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {dashboardMode === 'customer' ? (
            <button
              type="button"
              className="header-mobile-nav-item"
              onClick={() => {
                setDashboardMode('seller');
                setActiveScreen('seller_hub');
                setMobileMenuOpen(false);
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: 'var(--forest-green-light)',
                color: 'var(--forest-green)',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid var(--forest-green-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                marginBottom: '8px'
              }}
            >
              <Store size={15} />
              <span>Open Merchant Studio →</span>
            </button>
          ) : (
            <button
              type="button"
              className="header-mobile-nav-item"
              onClick={() => {
                setDashboardMode('customer');
                setActiveScreen('explore');
                setMobileMenuOpen(false);
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-cream-subtle)',
                color: 'var(--ink)',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid var(--border-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                marginBottom: '8px'
              }}
            >
              <ArrowLeft size={15} />
              <span>Return to Customer Store</span>
            </button>
          )}

          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="header-mobile-nav-item"
              aria-current={activeScreen === item.id ? 'page' : undefined}
              onClick={() => {
                setActiveScreen(item.id);
                setMobileMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: activeScreen === item.id ? 'var(--forest-green-light)' : 'transparent',
                color: activeScreen === item.id ? 'var(--forest-green)' : 'var(--ink)',
                fontSize: '14px',
                fontWeight: activeScreen === item.id ? 600 : 500,
                textAlign: 'left',
                border: 'none'
              }}
            >
              <div>
                <div>{item.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{item.subtitle}</div>
              </div>
            </button>
          ))}
      </nav>
    </header>
  );
}
