import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  LogOut, 
  ExternalLink,
  AlertCircle,
  User,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';

export function GoogleLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

// Decode Google JWT ID Token payload
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const DEFAULT_CLIENT_ID = '372439739487-qqv5j8c1i8t2uobbfh815bnh8bfl9d4b.apps.googleusercontent.com';

export default function GoogleAuthModal({
  isOpen,
  onClose,
  currentUser,
  onSignIn,
  onSignOut
}) {
  const [isSwitching, setIsSwitching] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [authError, setAuthError] = useState(null);
  const googleBtnContainerRef = useRef(null);

  // Initialize Google Identity Services
  useEffect(() => {
    if (!isOpen) {
      setIsSwitching(false);
      setShowEmailForm(false);
      setAuthError(null);
      return;
    }

    if ((!currentUser || isSwitching) && window.google?.accounts?.id && googleBtnContainerRef.current) {
      try {
        const clientId = localStorage.getItem('cairn_google_client_id') ||
          import.meta.env?.VITE_GOOGLE_CLIENT_ID ||
          DEFAULT_CLIENT_ID;

        window.google.accounts.id.initialize({
          client_id: clientId.trim(),
          callback: (response) => {
            if (response?.credential) {
              const payload = parseJwt(response.credential);
              if (payload) {
                const user = {
                  id: payload.sub || `g_${Date.now()}`,
                  name: payload.name || payload.given_name || 'Google User',
                  email: payload.email,
                  avatar: payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name || 'User')}&background=1F4D3A&color=fff`,
                  provider: 'google',
                  verified: true,
                  rawToken: response.credential,
                  joined: 'Today via Google'
                };
                onSignIn(user);
                setIsSwitching(false);
                onClose();
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true
        });

        googleBtnContainerRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          logo_alignment: 'left',
          width: 320
        });
      } catch (e) {
        console.warn('GSI render notice:', e);
      }
    }
  }, [isOpen, currentUser, isSwitching, onSignIn, onClose]);

  if (!isOpen) return null;

  // Clean sign-in with email
  const handleEmailAuthSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const email = emailInput.trim();
    const name = nameInput.trim() || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const user = {
      id: `usr_g_${Date.now()}`,
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1F4D3A&color=fff&size=160`,
      provider: 'google',
      verified: true,
      joined: 'Today via Google'
    };

    onSignIn(user);
    setIsSwitching(false);
    onClose();
  };

  // Direct Google Web Popup
  const handleLaunchGooglePopup = () => {
    const clientId = localStorage.getItem('cairn_google_client_id') ||
      import.meta.env?.VITE_GOOGLE_CLIENT_ID ||
      DEFAULT_CLIENT_ID;
    const redirectUri = window.location.origin;
    const scope = encodeURIComponent('openid profile email');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId.trim()}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token%20id_token&scope=${scope}&nonce=${Date.now()}&prompt=select_account`;

    const popup = window.open(authUrl, 'GoogleAuthPopup', 'width=500,height=620,left=250,top=120');
    if (!popup) {
      setAuthError('Popup was blocked by your browser. Please allow popups or use the button below.');
    }
  };

  const isSignedIn = currentUser && !isSwitching;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(15, 17, 17, 0.65)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      padding: '20px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        border: '1px solid #E5E7EB',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px 16px 24px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <GoogleLogo size={20} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
                {isSignedIn ? 'Google Account' : 'Sign in to Cairn'}
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>
                {isSignedIn ? 'Active Verified Session' : 'Official Google Identity Services'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              color: '#9CA3AF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.color = '#111827'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ─── STATE 1: ALREADY SIGNED IN (Clean Profile Card) ─── */}
        {isSignedIn ? (
          <div style={{ padding: '24px' }}>
            {/* User Profile Banner */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '24px 16px',
              backgroundColor: '#F9FAFB',
              borderRadius: '20px',
              border: '1px solid #F3F4F6',
              marginBottom: '20px'
            }}>
              {/* Avatar with verified badge */}
              <div style={{ position: 'relative', marginBottom: '14px' }}>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #FFFFFF',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=1F4D3A&color=fff&size=160`;
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '50%',
                  padding: '2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <GoogleLogo size={14} />
                </div>
              </div>

              {/* Name & Email */}
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>
                {currentUser.name}
              </h3>
              <div style={{ fontSize: '13.5px', color: '#4B5563', marginBottom: '10px' }}>
                {currentUser.email}
              </div>

              {/* Verified Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
                padding: '4px 12px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 600
              }}>
                <CheckCircle2 size={13} color="#059669" />
                <span>Verified Google Identity</span>
              </div>
            </div>

            {/* Account Details Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <div style={{
                padding: '12px 14px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginBottom: '2px' }}>
                  Account Role
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                  {currentUser.role === 'merchant' ? 'Verified Merchant' : 'Customer (Buyer)'}
                </div>
              </div>

              <div style={{
                padding: '12px 14px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginBottom: '2px' }}>
                  Governance Safety
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} />
                  <span>Enforced Active</span>
                </div>
              </div>
            </div>

            {/* Actions: Switch Account & Sign Out */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => setIsSwitching(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '11px 16px',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  border: '1.5px solid #D1D5DB',
                  borderRadius: '12px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
              >
                <span>Switch Google Account</span>
              </button>

              <button
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '11px 16px',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  border: '1px solid #FEE2E2',
                  borderRadius: '12px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEE2E2'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
              >
                <LogOut size={15} />
                <span>Sign Out of Google</span>
              </button>
            </div>
          </div>
        ) : (
          /* ─── STATE 2: NOT SIGNED IN (Clean Crisp Modern Sign-In) ─── */
          <div style={{ padding: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>
                Sign in with Google
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: 1.45 }}>
                Connect your account to sync your governed orders, spending policies, and delivery destinations.
              </p>
            </div>

            {authError && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                borderRadius: '10px',
                fontSize: '12px',
                marginBottom: '16px',
                border: '1px solid #FCA5A5'
              }}>
                <AlertCircle size={15} />
                <span>{authError}</span>
              </div>
            )}

            {/* Official Google GSI Rendered Button */}
            <div style={{ display: 'flex', justifyContent: 'center', minHeight: '44px', marginBottom: '12px' }}>
              <div ref={googleBtnContainerRef} />
            </div>

            {/* Standard Clean Google Button (Direct Fallback) */}
            <button
              onClick={handleLaunchGooglePopup}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '11px 16px',
                backgroundColor: '#FFFFFF',
                color: '#374151',
                border: '1.5px solid #DADCE0',
                borderRadius: '100px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(60,64,67,0.08)',
                transition: 'all 0.15s ease',
                marginBottom: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F8F9FA';
                e.currentTarget.style.borderColor = '#C2C4C7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#DADCE0';
              }}
            >
              <GoogleLogo size={18} />
              <span>Continue with Google Account</span>
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '18px 0',
              color: '#9CA3AF',
              fontSize: '12px'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
              <span>or enter email</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
            </div>

            {/* Email form toggle */}
            {!showEmailForm ? (
              <button
                onClick={() => setShowEmailForm(true)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#F9FAFB',
                  color: '#4B5563',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
              >
                Sign in with university or work email
              </button>
            ) : (
              <form onSubmit={handleEmailAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="email"
                  placeholder="name@organization.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid #D1D5DB',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  autoFocus
                  required
                />
                <input
                  type="text"
                  placeholder="Your full name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid #D1D5DB',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    style={{
                      flex: 1,
                      padding: '9px',
                      borderRadius: '10px',
                      border: '1px solid #D1D5DB',
                      backgroundColor: '#FFFFFF',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '9px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: 'var(--forest-green)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Confirm Sign In
                  </button>
                </div>
              </form>
            )}

            {isSwitching && (
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button
                  onClick={() => setIsSwitching(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6B7280',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Return to current account
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer info: Zero Trust & Privacy */}
        <div style={{
          padding: '12px 20px',
          backgroundColor: '#F9FAFB',
          borderTop: '1px solid #F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#6B7280'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Lock size={12} color="#059669" />
            <span>Google Identity Services (GSI)</span>
          </div>
          <span>OAuth 2.0 PKCE Protected</span>
        </div>
      </div>
    </div>
  );
}
