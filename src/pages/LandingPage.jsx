import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Shield,
  Zap,
  Star,
  Package,
  ArrowRight,
  Store,
  BarChart3,
  Layers,
  Lock,
} from 'lucide-react';
import { Button, Card } from '../components/ui';

const KEYFRAMES = `
@keyframes floatBlob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -40px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.97); }
}
@keyframes floatBlobAlt {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-25px, 35px) scale(1.03); }
  66% { transform: translate(20px, -25px) scale(0.98); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeUpDelayed {
  0%, 20% { opacity: 0; transform: translateY(24px); }
  100%     { opacity: 1; transform: translateY(0); }
}
@keyframes pulseDot {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50%      { opacity: 0.8; transform: scale(1.4); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes rippleExpand {
  0%   { transform: scale(0); opacity: 0.9; }
  100% { transform: scale(7); opacity: 0; }
}
@keyframes flashFill {
  0%   { opacity: 0; }
  15%  { opacity: 1; }
  100% { opacity: 1; }
}
@keyframes rotateSlowly {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50%      { transform: scale(1.15); opacity: 1; box-shadow: 0 0 16px #34D399, 0 0 32px #34D39966; }
}
@keyframes featureSlide {
  from { opacity: 0; transform: translateX(6px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes glowPulse {
  0%, 100% { filter: brightness(1) drop-shadow(0 0 20px rgba(255,255,255,0.1)); }
  50% { filter: brightness(1.1) drop-shadow(0 0 30px rgba(255,255,255,0.2)); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
@keyframes borderGlow {
  0%, 100% { border-color: rgba(255,255,255,0.35); }
  50% { border-color: rgba(255,255,255,0.6); }
}
`;

function FloatingDot({ style }) {
  return (
    <div style={{
      position: 'absolute',
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255,255,255,0.45)',
      animation: `pulseDot ${2.5 + Math.random() * 2}s ease-in-out infinite`,
      ...style
    }} />
  );
}

const BUYER_FEATURES = [
  { icon: <Sparkles size={13} />, text: 'AI shopping assistant Aria' },
  { icon: <Shield size={13} />, text: 'Smart approval rules' },
  { icon: <Package size={13} />, text: 'Real-time order tracking' },
  { icon: <Zap size={13} />, text: 'Instant checkout flow' },
  { icon: <Star size={13} />, text: 'Curated artisan products' },
];

const MERCHANT_FEATURES = [
  { icon: <Store size={13} />, text: 'Manage inventory & listings' },
  { icon: <BarChart3 size={13} />, text: 'Store health analytics' },
  { icon: <Lock size={13} />, text: 'Escrow & secure payments' },
  { icon: <Layers size={13} />, text: 'Artisan product verification' },
  { icon: <Zap size={13} />, text: 'Fast order fulfillment tools' },
];

// ── Full-screen ripple/flash transition overlay ──────────────────────────────
function RippleTransition({ color, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 750);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Solid fill that fades in */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: color,
        animation: 'flashFill 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      }} />
      {/* First ripple ring */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: '280px', height: '280px',
        marginTop: '-140px', marginLeft: '-140px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.22)',
        animation: 'rippleExpand 0.75s cubic-bezier(0.0, 0.0, 0.2, 1) forwards',
      }} />
      {/* Second ripple ring */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: '180px', height: '180px',
        marginTop: '-90px', marginLeft: '-90px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.16)',
        animation: 'rippleExpand 0.65s 0.07s cubic-bezier(0.0, 0.0, 0.2, 1) forwards',
      }} />
      {/* Third small ring */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: '80px', height: '80px',
        marginTop: '-40px', marginLeft: '-40px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.3)',
        animation: 'rippleExpand 0.55s 0.04s cubic-bezier(0.0, 0.0, 0.2, 1) forwards',
      }} />
    </div>
  );
}

