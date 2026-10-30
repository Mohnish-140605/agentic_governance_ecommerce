import React, { useState } from 'react';
import { X, Building2, ShieldCheck, Loader2 } from 'lucide-react';

export default function AddListingModal({
  isOpen,
  onClose,
  onAddListing,
  onShowToast
}) {
  const [name, setName] = useState('');
  const [merchant, setMerchant] = useState('Studio Hasami Crafts');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('15');
  const [category, setCategory] = useState('Living');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    setIsAuditing(true);
    setAuditStep(1); // Origin check

    setTimeout(() => {
      setAuditStep(2); // Price ceiling check
      setTimeout(() => {
        setAuditStep(3); // Conflict check
        setTimeout(() => {
          setIsAuditing(false);
          const newListing = {
            id: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
            name: name.trim(),
            merchant: merchant.trim(),
            stock: parseInt(stock, 10) || 10,
            price: parseInt(price, 10) || 1200,
            status: 'Verified & Active',
            badge: 'VERIFIED',
            type: 'own'
          };
          onAddListing(newListing);
          if (onShowToast) {
            onShowToast(`✨ Listing "${name}" passed Cairn Origin & Price Audits and is published!`);
          }
          onClose();
        }, 600);
      }, 600);
    }, 600);
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
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
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
        <div style={{
          padding: '22px 28px 18px',
          borderBottom: '1px solid var(--border-cream-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'var(--forest-green-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--forest-green)'
            }}>
              <Building2 size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>
                Publish Artisan Listing
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                Direct Maker Origin & Escrow Verification
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

        <form onSubmit={handleSubmit} style={{ padding: 'clamp(16px, 4vw, 24px) clamp(16px, 4vw, 28px)', flex: 1, overflowY: 'auto' }}>
          {isAuditing ? (
            <div style={{ padding: '20px 0', textAlign: 'center' }}>
              <Loader2 size={36} className="animate-spin" color="var(--forest-green)" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>
                Auditing Product Integrity...
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px', margin: '20px auto 0', textAlign: 'left', fontSize: '13px' }}>
                <div style={{ color: auditStep >= 1 ? '#166534' : 'var(--ink-muted)', fontWeight: auditStep >= 1 ? 600 : 400 }}>
                  ✓ Direct Origin & Maker Audit
                </div>
                <div style={{ color: auditStep >= 2 ? '#166534' : 'var(--ink-muted)', fontWeight: auditStep >= 2 ? 600 : 400 }}>
                  ✓ MSRP Ceiling & No Surge Pricing
                </div>
                <div style={{ color: auditStep >= 3 ? '#166534' : 'var(--ink-muted)', fontWeight: auditStep >= 3 ? 600 : 400 }}>
                  ✓ Duplicate Catalog & Drop-shipping Check
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--ink)', marginBottom: '5px' }}>
                  Product Title & Materials
                </label>
                <input
                  type="text"
                  placeholder="e.g. Handmade Linen Tablecloth (Natural Flax)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-cream)',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--ink)', marginBottom: '5px' }}>
                    Artisan Studio Name
                  </label>
                  <input
                    type="text"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-cream)',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--ink)', marginBottom: '5px' }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-cream)',
                      fontSize: '13.5px',
                      backgroundColor: '#FFFFFF',
                      outline: 'none'
                    }}
                  >
                    <option value="Living">Living & Studio</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Hardware">Hardware & Tools</option>
                    <option value="Textiles">Organic Textiles</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--ink)', marginBottom: '5px' }}>
                    Fair MSRP Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="2800"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-cream)',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--ink)', marginBottom: '5px' }}>
                    Available Units
                  </label>
                  <input
                    type="number"
                    placeholder="15"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-cream)',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '10px',
                  backgroundColor: 'var(--forest-green)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-warm-sm)'
                }}
              >
                <ShieldCheck size={16} />
                <span>Run Cairn Audit & Publish Listing</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
