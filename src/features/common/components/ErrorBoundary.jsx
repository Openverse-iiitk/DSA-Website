import React from 'react';

/**
 * Enhanced Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * 
 * Features:
 * - Enhanced error logging with context
 * - User-friendly error messages
 * - Retry functionality
 * - Styled error display consistent with app theme
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false 
    };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Enhanced error logging with context
    const errorDetails = {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // Log to console for development
    console.error("🔥 ErrorBoundary caught an error:", errorDetails);
    
    // In production, you could send this to an error tracking service
    // Example: Sentry.captureException(error, { contexts: { errorInfo } });
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false 
    });
  };

  toggleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" style={{
          background: 'var(--color-card-bg, #1A1A2E)',
          border: '2px solid var(--color-error, #ff6b6b)',
          borderRadius: '12px',
          padding: '2rem',
          margin: '2rem',
          textAlign: 'center',
          color: 'var(--color-text, #ffffff)',
          fontFamily: 'inherit'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ 
            color: 'var(--color-error, #ff6b6b)', 
            marginBottom: '1rem',
            fontSize: '1.5rem'
          }}>
            Oops! Something went wrong
          </h2>
          <p style={{ 
            marginBottom: '1.5rem', 
            fontSize: '1rem',
            color: 'var(--color-text-secondary, #ccc)'
          }}>
            We're sorry, but there was an error with this visualization. 
            This usually happens due to invalid input or a temporary glitch.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
            <button 
              onClick={this.handleRetry}
              style={{
                background: 'var(--color-primary, #00D4AA)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              🔄 Try Again
            </button>
            
            <button 
              onClick={this.toggleDetails}
              style={{
                background: 'transparent',
                color: 'var(--color-text-secondary, #ccc)',
                border: '1px solid var(--color-border, #555)',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              {this.state.showDetails ? '📄 Hide Details' : '🔍 Show Details'}
            </button>
          </div>

          {this.state.showDetails && (
            <details 
              open 
              style={{ 
                textAlign: 'left',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '1rem',
                borderRadius: '6px',
                marginTop: '1rem',
                fontSize: '0.9rem',
                fontFamily: 'monospace'
              }}
            >
              <summary style={{ marginBottom: '0.5rem', cursor: 'pointer' }}>
                Error Details
              </summary>
              <div style={{ whiteSpace: 'pre-wrap', color: '#ff6b6b' }}>
                {this.state.error && this.state.error.toString()}
              </div>
              {this.state.errorInfo && (
                <div style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', color: '#ffa500' }}>
                  {this.state.errorInfo.componentStack}
                </div>
              )}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;