import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In a production app, this is where you would log to a tracking service
    // e.g., Sentry, LogRocket, or a custom API
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
          <h2>Oops, something went wrong.</h2>
          <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
          {import.meta.env.DEV && (
            <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left', marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
              <summary>Error Details</summary>
              {this.state.error && this.state.error.toString()}
            </details>
          )}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
