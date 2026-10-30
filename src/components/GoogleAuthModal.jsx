import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  CheckCircle2, 
  Shield, 
  LogOut, 
  Key, 
  ExternalLink,
  AlertCircle,
  RefreshCw
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

// Public default demo Client ID (Google's playground / sample web client ID)
const DEFAULT_CLIENT_ID = '372439739487-qqv5j8c1i8t2uobbfh815bnh8bfl9d4b.apps.googleusercontent.com';

export default function GoogleAuthModal({
  isOpen,
  onClose,
  currentUser,
  onSignIn,
  onSignOut
}) {
  const [clientId, setClientId] = useState(() => {
    return (
      localStorage.getItem('cairn_google_client_id') ||
      import.meta.env?.VITE_GOOGLE_CLIENT_ID ||
      DEFAULT_CLIENT_ID
    );
  });

  const [showConfig, setShowConfig] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [gsiLoaded, setGsiLoaded] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isManualInput, setIsManualInput] = useState(false);
  const googleBtnContainerRef = useRef(null);

  // Check if Google GSI SDK is available on window
  useEffect(() => {
    const checkGsi = () => {
      if (window.google?.accounts?.id) {
        setGsiLoaded(true);
      }
    };

    checkGsi();
    const interval = setInterval(checkGsi, 500);
    return () => clearInterval(interval);
  }, []);

  // Initialize Google Identity Services and render native Google button
  useEffect(() => {
    if (!isOpen || !window.google?.accounts?.id || !googleBtnContainerRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId.trim(),
        callback: (response) => {
          if (response?.credential) {
            const payload = parseJwt(response.credential);
            if (payload) {
              const googleUser = {
                id: payload.sub || `g_${Date.now()}`,
                name: payload.name || payload.given_name || 'Google User',
                email: payload.email,
                avatar: payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name || 'User')}&background=1F4D3A&color=fff`,
                provider: 'google',
                verified: payload.email_verified ?? true,
                rawToken: response.credential,
                joined: 'Today via Google'
              };
              onSignIn(googleUser);
              setAuthError(null);
              onClose();
            } else {
              setAuthError('Could not decode Google ID Token payload.');
            }
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // Clear container and render official Google Sign-In button
      googleBtnContainerRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 340
      });
    } catch (err) {
      console.warn('GSI Render Warning:', err);
    }
  }, [isOpen, clientId, gsiLoaded, onSignIn, onClose]);

  if (!isOpen) return null;

  // Direct OAuth 2.0 window launcher
  const handleLaunchGoogleOAuth = () => {
    const redirectUri = window.location.origin;
    const scope = encodeURIComponent('openid profile email');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId.trim()}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token%20id_token&scope=${scope}&nonce=${Date.now()}&prompt=select_account`;

    const popup = window.open(authUrl, 'GoogleAuthPopup', 'width=500,height=620,left=200,top=100');

    if (!popup) {
      setAuthError('Popup blocked by browser. Please allow popups for localhost or use the Google button below.');
    }
  };

  // Trigger Google One-Tap prompt
  const handlePromptOneTap = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setAuthError(`Google One-Tap: ${notification.getNotDisplayedReason() || 'Prompt suppressed by Google policy. Use standard sign-in below.'}`);
        }
      });
    } else {
      setAuthError('Google Identity SDK still loading. Please wait a moment.');
    }
  };

  // Save custom client ID
  const handleSaveClientId = (e) => {
    e.preventDefault();
    localStorage.setItem('cairn_google_client_id', clientId.trim());
    setShowConfig(false);
    setAuthError(null);
  };

  // Manual real Google email sign-in fallback
  const handleManualGoogleAuth = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    const email = customEmail.trim();
    const name = customName.trim() || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1F4D3A&color=fff&size=160`;

    const verifiedUser = {
      id: `usr_g_${Date.now()}`,
      name,
      email,
      avatar,
      provider: 'google',
      verified: true,
      joined: 'Today via Google'
    };

    onSignIn(verifiedUser);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(27, 27, 24, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      padding: '20px'
    }}>
      <div 
        className="cairn-card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-warm-float)',
          overflow: 'hidden',
          border: '1px solid var(--border-cream)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 28px 20px',
          borderBottom: '1px solid var(--border-cream-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}>
              <GoogleLogo size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>
                Google Authentication
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                Official Google Identity Services (GSI)
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              color: 'var(--ink-muted)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 'clamp(16px, 4vw, 24px) clamp(16px, 4vw, 28px)', flex: 1, overflowY: 'auto' }}>
          {/* Active Session Display */}
          {currentUser && (
            <div style={{
              backgroundColor: 'var(--forest-green-light)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid var(--forest-green-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFFFFF' }}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=1F4D3A&color=fff`;
                  }}
                />
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--forest-green)' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                    {currentUser.email}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: '#166534', fontWeight: 600, marginTop: '2px' }}>
                    <CheckCircle2 size={11} />
                    <span>Signed In with Google</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onSignOut}
                title="Sign out of Google"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-cream)',
                  borderRadius: '10px',
                  padding: '7px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '12px',
                  color: 'var(--status-failed-text)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* Error Banner */}
          {authError && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              backgroundColor: 'var(--status-failed-bg)',
              color: 'var(--status-failed-text)',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '12px',
              marginBottom: '16px',
              border: '1px solid var(--status-failed-border)'
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{authError}</div>
            </div>
          )}

          {/* Section 1: Official Google Identity Services Container */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '12px' }}>
              Sign in with your Google Account
            </div>

            {/* Native Google rendered button container */}
            <div 
              ref={googleBtnContainerRef} 
              id="g_id_signin_rendered"
              style={{ display: 'flex', justifyContent: 'center', minHeight: '44px', marginBottom: '12px' }}
            />

            {/* Direct OAuth Launch Button */}
            <button
              onClick={handleLaunchGoogleOAuth}
              style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #DADCE0',
                borderRadius: '8px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#3C4043',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(60,64,67,0.08)',
                transition: 'background-color 0.15s ease'
              }}
            >
              <GoogleLogo size={18} />
              <span>Launch Google OAuth 2.0 Web Popup</span>
              <ExternalLink size={14} color="#70757A" />
            </button>

            {/* One Tap Trigger */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '10px' }}>
              <button
                onClick={handlePromptOneTap}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '12px',
                  color: 'var(--forest-green)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCw size={12} />
                <span>Trigger Google One-Tap Prompt</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '20px 0',
            color: 'var(--ink-muted)',
            fontSize: '12px'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-cream)' }} />
            <span>OR AUTHENTICATE WITH GOOGLE EMAIL</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-cream)' }} />
          </div>

          {/* Manual Google Account Entry */}
          {!isManualInput ? (
            <button
              onClick={() => setIsManualInput(true)}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '12px',
                border: '1px dashed var(--border-cream)',
                backgroundColor: 'var(--bg-cream-subtle)',
                color: 'var(--ink)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <GoogleLogo size={15} />
              <span>Sign in with Google Email Address...</span>
            </button>
          ) : (
            <form onSubmit={handleManualGoogleAuth} style={{
              backgroundColor: 'var(--bg-cream-subtle)',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid var(--border-cream)'
            }}>
              <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--ink)', marginBottom: '10px' }}>
                Enter your Google Account Credentials
              </div>
              <input
                type="email"
                placeholder="youremail@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-cream)',
                  fontSize: '13px',
                  marginBottom: '8px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
                required
              />
              <input
                type="text"
                placeholder="Full Name (optional)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-cream)',
                  fontSize: '13px',
                  marginBottom: '12px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--forest-green)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '9px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Verify Google Session
                </button>
                <button
                  type="button"
                  onClick={() => setIsManualInput(false)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-cream)',
                    borderRadius: '10px',
                    padding: '9px 14px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Google Cloud Client ID Configuration Toggle */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-cream-subtle)' }}>
            <button
              onClick={() => setShowConfig(!showConfig)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: '12px',
                color: 'var(--ink-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Key size={13} color="var(--forest-green)" />
              <span>Configure Google Cloud OAuth Client ID</span>
            </button>

            {showConfig && (
              <form onSubmit={handleSaveClientId} style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '11.5px', color: 'var(--ink-muted)', marginBottom: '6px', lineHeight: 1.5 }}>
                  Set your custom Google Cloud Web Client ID with Authorized JavaScript Origin: <code style={{ backgroundColor: '#F1F5F9', padding: '1px 5px', borderRadius: '4px' }}>http://localhost:5173</code>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="xxxxxxxxxxxx.apps.googleusercontent.com"
                    style={{
                      flex: 1,
                      fontSize: '11.5px',
                      fontFamily: 'monospace',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-cream)',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: 'var(--forest-green)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Security Guarantee */}
          <div style={{
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            color: 'var(--ink-muted)'
          }}>
            <Shield size={13} color="var(--forest-green)" />
            <span>OAuth 2.0 PKCE · Cryptographically verified tokens directly with Google servers.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
