import React from 'react';

/**
 * Production Error Boundary — catches any React render-time error
 * and shows a calm Cairn-branded fallback instead of crashing the entire app.
 * 
 * Usage: wrap critical subtrees (screens, modals) with <ErrorBoundary>.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production, send to your error monitoring service (Sentry, etc.)
    console.error('[Cairn ErrorBoundary]', error, info?.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const { fallback } = this.props;
    if (fallback) return fallback;

    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        backgroundColor: 'var(--bg-cream, #FBF7F0)',
        textAlign: 'center',
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: '#FEE2E2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          marginBottom: '20px',
        }}>
          🪨
        </div>
        <h2 style={{
          fontFamily: 'var(--font-serif, serif)',
          fontSize: '1.6rem',
          fontWeight: 500,
          color: 'var(--ink, #1A1915)',
          marginBottom: '10px',
        }}>
          Something went quiet unexpectedly.
        </h2>
        <p style={{
          fontSize: '14px',
          color: 'var(--ink-secondary, #5A5649)',
          maxWidth: '420px',
          lineHeight: 1.6,
          marginBottom: '24px',
        }}>
          A momentary disruption occurred in the Cairn interface.
          Your data is safe — no transactions were affected.
        </p>
        <button
          onClick={() => {
            this.setState({ hasError: false, error: null });
            window.location.reload();
          }}
          style={{
            backgroundColor: 'var(--forest-green, #1F4D3A)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reload Cairn
        </button>
        {import.meta.env.DEV && this.state.error && (
          <details style={{ marginTop: '20px', textAlign: 'left', maxWidth: '600px' }}>
            <summary style={{ fontSize: '12px', color: 'var(--ink-muted)', cursor: 'pointer' }}>
              Developer Info
            </summary>
            <pre style={{
              fontSize: '11px',
              backgroundColor: '#FFF1F2',
              padding: '12px',
              borderRadius: '8px',
              overflowX: 'auto',
              marginTop: '8px',
              color: '#7F1D1D',
            }}>
              {this.state.error?.toString()}
            </pre>
          </details>
        )}
      </div>
    );
  }
}

