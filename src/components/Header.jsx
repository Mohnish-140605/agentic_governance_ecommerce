import React, { useState } from 'react';
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
  Briefcase
} from 'lucide-react';
import { CUSTOMER_NAV_SCREENS, SELLER_NAV_SCREENS } from '../data/navigation';
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
  cartCount = 2,
  pendingApprovalsCount = 1
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = dashboardMode === 'customer' ? CUSTOMER_NAV_SCREENS : SELLER_NAV_SCREENS;

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
      {/* Top Primary Bar */}
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
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
            <span style={{
              fontSize: '12px',
              color: 'var(--ink-muted)',
              fontStyle: 'italic',
              display: 'none',
              '@media (min-width: 640px)': { display: 'inline' }
            }}>
              mindful shopping with Aria
            </span>
          )}
        </div>

        {/* Center: Search pill with shortcut ⌘K (Customer) or Merchant Quick Actions (Seller) */}
        {dashboardMode === 'customer' ? (
          <div 
            onClick={onOpenSearch}
            style={{
              flex: '1',
              maxWidth: '460px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-cream)',
              borderRadius: 'var(--radius-pill)',
              padding: '9px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-warm-sm)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
            }}
            className="search-pill-container"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-secondary)', fontSize: '13.5px' }}>
              <Search size={15} color="var(--ink-muted)" />
              <span style={{ color: 'var(--ink-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                Search organic essentials, quiet luxuries, laptops...
              </span>
            </div>
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
            <span style={{
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
            onClick={onOpenLocationModal}
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
              onClick={onOpenCart}
              aria-label="View Cart"
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
              <ShoppingBag size={17} />
              {cartCount > 0 && (
                <span style={{
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
            <div style={{ position: 'relative' }}>
              <button 
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

                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown size={12} color="var(--ink-muted)" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div 
                  className="animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: '42px',
                    right: 0,
                    width: '230px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid var(--border-cream)',
                    boxShadow: 'var(--shadow-warm-md)',
                    padding: '8px',
                    zIndex: 50
                  }}
                >
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-cream-subtle)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                      {currentUser.email}
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#166534', fontWeight: 600, marginTop: '3px' }}>
                      <GoogleLogo size={10} />
                      <span>Google Verified</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveScreen('rules');
                      setUserDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12.5px',
                      color: 'var(--ink)',
                      border: 'none',
                      background: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginTop: '4px'
                    }}
                  >
                    <User size={14} />
                    <span>Safeguards & Profile</span>
                  </button>

                  {dashboardMode === 'customer' ? (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setDashboardMode('seller');
                        setActiveScreen('seller_hub');
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12.5px',
                        color: 'var(--forest-green)',
                        fontWeight: 600,
                        border: 'none',
                        background: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Store size={14} />
                      <span>Merchant Studio (Seller)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setDashboardMode('customer');
                        setActiveScreen('explore');
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12.5px',
                        color: 'var(--forest-green)',
                        fontWeight: 600,
                        border: 'none',
                        background: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Sparkles size={14} />
                      <span>Return to Customer Store</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenGoogleAuth();
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12.5px',
                      color: 'var(--ink-secondary)',
                      border: 'none',
                      background: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <GoogleLogo size={14} />
                    <span>Switch Google Account</span>
                  </button>
                </div>
              )}
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
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
      <nav style={{
        borderTop: '1px solid var(--border-cream-subtle)',
        backgroundColor: dashboardMode === 'seller' ? 'rgba(234, 244, 238, 0.7)' : 'rgba(251, 247, 240, 0.8)'
      }}>
        <div style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            const hasBadge = item.badgeKey === 'approvals' && pendingApprovalsCount > 0;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveScreen(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  padding: '11px 14px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--forest-green)' : 'var(--ink-secondary)',
                  borderBottom: isActive ? '2px solid var(--forest-green)' : '2px solid transparent',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                <span>{item.label}</span>
                {hasBadge && (
                  <span style={{
                    backgroundColor: 'var(--butter-yellow)',
                    color: 'var(--butter-yellow-dark)',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    border: '1px solid var(--butter-yellow-border)'
                  }}>
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>
            );
          })}
          {dashboardMode === 'customer' && (
            <button
              onClick={() => {
                setDashboardMode('seller');
                setActiveScreen('seller_hub');
              }}
              style={{
                marginLeft: 'auto',
                padding: '11px 14px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--forest-green)',
                background: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              <Briefcase size={13} />
              <span>Sell on Cairn · Studio →</span>
            </button>
          )}
          {dashboardMode === 'seller' && (
            <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--forest-green)', fontWeight: 600, paddingRight: '6px' }}>
              🌿 Verified Artisan Portal
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          padding: '16px 24px 20px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-cream)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {dashboardMode === 'customer' ? (
            <button
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
        </div>
      )}
    </header>
  );
}