// ── Role card ────────────────────────────────────────────────────────────────
function RoleCard({ role, title, tagline, emoji, features, accentColor, onSelect, delay }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const isBuyer = role === 'buyer';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={onSelect}
      style={{
        flex: '1 1 320px',
        maxWidth: '440px',
        minWidth: 'min(100%, 300px)',
        backgroundColor: '#FFFFFF',
        backgroundImage: isBuyer 
          ? 'linear-gradient(180deg, #FFFFFF 0%, #FFFBF9 100%)' 
          : 'linear-gradient(180deg, #FFFFFF 0%, #F8FCF9 100%)',
        borderRadius: 'var(--radius-card)',
        padding: 'clamp(28px, 4vw, 36px) clamp(22px, 3.5vw, 32px) clamp(26px, 4vw, 32px)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${hovered ? (isBuyer ? 'var(--coral-border)' : 'var(--forest-green-border)') : 'var(--border-cream)'}`,
        boxShadow: hovered ? 'var(--shadow-warm-lg)' : 'var(--shadow-warm-md)',
        transform: pressed
          ? 'translateY(-1px) scale(0.99)'
          : hovered
            ? 'translateY(-6px)'
            : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        animation: `fadeUp 0.7s ${delay}s cubic-bezier(0.16, 1, 0.3, 1) both`
      }}
    >
      {/* Subtle brand glow orb */}
      <div style={{
        position: 'absolute', width: '220px', height: '220px', borderRadius: '50%',
        background: isBuyer 
          ? 'radial-gradient(circle, rgba(255, 107, 91, 0.08) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(31, 77, 58, 0.08) 0%, transparent 70%)',
        right: '-50px', top: '-50px', pointerEvents: 'none',
        transition: 'all 0.5s ease',
        transform: hovered ? 'scale(1.2)' : 'scale(1)',
      }} />

      {/* Top accent badge with icon */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '64px', height: '64px', borderRadius: 'var(--radius-inner)',
        backgroundColor: isBuyer ? 'var(--coral-light)' : 'var(--forest-green-light)',
        border: `1px solid ${isBuyer ? 'var(--coral-border)' : 'var(--forest-green-border)'}`,
        fontSize: '30px', marginBottom: '20px',
        boxShadow: 'var(--shadow-warm-sm)',
        transition: 'all 0.3s ease',
        transform: hovered ? 'scale(1.06)' : 'scale(1)'
      }}>
        {emoji}
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-block',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: isBuyer ? 'var(--coral-dark)' : 'var(--forest-green)',
          marginBottom: '6px'
        }}>
          {isBuyer ? 'SHOPPER EXPERIENCE' : 'ARTISAN STUDIO'}
        </div>

        <h3 style={{
          fontFamily: 'var(--font-serif)', 
          fontSize: '26px', 
          fontWeight: 600,
          color: 'var(--ink)', 
          marginBottom: '8px', 
          letterSpacing: '-0.025em',
          lineHeight: 1.2
        }}>
          {title}
        </h3>
        
        <p style={{
          fontSize: '14.5px', 
          color: 'var(--ink-secondary)', 
          marginBottom: '24px',
          lineHeight: 1.6, 
          fontWeight: 400
        }}>
          {tagline}
        </p>

        {/* Features list */}
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {features.map((f, i) => (
            <li key={i} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              fontSize: '13.5px', color: 'var(--ink)', fontWeight: 500
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '26px', height: '26px', borderRadius: '8px',
                backgroundColor: isBuyer ? 'var(--coral-light)' : 'var(--forest-green-light)', 
                color: isBuyer ? 'var(--coral-dark)' : 'var(--forest-green)',
                flexShrink: 0,
                border: `1px solid ${isBuyer ? 'var(--coral-border)' : 'var(--forest-green-border)'}`
              }}>{f.icon}</span>
              <span>{f.text}</span>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <Button
          fullWidth
          size="md"
          variant={isBuyer ? 'danger' : 'primary'}
          icon={isBuyer ? <ShoppingBag size={17} /> : <Store size={17} />}
          iconPosition="left"
          style={{
            padding: '14px 24px',
            fontSize: '15px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: isBuyer ? 'var(--coral)' : 'var(--forest-green)',
            boxShadow: isBuyer 
              ? '0 2px 8px rgba(255, 107, 91, 0.25)' 
              : '0 2px 8px rgba(31, 77, 58, 0.22)'
          }}
        >
          <span>Continue as {isBuyer ? 'Buyer' : 'Merchant'}</span>
          <ArrowRight size={15} style={{
            marginLeft: '4px', 
            transition: 'transform 0.2s ease',
            transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          }} />
        </Button>
      </div>
    </div>
  );
}

// ── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage({ onSelectBuyer, onSelectMerchant }) {
  const [loaded, setLoaded] = useState(false);
  const [ripple, setRipple] = useState(null); // null | 'buyer' | 'merchant'

  useEffect(() => { requestAnimationFrame(() => setLoaded(true)); }, []);

  const handleBuyerClick = () => { setRipple('buyer'); };
  const handleMerchantClick = () => { setRipple('merchant'); };

  const handleRippleDone = () => {
    const r = ripple;
    setRipple(null);
    if (r === 'buyer') onSelectBuyer();
    else onSelectMerchant();
  };

  return (
    <div style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      background: 'var(--bg-cream)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px'
    }}>
      <style>{KEYFRAMES}</style>

      {/* Ripple transition overlay */}
      {ripple && (
        <RippleTransition
          color={ripple === 'buyer' ? '#FF6B5B' : '#1F4D3A'}
          onDone={handleRippleDone}
        />
      )}

      {/* Rotating decorative rings */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: '900px', height: '900px', marginTop: '-450px', marginLeft: '-450px',
        borderRadius: '50%', border: '1px solid rgba(31, 77, 58, 0.04)',
        animation: 'rotateSlowly 70s linear infinite', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: '650px', height: '650px', marginTop: '-325px', marginLeft: '-325px',
        borderRadius: '50%', border: '1px solid rgba(31, 77, 58, 0.06)',
        animation: 'rotateSlowly 50s linear infinite reverse', pointerEvents: 'none',
      }} />

      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: '-120px', left: '-100px',
        width: '540px', height: '540px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(31, 77, 58, 0.08) 0%, rgba(31, 77, 58, 0.02) 60%, transparent 80%)',
        animation: 'floatBlob 14s ease-in-out infinite', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-140px', right: '-120px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(31, 77, 58, 0.06) 0%, rgba(31, 77, 58, 0.02) 60%, transparent 80%)',
        animation: 'floatBlobAlt 18s ease-in-out infinite', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '60%',
        width: '340px', height: '340px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 233, 168, 0.08) 0%, transparent 70%)',
        animation: 'floatBlob 22s ease-in-out infinite 4s', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', top: '18%', right: '8%',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(31, 77, 58, 0.05) 0%, transparent 70%)',
        animation: 'floatBlobAlt 16s ease-in-out infinite 2s', pointerEvents: 'none'
      }} />

      {/* Floating dots */}
      {[
        { top: '12%', left: '8%' }, { top: '25%', left: '18%' }, { top: '70%', left: '5%' },
        { top: '85%', left: '20%' }, { top: '8%', right: '15%' }, { top: '45%', right: '8%' },
        { top: '78%', right: '18%' }, { top: '35%', left: '45%' }, { top: '60%', right: '40%' },
        { top: '90%', left: '55%' }, { top: '15%', right: '35%' }, { top: '50%', left: '12%' }
      ].map((pos, i) => (
        <FloatingDot key={i} style={{ ...pos, animationDelay: `${i * 0.4}s`, backgroundColor: 'rgba(31, 77, 58, 0.25)' }} />
      ))}

      {/* Hero */}
      <div style={{
        position: 'relative', zIndex: 1, textAlign: 'center',
        maxWidth: '800px', width: '100%', marginBottom: '48px',
        animation: loaded ? 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both' : 'none'
      }}>
        {/* Badge with Homepage styling */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          backgroundColor: 'var(--forest-green-light)',
          border: '1px solid var(--forest-green-border)',
          borderRadius: 'var(--radius-pill)', padding: '7px 18px', marginBottom: '24px',
          color: 'var(--forest-green)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em',
          boxShadow: 'var(--shadow-warm-sm)'
        }}>
          <Sparkles size={14} color="var(--forest-green)" />
          <span>MINDFUL COMMERCE WITH ARIA</span>
        </div>

        {/* Wordmark with Cairn brand identity */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <svg 
            width={44} 
            height={44} 
            viewBox="0 0 64 64" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0 4px 10px rgba(31, 77, 58, 0.12))' }}
          >
            <ellipse cx="32" cy="50" rx="24" ry="9.5" fill="#1F4D3A" />
            <ellipse cx="33" cy="35" rx="17" ry="7.8" fill="#2E6B52" />
            <ellipse cx="31" cy="22" rx="11" ry="6.2" fill="#4B8C70" />
            <ellipse cx="32" cy="11" rx="5.5" ry="3.8" fill="#D97706" />
          </svg>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(52px, 9vw, 84px)',
            fontWeight: 600,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: 'var(--ink)'
          }}>
            cairn
          </h1>
        </div>

        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 19px)', color: 'var(--ink-secondary)',
          lineHeight: 1.65, maxWidth: '540px', margin: '0 auto', fontWeight: 400,
          letterSpacing: '-0.01em'
        }}>
          Where mindful shopping meets artisan craftsmanship.<br />
          Choose your experience to begin.
        </p>
      </div>

      {/* Role cards */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', gap: '28px', flexWrap: 'wrap',
        justifyContent: 'center', width: '100%', maxWidth: '960px'
      }}>
        <RoleCard
          role="buyer"
          title="Shop as Buyer"
          tagline="Explore curated products with AI guidance, approval rules, and seamless checkout."
          emoji="🛒"
          features={BUYER_FEATURES}
          accentColor="var(--coral)"
          onSelect={handleBuyerClick}
          delay={0.12}
        />
        <RoleCard
          role="merchant"
          title="Sell as Merchant"
          tagline="Manage your artisan store, track inventory, view analytics, and grow your business."
          emoji="🏪"
          features={MERCHANT_FEATURES}
          accentColor="var(--forest-green)"
          onSelect={handleMerchantClick}
          delay={0.22}
        />
      </div>

      {/* Footer */}
      <div style={{
        position: 'relative', zIndex: 1, marginTop: '48px', textAlign: 'center',
        animation: 'fadeUpDelayed 1.2s cubic-bezier(0.16, 1, 0.3, 1) both'
      }}>
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', fontWeight: 400 }}>
          <Shield size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px', color: 'var(--forest-green)' }} />
          OAuth 2.0 secured · No passwords stored · Your data stays yours
        </p>
      </div>
    </div>
  );
}
