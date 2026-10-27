import React, { useState } from 'react';
import { 
  Mic, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Ban, 
  CheckCircle2, 
  ShoppingBag,
  MapPin,
  Award
} from 'lucide-react';
import { PICKED_PRODUCTS } from '../data/mockData';

export default function Screen1_Home({
  onAskAria,
  onNavigateToScreen,
  onQuickOrder,
  onShowToast: _onShowToast,
  currentUser,
  currentLocation,
  rules
}) {
  const [promptInput, setPromptInput] = useState('');
  const userName = currentUser ? currentUser.name.split(' ')[0] : 'Priya';

  const quickPrompts = [
    "Find me a quiet study laptop under ₹60,000",
    "Linen sheets for guest room",
    "Restock roasted coffee beans"
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!promptInput.trim()) return;
    onAskAria(promptInput);
  };

  return (
    <div className="home-screen-wrap animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '48px 24px 36px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          {/* Left Hero Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--forest-green-light)',
                color: 'var(--forest-green)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12.5px',
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}>
                <Sparkles size={14} />
                <span>MINDFUL COMMERCE WITH ARIA</span>
              </div>

              {currentLocation && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--ink)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12px',
                  fontWeight: 500,
                  border: currentLocation.isLiveGPS ? '1.5px solid #86EFAC' : '1px solid var(--border-cream)',
                  boxShadow: 'var(--shadow-warm-sm)'
                }}>
                  <MapPin size={12} color="var(--forest-green)" />
                  <span style={{ color: 'var(--forest-green)', fontWeight: 700 }}>
                    ⚡ {currentLocation.deliveryTime || '15 mins'}
                  </span>
                  <span style={{ color: 'var(--ink-muted)' }}>•</span>
                  <span>{currentLocation.city}</span>
                </div>
              )}
            </div>

            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.6rem, 5.2vw, 3.8rem)',
              lineHeight: 1.1,
              fontWeight: 500,
              color: 'var(--ink)',
              marginBottom: '18px',
              letterSpacing: '-0.03em'
            }}>
              Shop by just <span style={{ fontStyle: 'italic', fontWeight: 400 }}>saying it{currentUser ? `, ${currentUser.name.split(' ')[0]}` : ''}.</span>
            </h1>

            <p style={{
              fontSize: '18px',
              color: 'var(--ink-secondary)',
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '520px'
            }}>
              Aria finds, checks, and orders what you love — always strictly held within your personal budget limits.
            </p>

            {/* Large Rounded Prompt Input */}
            <form 
              onSubmit={handleSubmit}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '32px',
                border: '1.5px solid var(--border-cream)',
                boxShadow: 'var(--shadow-warm-md)',
                padding: '8px 8px 8px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '18px',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              className="cairn-hero-input-box"
            >
              <Mic size={20} color="var(--forest-green)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="What do you need today?"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '17px',
                  backgroundColor: 'transparent',
                  color: 'var(--ink)'
                }}
              />
              <button
                type="submit"
                className="pill-button-primary"
                style={{ padding: '12px 22px' }}
              >
                <span>Ask Aria</span>
                <ArrowRight size={15} />
              </button>
            </form>

            {/* Quick Prompt Pills */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--ink-muted)', fontWeight: 500 }}>Try:</span>
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setPromptInput(prompt);
                    onAskAria(prompt);
                  }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-cream)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '6px 14px',
                    fontSize: '13px',
                    color: 'var(--ink)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--forest-green-border)';
                    e.currentTarget.style.backgroundColor = 'var(--forest-green-light)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-cream)';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Right Hero Lifestyle Photography */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-warm-lg)',
              border: '1px solid var(--border-cream)',
              position: 'relative'
            }}>
              <img
                src="/assets/hero_shopper.jpg"
                alt="Person relaxing with coffee and package"
                style={{
                  width: '100%',
                  height: '460px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              {/* Overlay card in bottom corner */}
              <div style={{
                position: 'absolute',
                bottom: '18px',
                left: '18px',
                right: '18px',
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: '18px',
                padding: '14px 18px',
                border: '1px solid var(--border-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-warm-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--forest-green-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--forest-green)'
                  }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>Delivered Mindfully</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--ink-secondary)' }}>1 parcel consolidated · Zero rush</div>
                  </div>
                </div>
                <span className="badge-review" style={{ fontSize: '11px', padding: '3px 10px' }}>
                  VERIFIED
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reassurance Banner: Aria never spends past your rules */}
      <section style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '0 24px 44px'
      }}>
        <div style={{
          backgroundColor: '#FAF6EE',
          borderRadius: '24px',
          border: '1px solid var(--border-cream)',
          padding: '28px 32px',
          boxShadow: 'var(--shadow-warm-sm)'
        }}>
          {/* Header Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: '4px' }}>
                DETERMINISTIC SAFETY
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600, color: 'var(--ink)' }}>
                Nice choice, {userName}. Aria never spends past your rules.
              </h2>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-cream)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '13px',
              fontWeight: 500
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span>Active Rule Profile: {rules?.activeProfile || `${userName}'s Calm Home`}</span>
            </div>
          </div>

          {/* 3 Large Reassurance Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '18px'
          }}>
            {/* Card 1: Deterministic Caps */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid var(--border-cream)',
              boxShadow: 'var(--shadow-warm-sm)'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'var(--forest-green-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--forest-green)',
                marginBottom: '16px'
              }}>
                <ShieldCheck size={22} />
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '19px', fontWeight: 600, marginBottom: '8px', color: 'var(--ink)' }}>
                Deterministic caps
              </div>
              <p style={{ fontSize: '14.5px', color: 'var(--ink-secondary)', lineHeight: 1.55, marginBottom: '16px' }}>
                Not even a ₹1 overrun. Aria cancels checkout instantly if taxes, duties, or hidden surge fees breach your limits.
              </p>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--forest-green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} />
                <span>Hard limits enforced</span>
              </div>
            </div>

            {/* Card 2: 15-Minute Hold */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid var(--border-cream)',
              boxShadow: 'var(--shadow-warm-sm)'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'var(--butter-yellow-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--butter-yellow-dark)',
                marginBottom: '16px'
              }}>
                <Clock size={22} />
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '19px', fontWeight: 600, marginBottom: '8px', color: 'var(--ink)' }}>
                15-minute peace-of-mind hold
              </div>
              <p style={{ fontSize: '14.5px', color: 'var(--ink-secondary)', lineHeight: 1.55, marginBottom: '16px' }}>
                Every checkout stays on hold for 15 tranquil minutes. No panic buttons or race-against-the-clock countdown timers.
              </p>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--butter-yellow-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} />
                <span>One-click cancellation window</span>
              </div>
            </div>

            {/* Card 3: Zero Dark Patterns */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid var(--border-cream)',
              boxShadow: 'var(--shadow-warm-sm)'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'var(--coral-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--coral-dark)',
                marginBottom: '16px'
              }}>
                <Ban size={22} />
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '19px', fontWeight: 600, marginBottom: '8px', color: 'var(--ink)' }}>
                Zero dark patterns
              </div>
              <p style={{ fontSize: '14.5px', color: 'var(--ink-secondary)', lineHeight: 1.55, marginBottom: '16px' }}>
                No fake scarcity banners ("Only 2 left!"), automated surge price gouging, or algorithmic dopamine loops.
              </p>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--coral-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} />
                <span>Guaranteed clean catalog</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Picked for You Section */}
      <section style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '0 24px 48px'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--forest-green)' }} />
            INTENT-LED SUGGESTIONS
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 500, color: 'var(--ink)' }}>
              Picked for you
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
              Filtered by your hardware longevity rule and weekly living allowances. Never sponsored.
            </div>
          </div>
        </div>

        {/* 3 Large Product Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {PICKED_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="cairn-card cairn-card-hover"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Product Image with Tag */}
                <div style={{
                  position: 'relative',
                  height: '240px',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  backgroundColor: '#F5EFE6'
                }}>
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Top Tag */}
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    {prod.tagType === 'placed' && (
                      <span className="badge-placed" style={{ backgroundColor: 'rgba(234, 247, 238, 0.95)' }}>
                        <CheckCircle2 size={12} />
                        {prod.tag}
                      </span>
                    )}
                    {prod.tagType === 'review' && (
                      <span className="badge-review" style={{ backgroundColor: 'rgba(254, 243, 199, 0.95)' }}>
                        {prod.tag}
                      </span>
                    )}
                    {prod.tagType === 'neutral' && (
                      <span className="badge-neutral" style={{ backgroundColor: 'rgba(244, 239, 230, 0.95)' }}>
                        {prod.tag}
                      </span>
                    )}
                  </div>
                  {/* Corner Badge */}
                  {prod.badge && (
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(27, 27, 24, 0.8)',
                      color: '#FFFFFF',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      padding: '4px 10px',
                      borderRadius: '8px'
                    }}>
                      {prod.badge}
                    </div>
                  )}
                </div>

                {/* Name & Price */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: 'var(--ink)' }}>
                    {prod.name}
                  </h3>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>
                    ₹{prod.price.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Specs */}
                <div style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginBottom: '12px' }}>
                  {prod.specs}
                </div>

                {/* Rationale Quote */}
                <div style={{
                  backgroundColor: 'var(--bg-cream-subtle)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '12.5px',
                  color: 'var(--ink-secondary)',
                  marginBottom: '20px',
                  border: '1px solid var(--border-cream-subtle)'
                }}>
                  {prod.rationale}
                </div>
              </div>

              {/* Action */}
              <button
                className="pill-button-primary"
                style={{ width: '100%', padding: '12px', fontSize: '14px' }}
                onClick={() => onQuickOrder(prod)}
              >
                <span>Ask Aria to order</span>
                <ShoppingBag size={15} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Signature Guarantee Explainer Banner */}
      <section style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid var(--border-cream)',
          padding: '32px',
          boxShadow: 'var(--shadow-warm-md)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '4px' }}>
                THE CAIRN GUARANTEE
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600 }}>
                Every order gets a three-stamp guarantee before any money moves.
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-secondary)', maxWidth: '640px', marginTop: '6px' }}>
                When you ask Aria to order, we generate a tangible Trust Receipt. It runs 12 verification checks—from price tracking histories to your preset monthly caps—before authorization.
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="receipt-hash-code" style={{ marginBottom: '4px' }}>
                RECEIPT ID FORMAT CRN-2026-0849
              </span>
              <div style={{ fontSize: '12px', color: 'var(--forest-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                <ShieldCheck size={14} />
                <span>100% Deterministic Hold</span>
              </div>
            </div>
          </div>

          {/* Perforated separator */}
          <div className="trust-receipt-perforation" style={{ margin: '16px 0 24px' }}>
            <div className="trust-receipt-dash" />
          </div>

          {/* 3 stamps showcase & button */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'center'
          }}>
            <div className="trust-stamp-card stamp-card-yellow" style={{ padding: '14px' }}>
              <div className="stamp-emblem" style={{ width: '38px', height: '38px', marginBottom: '8px' }}>
                <CheckCircle2 size={18} />
              </div>
              <div className="stamp-name">STAMP 01 · WITHIN BUDGET</div>
              <div className="stamp-desc">Deterministic Cap Verified</div>
            </div>

            <div className="trust-stamp-card stamp-card-green" style={{ padding: '14px' }}>
              <div className="stamp-emblem" style={{ width: '38px', height: '38px', marginBottom: '8px' }}>
                <CheckCircle2 size={18} />
              </div>
              <div className="stamp-name">STAMP 02 · PRE-APPROVED</div>
              <div className="stamp-desc">Under {userName}'s ₹{rules ? rules.approvalThreshold.toLocaleString('en-IN') : '1,00,000'} Cap</div>
            </div>

            <div className="trust-stamp-card stamp-card-green" style={{ padding: '14px' }}>
              <div className="stamp-emblem" style={{ width: '38px', height: '38px', marginBottom: '8px' }}>
                <Award size={18} />
              </div>
              <div className="stamp-name">STAMP 03 · VERIFIED ORIGIN</div>
              <div className="stamp-desc">Authentic & Sustainable</div>
            </div>

            <button
              className="pill-button-secondary"
              onClick={() => onNavigateToScreen('how_aria_works')}
              style={{ padding: '16px 20px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span>Inspect how Aria safeguards you</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
