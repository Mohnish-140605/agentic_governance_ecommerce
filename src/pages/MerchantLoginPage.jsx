import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Store, BarChart3, Layers,
  Lock, Zap, CheckCircle2, TrendingUp, Package
} from 'lucide-react';
import GoogleSignInButton from '../components/GoogleSignInButton';

const KEYFRAMES = `
@keyframes merchantBlobFloat {
  0%, 100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(20px,-28px) scale(1.06); }
  66% { transform: translate(-16px,18px) scale(0.97); }
}
@keyframes merchantBlobAlt {
  0%, 100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(-22px,28px) scale(1.04); }
}
@keyframes merchantFormIn {
  from { opacity:0; transform: translateX(-28px); }
  to   { opacity:1; transform: translateX(0); }
}
@keyframes merchantPanelIn {
  from { opacity:0; transform: translateX(32px) scale(0.97); }
  to   { opacity:1; transform: translateX(0) scale(1); }
}
@keyframes merchantIconFloat {
  0%,100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(4deg); }
}
@keyframes merchantPulseRing {
  0%   { box-shadow: 0 0 0 0 rgba(31,77,58,0.5); }
  70%  { box-shadow: 0 0 0 16px rgba(31,77,58,0); }
  100% { box-shadow: 0 0 0 0 rgba(31,77,58,0); }
}
@keyframes merchantFeatureIn {
  from { opacity:0; transform: translateX(12px); }
  to   { opacity:1; transform: translateX(0); }
}
@keyframes merchantStatIn {
  from { opacity:0; transform:translateY(10px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes merchantRotateSlow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
`;

const FEATURES = [
  { icon: <Store size={15} />, title: 'Artisan Storefront', desc: 'Beautiful product listings & catalog' },
  { icon: <BarChart3 size={15} />, title: 'Store Health Analytics', desc: 'Revenue, conversion & trend metrics' },
  { icon: <Lock size={15} />, title: 'Escrow & Payments', desc: 'Secure hold-and-release transactions' },
  { icon: <Layers size={15} />, title: 'Inventory Management', desc: 'Track stock, variants & reorders' },
  { icon: <Zap size={15} />, title: 'Fast Order Fulfillment', desc: 'Streamlined packaging & dispatch' },
];

const STATS = [
  { label: 'Active Merchants', value: '2,400+' },
  { label: 'Avg. Monthly Revenue', value: '₹84K' },
  { label: 'Products Verified', value: '18K+' },
];

