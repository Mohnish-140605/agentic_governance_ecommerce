import React from 'react';

export default function AriaCopilotLogo({ size = 48, statusText = 'Thinking...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '14px',
      padding: '24px 0'
    }}>
      <style>{`
        @keyframes copilotRibbonRotate {
          0% {
            transform: rotate(0deg) scale(0.95);
          }
          50% {
            transform: rotate(180deg) scale(1.05);
          }
          100% {
            transform: rotate(360deg) scale(0.95);
          }
        }

        @keyframes copilotGlowPulse {
          0%, 100% {
            opacity: 0.55;
            filter: blur(8px);
            transform: scale(0.9);
          }
          50% {
            opacity: 0.9;
            filter: blur(14px);
            transform: scale(1.15);
          }
        }

        @keyframes copilotGradientShift {
          0% {
            stop-color: #1F4D3A;
          }
          33% {
            stop-color: #059669;
          }
          66% {
            stop-color: #10B981;
          }
          100% {
            stop-color: #1F4D3A;
          }
        }
      `}</style>

      {/* Animated Copilot Ribbon Icon */}
      <div style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Ambient Glow Aura */}
        <div style={{
          position: 'absolute',
          inset: -4,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.45) 0%, rgba(31, 77, 58, 0.15) 60%, transparent 100%)',
          animation: 'copilotGlowPulse 2.5s ease-in-out infinite'
        }} />

        {/* Fluid Looping Ribbon SVG (matching Microsoft Copilot Ribbon Animation) */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            animation: 'copilotRibbonRotate 4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
            transformOrigin: 'center center'
          }}
        >
          <defs>
            <linearGradient id="copilotGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1F4D3A" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <linearGradient id="copilotGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#1F4D3A" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* Loop 1: Top Ribbon */}
          <path
            d="M 28 35 C 28 20, 52 14, 66 24 C 80 34, 76 58, 62 66 C 48 74, 32 78, 24 64 C 18 54, 22 42, 32 38"
            stroke="url(#copilotGrad1)"
            strokeWidth="11"
            strokeLinecap="round"
            filter="url(#shadow)"
          />

          {/* Loop 2: Interlocking Bottom Ribbon */}
          <path
            d="M 72 65 C 72 80, 48 86, 34 76 C 20 66, 24 42, 38 34 C 52 26, 68 22, 76 36 C 82 46, 78 58, 68 62"
            stroke="url(#copilotGrad2)"
            strokeWidth="11"
            strokeLinecap="round"
            style={{ opacity: 0.92 }}
          />

          {/* Center glowing focal point */}
          <circle
            cx="50"
            cy="50"
            r="4.5"
            fill="#FFFFFF"
            style={{ filter: 'drop-shadow(0 0 4px #34D399)' }}
          />
        </svg>
      </div>

      {statusText && (
        <div style={{
          fontSize: '13.5px',
          fontWeight: 500,
          color: 'var(--ink-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--forest-green)',
            animation: 'copilotGlowPulse 1.5s infinite'
          }} />
          <span>{statusText}</span>
        </div>
      )}
    </div>
  );
}
