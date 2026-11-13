import React, { useState } from 'react';
import { X, Building2, ShieldCheck, Loader2 } from 'lucide-react';
import { createListing } from '../services/api';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmissionError(null);
    setIsSubmitting(true);

    try {
      const newListing = {
        name: name.trim(),
        merchant: merchant.trim(),
        stock: Number(stock),
        price: Number(price),
        category
      };
      const response = await createListing(newListing);
      if (response?.status !== 'SUCCESS' || !response.listing) {
        throw new Error('The backend did not confirm publication.');
      }

      onAddListing(response.listing);
      onShowToast?.(response.message || `Listing "${response.listing.name}" was published.`);
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected publishing error.';
      setSubmissionError(`Not published: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
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
                Backend governance review and audit
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
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
          {submissionError && (
            <div role="alert" style={{
              marginBottom: '14px',
              padding: '10px 12px',
              borderRadius: '10px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#B91C1C',
              fontSize: '13px'
            }}>
              {submissionError}
            </div>
          )}
          {isSubmitting ? (
            <div style={{ padding: '20px 0', textAlign: 'center' }}>
              <Loader2 size={36} className="animate-spin" color="var(--forest-green)" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>
                Governance is evaluating your listing…
              </div>
              <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--ink-muted)' }}>
                Publishing is confirmed only after the backend records the governance decision and listing.
              </p>
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
                    Listing Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="2800"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0.01"
                    step="0.01"
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
                    min="0"
                    step="1"
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
                disabled={isSubmitting}
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
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  boxShadow: 'var(--shadow-warm-sm)'
                }}
              >
                <ShieldCheck size={16} />
                <span>Run Governance Check & Publish</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