export default function MerchantLoginPage({ onBack, onSignIn }) {
  const [authError, setAuthError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const clientId = import.meta.env?.VITE_GOOGLE_MERCHANT_CLIENT_ID || '';

  const handleSuccess = (user) => { onSignIn({ ...user, role: 'merchant' }); };
  const handleError = (err) => {
    setAuthError(typeof err === 'string' ? err : 'Authentication failed. Please try again.');
  };

  // Forest green design tokens
  const GREEN = '#1F4D3A';
  const GREEN_DARK = '#133226';
  const GREEN_MID = '#2D6B52';
  const GREEN_LIGHT = '#EAF4EE';
  const GREEN_BORDER = '#C8E3D3';

  return (
    <div className="merchant-login-container" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'row',
      backgroundColor: GREEN_LIGHT, overflow: 'hidden'
    }}>
      <style>{KEYFRAMES}</style>

      {/* ─── Left login panel (warm white with green accents) ─── */}
      <div 
        className="merchant-left-panel"
        style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(32px, 5vw, 60px) clamp(16px, 4vw, 40px)', position: 'relative', overflowY: 'auto',
          backgroundColor: '#FAFCFB',
          animation: mounted ? 'merchantFormIn 0.6s 0.05s cubic-bezier(0.16, 1, 0.3, 1) both' : 'none',
        }}
      >
        {/* Subtle green tint bg blobs */}
        <div style={{
          position: 'absolute', top: '-50px', left: '-50px',
          width: '280px', height: '280px', borderRadius: '50%',
          background: `radial-gradient(circle, ${GREEN}0C 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', right: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: `radial-gradient(circle, ${GREEN}08 0%, transparent 70%)`,
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
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${GREEN}12`; e.currentTarget.style.color = GREEN; }}
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
              background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_MID} 100%)`,
              marginBottom: '18px',
              boxShadow: `0 10px 28px ${GREEN}45`,
              animation: 'merchantPulseRing 2.5s infinite'
            }}>
              <Store size={28} color="white" />
            </div>

            {/* Merchant badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: GREEN_LIGHT, border: `1px solid ${GREEN_BORDER}`,
              borderRadius: '9999px', padding: '4px 12px', marginBottom: '14px',
              fontSize: '11.5px', fontWeight: 700, color: GREEN, letterSpacing: '0.04em'
            }}>
              <span>🌿</span> MERCHANT STUDIO
            </div>

            <h1 style={{
              fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600,
              color: 'var(--ink)', letterSpacing: '-0.025em', marginBottom: '8px', display: 'block'
            }}>
              Merchant Portal
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--ink-secondary)', lineHeight: 1.55 }}>
              Sign in to manage your artisan store, track orders, and grow your business on Cairn.
            </p>
          </div>

          {/* Error */}
          {authError && (
            <div style={{
              backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '12px',
              padding: '12px 14px', marginBottom: '20px', fontSize: '13px', color: '#B91C1C',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Lock size={15} style={{ flexShrink: 0 }} />
              {authError}
            </div>
          )}

          {/* Google Sign-In card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: `1px solid ${GREEN_BORDER}`,
            borderRadius: '20px', padding: '28px 24px',
            boxShadow: `0 4px 24px ${GREEN}0E, 0 1px 4px rgba(0,0,0,0.04)`,
            marginBottom: '20px'
          }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '16px', textAlign: 'center' }}>
              Sign in with your Google Workspace account
            </p>
            <GoogleSignInButton
              clientId={clientId}
              onSuccess={handleSuccess}
              onError={handleError}
              demoMode={true}
              role="merchant"
              width={332}
            />
          </div>

          {/* Security badges */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '16px', flexWrap: 'wrap'
          }}>
            {['OAuth 2.0 Secured', 'Merchant Verified', 'Data Encrypted'].map((badge, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: '11.5px', color: GREEN, fontWeight: 600
              }}>
                <CheckCircle2 size={12} />
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right illustration panel (forest green) ─── */}
      <div
        className="merchant-right-panel"
        style={{
          flex: '0 0 48%', position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '60px 48px',
          background: `linear-gradient(155deg, #0D2318 0%, ${GREEN} 40%, ${GREEN_MID} 75%, #3A8569 100%)`,
          animation: mounted ? 'merchantPanelIn 0.65s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both' : 'none',
        }}
      >
        {/* Background blobs */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(100,200,140,0.22) 0%, transparent 70%)',
          animation: 'merchantBlobFloat 12s ease-in-out infinite', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-120px', left: '-80px',
          width: '440px', height: '440px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,233,168,0.13) 0%, transparent 70%)',
          animation: 'merchantBlobAlt 16s ease-in-out infinite', pointerEvents: 'none'
        }} />
        {/* Rotating ring */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '460px', height: '460px',
          marginTop: '-230px', marginLeft: '-230px',
          borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)',
          animation: 'merchantRotateSlow 35s linear infinite', pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '340px' }}>
          {/* Icon cluster */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '100px', height: '100px', borderRadius: '30px',
                backgroundColor: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                border: '2px solid rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
                animation: 'merchantIconFloat 3.5s ease-in-out infinite'
              }}>
                <Store size={50} color="white" />
              </div>
              <div style={{
                position: 'absolute', top: '-18px', right: '-18px',
                width: '38px', height: '38px', borderRadius: '11px',
                backgroundColor: 'rgba(255,233,168,0.28)',
                border: '1.5px solid rgba(255,233,168,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'merchantIconFloat 2.6s ease-in-out infinite 0.8s'
              }}>
                <TrendingUp size={18} color="#FFE9A8" />
              </div>
              <div style={{
                position: 'absolute', bottom: '-14px', left: '-20px',
                width: '34px', height: '34px', borderRadius: '10px',
                backgroundColor: 'rgba(100,200,140,0.28)',
                border: '1.5px solid rgba(100,200,140,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'merchantIconFloat 3s ease-in-out infinite 1.4s'
              }}>
                <Package size={16} color="#86EFAC" />
              </div>
              <div style={{
                position: 'absolute', top: '14px', left: '-22px',
                width: '30px', height: '30px', borderRadius: '9px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'merchantIconFloat 3.8s ease-in-out infinite 2s'
              }}>
                <BarChart3 size={14} color="rgba(255,255,255,0.8)" />
              </div>
            </div>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: '30px', color: '#FFFFFF',
            fontWeight: 600, letterSpacing: '-0.028em', marginBottom: '12px',
            textAlign: 'center', lineHeight: 1.2
          }}>
            Grow Your Artisan Business
          </h2>
          <p style={{
            fontSize: '14.5px', color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.7, textAlign: 'center', marginBottom: '32px'
          }}>
            Powerful tools for independent makers and craft merchants to thrive on Cairn.
          </p>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 80px), 1fr))', gap: '10px', marginBottom: '28px' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '14px', padding: '14px 10px', textAlign: 'center',
                animation: mounted ? `merchantStatIn 0.5s ${0.3 + i * 0.12}s cubic-bezier(0.16,1,0.3,1) both` : 'none',
              }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.58)', marginTop: '3px', lineHeight: 1.3 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                backgroundColor: 'rgba(255,255,255,0.09)',
                backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: '11px', padding: '10px 14px',
                color: 'rgba(255,255,255,0.9)', fontSize: '13.5px',
                animation: mounted ? `merchantFeatureIn 0.5s ${0.45 + i * 0.07}s cubic-bezier(0.16,1,0.3,1) both` : 'none',
              }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '28px', height: '28px', borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.14)', flexShrink: 0, color: '#86EFAC'
                }}>{f.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '12.5px', color: '#FFFFFF' }}>{f.title}</div>
                  <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.58)', marginTop: '1px' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 700px) { .merchant-right-panel { display: none !important; } }`}</style>
    </div>
  );
}
