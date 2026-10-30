import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, ExternalLink, Sparkles } from 'lucide-react';

export function GoogleLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

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

/**
 * GoogleSignInButton
 * Props:
 *   clientId       – Google OAuth client ID (from env var)
 *   onSuccess(user) – Called with normalized user object on sign-in
 *   onError(err)    – Called with error string on failure
 *   demoMode        – If true, shows a "Demo Sign-In" mock button
 *   label           – Optional label override
 *   width           – Button width (default 340)
 *   role            – 'buyer' | 'merchant' for demo user customization
 */
export default function GoogleSignInButton({
  clientId,
  onSuccess,
  onError,
  demoMode = false,
  label = 'Continue with Google',
  width = 340,
  role = 'buyer'
}) {
  const [gsiLoaded, setGsiLoaded] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const googleBtnRef = useRef(null);
  const initDoneRef = useRef(false);

  const hasClientId = clientId && clientId.trim() !== '' && !clientId.includes('your_');

  // Load Google GSI script dynamically
  useEffect(() => {
    if (!hasClientId) return;

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      if (window.google?.accounts?.id) setGsiLoaded(true);
      else {
        existingScript.addEventListener('load', () => setGsiLoaded(true));
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGsiLoaded(true);
    script.onerror = () => {
      setAuthError('Failed to load Google Sign-In SDK. Check your internet connection.');
      if (onError) onError('GSI script load failed');
    };
    document.head.appendChild(script);
  }, [hasClientId]);

  // Poll for window.google if script was already present
  useEffect(() => {
    if (!hasClientId || gsiLoaded) return;
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        setGsiLoaded(true);
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [hasClientId, gsiLoaded]);

  // Initialize and render native Google button
  useEffect(() => {
    if (!gsiLoaded || !hasClientId || !googleBtnRef.current || initDoneRef.current) return;

    try {
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
                verified: payload.email_verified ?? true,
                role,
                joined: 'Today via Google'
              };
              if (onSuccess) onSuccess(user);
            } else {
              const err = 'Could not decode Google ID token.';
              setAuthError(err);
              if (onError) onError(err);
            }
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      googleBtnRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width
      });

      initDoneRef.current = true;
    } catch (err) {
      console.warn('GSI render error:', err);
    }
  }, [gsiLoaded, hasClientId, clientId, onSuccess, onError, width, role]);

  // Demo sign-in handler
  const handleDemoSignIn = () => {
    setIsLoadingDemo(true);
    setTimeout(() => {
      const demoUsers = {
        buyer: {
          id: 'demo_buyer_001',
          name: 'Priya Sharma',
          email: 'priya.sharma@gmail.com',
          avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=FF6B5B&color=fff&size=160',
          provider: 'demo',
          verified: true,
          role: 'buyer',
          joined: 'Demo Account'
        },
        merchant: {
          id: 'demo_merchant_001',
          name: 'Arjun Hasami',
          email: 'arjun@hasami-studio.com',
          avatar: 'https://ui-avatars.com/api/?name=Arjun+Hasami&background=1F4D3A&color=fff&size=160',
          provider: 'demo',
          verified: true,
          role: 'merchant',
          joined: 'Demo Account'
        }
      };
      setIsLoadingDemo(false);
      if (onSuccess) onSuccess(demoUsers[role] || demoUsers.buyer);
    }, 800);
  };

  // No client ID configured — show instructions
  if (!hasClientId) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', width: '100%' }}>
        {/* Setup notice */}
        <div style={{
          width: '100%',
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: '12px',
          padding: '12px 14px',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start'
        }}>
          <AlertCircle size={16} color="#B45309" style={{ flexShrink: 0, marginTop: '1px' }} />
          <div style={{ fontSize: '12.5px', color: '#78350F', lineHeight: 1.5 }}>
            <strong>Google OAuth not configured.</strong> Set{' '}
            <code style={{ backgroundColor: '#FEF3C7', padding: '1px 5px', borderRadius: '4px', fontSize: '11.5px' }}>
              VITE_GOOGLE_{role.toUpperCase()}_CLIENT_ID
            </code>{' '}
            in your <code style={{ backgroundColor: '#FEF3C7', padding: '1px 5px', borderRadius: '4px', fontSize: '11.5px' }}>.env</code> file.{' '}
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1F4D3A', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
            >
              Google Console <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Demo sign-in button */}
        <button
          onClick={handleDemoSignIn}
          disabled={isLoadingDemo}
          style={{
            width: '100%',
            backgroundColor: isLoadingDemo ? '#E2E8F0' : '#1F4D3A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: isLoadingDemo ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Sparkles size={16} />
          <span>{isLoadingDemo ? 'Signing in...' : `Demo Sign-In as ${role === 'merchant' ? 'Merchant' : 'Buyer'}`}</span>
        </button>

        <p style={{ fontSize: '11px', color: '#8E8D85', textAlign: 'center' }}>
          Uses a mock profile for UI testing. No real credentials required.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
      {authError && (
        <div style={{
          width: '100%',
          backgroundColor: '#FEE2E2',
          border: '1px solid #FCA5A5',
          borderRadius: '10px',
          padding: '10px 12px',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-start',
          fontSize: '12px',
          color: '#B91C1C'
        }}>
          <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span>{authError}</span>
        </div>
      )}

      {/* Google native rendered button */}
      {gsiLoaded ? (
        <div ref={googleBtnRef} style={{ display: 'flex', justifyContent: 'center', minHeight: '44px' }} />
      ) : (
        <div style={{
          width: `${width}px`,
          maxWidth: '100%',
          height: '44px',
          backgroundColor: '#F8F9FA',
          border: '1px solid #DADCE0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          color: '#5F6368',
          fontSize: '13px'
        }}>
          <GoogleLogo size={18} />
          <span>Loading Google Sign-In…</span>
        </div>
      )}

      {/* Demo mode fallback */}
      {demoMode && (
        <button
          onClick={handleDemoSignIn}
          disabled={isLoadingDemo}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '12px',
            color: '#8E8D85',
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: '2px'
          }}
        >
          {isLoadingDemo ? 'Loading demo…' : 'Use Demo Account instead'}
        </button>
      )}
    </div>
  );
}
