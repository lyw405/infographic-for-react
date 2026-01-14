import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (!hasError || !error) {
      return children;
    }

    if (fallback) {
      if (typeof fallback === 'function') {
        return fallback(error, errorInfo!);
      }
      return fallback;
    }

    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c33',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Something went wrong</h2>
        <p>{error.message}</p>
        {errorInfo && (
          <details style={{ marginTop: '10px' }}>
            <summary>Stack trace</summary>
            <pre
              style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '4px',
                overflow: 'auto',
              }}
            >
              {errorInfo.componentStack}
            </pre>
          </details>
        )}
        <button
          type="button"
          onClick={this.handleReset}
          style={{
            marginTop: '15px',
            padding: '8px 16px',
            backgroundColor: '#c33',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </div>
    );
  }
}
