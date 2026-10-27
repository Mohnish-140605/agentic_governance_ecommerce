import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { CUSTOMER_NAV_SCREENS, SELLER_NAV_SCREENS } from '../data/navigation';
import { PICKED_PRODUCTS, ALTERNATIVE_PRODUCTS } from '../data/mockData';

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectScreen,
  onAskAriaWithPrompt
}) {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allScreens = [...CUSTOMER_NAV_SCREENS, ...SELLER_NAV_SCREENS];
  const allProducts = [...PICKED_PRODUCTS, ...ALTERNATIVE_PRODUCTS];
  const filteredScreens = allScreens.filter(s => 
    s.label.toLowerCase().includes(query.toLowerCase()) || 
    s.subtitle.toLowerCase().includes(query.toLowerCase())
  );
  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    (p.category && p.category.toLowerCase().includes(query.toLowerCase())) ||
    (p.specs && p.specs.toLowerCase().includes(query.toLowerCase()))
  );

  const handleAskAria = () => {
    if (!query.trim()) return;
    onAskAriaWithPrompt(query);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      backgroundColor: 'rgba(27, 27, 24, 0.45)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '80px 20px 20px',
      animation: 'fadeIn 0.2s ease'
    }} onClick={onClose}>
      <div 
        style={{
          width: '100%',
          maxWidth: '640px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid var(--border-cream)',
          boxShadow: 'var(--shadow-warm-float)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-cream)'
        }}>
          <Search size={20} color="var(--forest-green)" />
          <input
            type="text"
            autoFocus
            placeholder="Search screens, products, or ask Aria something..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAskAria();
            }}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '17px',
              color: 'var(--ink)',
              backgroundColor: 'transparent'
            }}
          />
          {query ? (
            <button onClick={() => setQuery('')} style={{ color: 'var(--ink-muted)' }}>
              <X size={18} />
            </button>
          ) : (
            <kbd style={{
              fontSize: '11px',
              color: 'var(--ink-muted)',
              backgroundColor: 'var(--bg-cream-subtle)',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid var(--border-cream)'
            }}>ESC</kbd>
          )}
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '16px 20px' }}>
          {query.trim() && (
            <div style={{ marginBottom: '16px' }}>
              <button
                onClick={handleAskAria}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--forest-green-light)',
                  border: '1px solid var(--forest-green-border)',
                  color: 'var(--forest-green)',
                  fontWeight: 600,
                  fontSize: '15px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={18} />
                  <span>Ask Aria: "{query}"</span>
                </div>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Quick Navigate Screens */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '8px' }}>
              Navigate to Screen
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '6px' }}>
              {filteredScreens.slice(0, 6).map((screen) => (
                <button
                  key={screen.id}
                  onClick={() => {
                    onSelectScreen(screen.id);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-cream-subtle)',
                    border: '1px solid transparent',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--forest-green-border)';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.backgroundColor = 'var(--bg-cream-subtle)';
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{screen.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{screen.subtitle}</div>
                  </div>
                  <ArrowRight size={14} color="var(--ink-muted)" />
                </button>
              ))}
            </div>
          </div>

          {/* Filtered Products */}
          {filteredProducts.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '8px' }}>
                Curated Catalog Items
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filteredProducts.slice(0, 3).map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onAskAriaWithPrompt(`Could you check if I can order the ${prod.name}?`);
                      onClose();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-cream)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{prod.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--forest-green)', fontWeight: 600 }}>₹{prod.price.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                    <span className="badge-neutral" style={{ fontSize: '11px' }}>Ask Aria</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
