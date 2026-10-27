import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3800);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '32px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 110,
      backgroundColor: 'var(--forest-green)',
      color: '#FFFFFF',
      padding: '12px 22px',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-warm-float)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      fontWeight: 500,
      animation: 'fadeIn 0.25s ease',
      maxWidth: '90vw'
    }}>
      <CheckCircle2 size={18} color="#34D399" />
      <span>{message}</span>
      <button 
        onClick={onClose}
        style={{
          color: 'rgba(255, 255, 255, 0.7)',
          marginLeft: '4px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
}
