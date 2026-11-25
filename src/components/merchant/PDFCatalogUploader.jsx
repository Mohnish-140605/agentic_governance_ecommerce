import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2, Sparkles, Download } from 'lucide-react';
import { uploadMerchantCatalog } from '../../services/api';

export default function PDFCatalogUploader({ onUploadSuccess, onShowToast, currentUser }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    setErrorMessage(null);
    setUploadResult(null);
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Please select a valid PDF file (.pdf).');
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setErrorMessage(null);

    try {
      const vendorId = currentUser?.vendor_id || 'VEN-BLR-001';
      const merchantName = currentUser?.store_name || currentUser?.name || 'Verified Artisan Merchant';
      const result = await uploadMerchantCatalog(selectedFile, vendorId, merchantName);

      setUploadResult(result);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      onShowToast?.(`Published ${result.count || 0} products from PDF catalog to live marketplace!`);
      if (onUploadSuccess) onUploadSuccess(result);
    } catch (err) {
      console.error('[PDFCatalogUploader] Upload failed:', err);
      setErrorMessage(err.message || 'Failed to process PDF catalog. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadSampleCatalog = async () => {
    setIsUploading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/sample_merchant_catalog.pdf');
      if (!response.ok) throw new Error('Sample PDF could not be loaded.');
      const blob = await response.blob();
      const sampleFile = new File([blob], 'sample_merchant_catalog.pdf', { type: 'application/pdf' });
      setSelectedFile(sampleFile);
    } catch (err) {
      console.error('[PDFCatalogUploader] Sample load error:', err);
      setErrorMessage('Could not load sample PDF.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--border-cream)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-warm-sm)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--forest-green-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--forest-green)'
          }}>
            <FileText size={22} />
          </div>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--ink)',
              margin: '0 0 4px 0'
            }}>
              PDF Product Catalog Ingestion
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: 0 }}>
              Upload any product catalog or spec sheet PDF. Our parser extracts products, validates them via the Governance Engine, and assigns local fulfillment hubs based on buyer location.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLoadSampleCatalog}
          disabled={isUploading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--bg-cream-subtle)',
            border: '1px solid var(--border-cream)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--forest-green)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title="Try with a pre-configured sample PDF catalog"
        >
          <Sparkles size={13} />
          <span>Load Sample PDF</span>
        </button>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: dragActive
            ? '2px dashed var(--forest-green)'
            : '2px dashed var(--border-cream)',
          borderRadius: '12px',
          padding: '28px 20px',
          textAlign: 'center',
          backgroundColor: dragActive ? 'var(--forest-green-light)' : 'var(--bg-cream-subtle)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: '16px'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--forest-green)',
            boxShadow: 'var(--shadow-warm-sm)'
          }}>
            <UploadCloud size={22} />
          </div>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>
              Click to browse
            </span>{' '}
            <span style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
              or drag & drop your product catalog PDF here
            </span>
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--ink-muted)' }}>
            Supports tables, spec sheets, price lists &bull; Maximum file size 15 MB
          </div>
        </div>
      </div>

      {/* Selected File Badge & Upload Button */}
      {selectedFile && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 16px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-cream)',
          borderRadius: '10px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={18} color="var(--forest-green)" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                {selectedFile.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                {(selectedFile.size / 1024).toFixed(1)} KB &bull; Ready for AI extraction
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              disabled={isUploading}
              style={{
                padding: '6px 12px',
                border: '1px solid var(--border-cream)',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                color: 'var(--ink-secondary)',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 18px',
                backgroundColor: 'var(--forest-green)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: isUploading ? 'wait' : 'pointer',
                boxShadow: 'var(--shadow-warm-sm)'
              }}
            >
              {isUploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Ingesting & Auditing...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={14} />
                  <span>Publish to Marketplace</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          backgroundColor: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '10px',
          color: '#B91C1C',
          fontSize: '13px',
          marginBottom: '16px'
        }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Success & Extracted Products Preview */}
      {uploadResult && uploadResult.products && (
        <div style={{
          backgroundColor: 'var(--forest-green-light)',
          border: '1px solid var(--forest-green-border)',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--forest-green)',
            fontSize: '14px',
            fontWeight: 650,
            marginBottom: '12px'
          }}>
            <CheckCircle size={18} />
            <span>Successfully extracted and published {uploadResult.count} products!</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '10px'
          }}>
            {uploadResult.products.map((p) => (
              <div
                key={p.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-cream)',
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                    {p.name}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--forest-green)',
                    backgroundColor: 'var(--forest-green-light)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)'
                  }}>
                    {p.category}
                  </span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--forest-green)' }}>
                  ₹{Number(p.price).toLocaleString('en-IN')}
                </div>
                {p.specs && (
                  <div style={{ fontSize: '11.5px', color: 'var(--ink-muted)', lineHeight: '1.4' }}>
                    {p.specs}
                  </div>
                )}
                <div style={{
                  fontSize: '10.5px',
                  color: '#15803D',
                  fontWeight: 600,
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>✓ Governed & Distributed to Local Vendors</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
