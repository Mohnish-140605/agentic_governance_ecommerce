import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, ShoppingBag, Sparkles, Shield,
  Package, Zap, Star, CheckCircle2, User
} from 'lucide-react';
import GoogleSignInButton from '../components/GoogleSignInButton';

const KEYFRAMES = `
@keyframes buyerBlobFloat {
  0%, 100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(18px,-24px) scale(1.05); }
}
@keyframes buyerBlobAlt {
  0%, 100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(-14px,18px) scale(0.97); }
}
@keyframes buyerPanelIn {
  from { opacity:0; transform: translateX(-32px) scale(0.97); }
  to   { opacity:1; transform: translateX(0) scale(1); }
}
@keyframes buyerFormIn {
  from { opacity:0; transform: translateX(28px); }
  to   { opacity:1; transform: translateX(0); }
}
@keyframes buyerIconFloat {
  0%,100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(3deg); }
}
@keyframes buyerPulseRing {
  0%   { box-shadow: 0 0 0 0 rgba(255,107,91,0.5); }
  70%  { box-shadow: 0 0 0 16px rgba(255,107,91,0); }
  100% { box-shadow: 0 0 0 0 rgba(255,107,91,0); }
}
@keyframes buyerFeatureIn {
  from { opacity:0; transform: translateX(-12px); }
  to   { opacity:1; transform: translateX(0); }
}
@keyframes buyerPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}
@keyframes buyerRotateSlow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
`;

const FEATURES = [
  { icon: <Sparkles size={15} />, title: 'Aria AI Assistant', desc: 'Shop smarter with conversational AI' },
  { icon: <Shield size={15} />, title: 'Approval Rules', desc: 'Safeguard spending with smart rules' },
  { icon: <Package size={15} />, title: 'Order Tracking', desc: 'Real-time updates at every step' },
  { icon: <Star size={15} />, title: 'Curated Selection', desc: 'Handpicked artisan quality products' },
  { icon: <Zap size={15} />, title: 'Fast Checkout', desc: 'One-click reorders for regulars' },
];

export default function BuyerLoginPage({ onBack, onSignIn, onGuestContinue }) {
  const [authError, setAuthError] = useState(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const clientId = import.meta.env?.VITE_GOOGLE_BUYER_CLIENT_ID || '';

  const handleSuccess = (user) => { onSignIn({ ...user, role: 'buyer' }); };
  const handleError = (err) => {
    setAuthError(typeof err === 'string' ? err : 'Authentication failed. Please try again.');
  };

  const handleGuestContinue = () => {
    setGuestLoading(true);
    setTimeout(() => {
      setGuestLoading(false);
      onGuestContinue({
        id: 'guest_buyer', name: 'Guest Buyer', email: '',
        avatar: 'https://ui-avatars.com/api/?name=Guest&background=FF6B5B&color=fff&size=160',
        provider: 'guest', verified: false, role: 'buyer', joined: 'Guest Session'
      });
    }, 600);
  };

  // Coral design tokens
  const CORAL = '#FF6B5B';
  const CORAL_DARK = '#E8503F';
  const CORAL_LIGHT = '#FFF2EE';
  const CORAL_BORDER = '#FFD2CC';

  return (
    <div className="buyer-login-container" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'row',
      backgroundColor: CORAL_LIGHT, overflow: 'hidden'
    }}>
      <style>{KEYFRAMES}</style>

      {/* ─── Left illustration panel (coral) ─── */}
      <div
        className="buyer-left-panel"
        style={{
          flex: '0 0 46%', position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '60px 48px',
          background: `linear-gradient(155deg, ${CORAL} 0%, #FF8C5A 35%, #FFAB6A 68%, #FFD09A 100%)`,
          animation: mounted ? 'buyerPanelIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) both' : 'none',
        }}
      >
        {/* Background blobs */}
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: '340px', height: '340px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
          animation: 'buyerBlobFloat 8s ease-in-out infinite', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-60px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.13) 0%, transparent 70%)',
          animation: 'buyerBlobAlt 12s ease-in-out infinite', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: '55%', left: '-40px',
          width: '220px', height: '220px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'buyerBlobFloat 15s ease-in-out infinite 2s', pointerEvents: 'none'
        }} />
        {/* Rotating decorative ring */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '420px', height: '420px',
          marginTop: '-210px', marginLeft: '-210px',
          borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)',
          animation: 'buyerRotateSlow 30s linear infinite', pointerEvents: 'none'
        }} />

        <div style={{
          position: 'relative', zIndex: 1, textAlign: 'center',
          animation: mounted ? 'buyerPanelIn 0.8s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both' : 'none',
        }}>
          {/* Icon cluster */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '32px', position: 'relative'
          }}>
            <div style={{
              width: '104px', height: '104px', borderRadius: '30px',
              backgroundColor: 'rgba(255,255,255,0.22)',
              backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
              border: '2px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              animation: 'buyerIconFloat 3s ease-in-out infinite', zIndex: 2
            }}>
              <ShoppingBag size={50} color="white" />
            </div>
            <div style={{
              position: 'absolute', top: '-16px', right: 'calc(50% - 72px)',
              width: '38px', height: '38px', borderRadius: '11px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              border: '1.5px solid rgba(255,255,255,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'buyerIconFloat 2.4s ease-in-out infinite 0.5s',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
            }}>
              <Sparkles size={19} color="white" />
            </div>
            <div style={{
              position: 'absolute', bottom: '-10px', left: 'calc(50% - 74px)',
              width: '34px', height: '34px', borderRadius: '10px',
              backgroundColor: 'rgba(255,255,255,0.25)',
              border: '1.5px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'buyerIconFloat 2.8s ease-in-out infinite 1s',
              boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
            }}>
              <Star size={16} color="white" />
            </div>
            <div style={{
              position: 'absolute', top: '10px', left: 'calc(50% - 80px)',
              width: '30px', height: '30px', borderRadius: '9px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: '1.5px solid rgba(255,255,255,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'buyerIconFloat 3.3s ease-in-out infinite 1.6s',
            }}>
              <Shield size={14} color="white" />
            </div>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: '32px', color: '#FFFFFF',
            fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '12px', lineHeight: 1.2
          }}>
            Shop Mindfully
          </h2>
          <p style={{
            fontSize: '15px', color: 'rgba(255,255,255,0.82)',
            lineHeight: 1.7, maxWidth: '280px', margin: '0 auto 36px'
          }}>
            Discover curated artisan products with AI-powered guidance from Aria.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start', maxWidth: '300px', margin: '0 auto' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                backgroundColor: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '11px', padding: '9px 14px', color: '#FFFFFF',
                fontSize: '13.5px', fontWeight: 500, width: '100%',
                animation: mounted ? `buyerFeatureIn 0.5s ${0.3 + i * 0.07}s cubic-bezier(0.16, 1, 0.3, 1) both` : 'none',
              }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '28px', height: '28px', borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.28)', flexShrink: 0
                }}>{f.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '12.5px' }}>{f.title}</div>
                  <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.72)', marginTop: '1px' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right login panel (warm cream with coral accents) ─── */}
      <div 
        className="buyer-right-panel"
        style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(32px, 5vw, 60px) clamp(16px, 4vw, 40px)', position: 'relative', overflowY: 'auto',
          backgroundColor: '#FFFAF8',
          animation: mounted ? 'buyerFormIn 0.6s 0.08s cubic-bezier(0.16, 1, 0.3, 1) both' : 'none',
        }}
      >
        {/* Subtle coral tint background blobs */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: `radial-gradient(circle, ${CORAL}0D 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', left: '-40px',
          width: '220px', height: '220px', borderRadius: '50%',
          background: `radial-gradient(circle, ${CORAL}08 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* Back button */}
        <button
          onClick={onBack}
          className="auth-back-button"
          style={{
            position: 'absolute', top: '24px', left: '24px',
            display: 'flex', alignItems: 'center', gap: '6px',
            color: 'var(--ink-secondary)', fontSize: '13px', fontWeight: 500,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 12px', borderRadius: '8px', transition: 'all 0.15s ease',
            zIndex: 10
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${CORAL}14`; e.currentTarget.style.color = CORAL_DARK; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--ink-secondary)'; }}
        >
          <ArrowLeft size={15} />
          <span>Back to role selection</span>
        </button>

        <div style={{ width: '100%', maxWidth: '380px', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: '36px', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '60px', height: '60px', borderRadius: '18px',
              background: `linear-gradient(135deg, ${CORAL} 0%, ${CORAL_DARK} 100%)`,
              marginBottom: '18px',
              boxShadow: `0 10px 28px ${CORAL}45`,
              animation: 'buyerPulseRing 2.5s infinite'
            }}>
              <ShoppingBag size={28} color="white" />
            </div>

            {/* Buyer badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: `${CORAL}15`, border: `1px solid ${CORAL_BORDER}`,
              borderRadius: '9999px', padding: '4px 12px', marginBottom: '14px',
              fontSize: '11.5px', fontWeight: 700, color: CORAL_DARK, letterSpacing: '0.04em'
            }}>
              <span>🛒</span> BUYER PORTAL
            </div>

            <h1 style={{
              fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600,
              color: 'var(--ink)', letterSpacing: '-0.025em', marginBottom: '8px', display: 'block'
            }}>
              Welcome, Buyer
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--ink-secondary)', lineHeight: 1.55 }}>
              Sign in to access your personalized Cairn shopping experience.
            </p>
          </div>

          {/* Error */}
          {authError && (
            <div style={{
              backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '12px',
              padding: '12px 14px', marginBottom: '20px', fontSize: '13px', color: '#B91C1C',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Shield size={15} style={{ flexShrink: 0 }} />
              {authError}
            </div>
          )}

          {/* Google Sign-In card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: `1px solid ${CORAL_BORDER}`,
            borderRadius: '20px', padding: '28px 24px',
            boxShadow: `0 4px 24px ${CORAL}10, 0 1px 4px rgba(0,0,0,0.04)`,
            marginBottom: '16px'
          }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '16px', textAlign: 'center' }}>
              Sign in with Google
            </p>
            <GoogleSignInButton
              clientId={clientId}
              onSuccess={handleSuccess}
              onError={handleError}
              demoMode={true}
              role="buyer"
              width={332}
            />
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0', color: 'var(--ink-muted)', fontSize: '12px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: CORAL_BORDER }} />
            <span>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: CORAL_BORDER }} />
          </div>

          {/* Guest */}
          <button
            onClick={handleGuestContinue}
            disabled={guestLoading}
            style={{
              width: '100%',
              backgroundColor: guestLoading ? '#FFF0ED' : 'transparent',
              border: `1.5px dashed ${CORAL_BORDER}`,
              borderRadius: '14px', padding: '14px 20px',
              fontSize: '14px', fontWeight: 600, color: 'var(--ink-secondary)',
              cursor: guestLoading ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', transition: 'all 0.2s ease', marginBottom: '24px'
            }}
            onMouseEnter={e => { if (!guestLoading) { e.currentTarget.style.borderColor = CORAL; e.currentTarget.style.backgroundColor = `${CORAL}0A`; e.currentTarget.style.color = CORAL_DARK; } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = CORAL_BORDER; e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--ink-secondary)'; }}
          >
            <User size={16} />
            {guestLoading ? 'Setting up guest session…' : 'Continue as Guest'}
          </button>

          {/* Trust note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <CheckCircle2 size={13} color="#22C55E" />
            <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
              Secure · No password required · Powered by Google OAuth 2.0
            </span>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 700px) { .buyer-left-panel { display: none !important; } .buyer-right-panel { padding: 32px 20px !important; } .buyer-login-container { flex-direction: column !important; } }`}</style>
    </div>
  );
}
