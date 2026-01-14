import { Component, ErrorInfo, ReactNode } from 'react';
import {
  errorBoundaryContainerStyles,
  errorBoundaryTitleStyles,
  errorBoundaryStackStyles,
  errorBoundaryRetryButtonStyles,
} from './styles';

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
      <div style={errorBoundaryContainerStyles}>
        <h2 style={errorBoundaryTitleStyles}>Something went wrong</h2>
        <p>{error.message}</p>
        {errorInfo && (
          <details style={{ marginTop: '10px' }}>
            <summary>Stack trace</summary>
            <pre style={errorBoundaryStackStyles}>{errorInfo.componentStack}</pre>
          </details>
        )}
        <button type="button" onClick={this.handleReset} style={errorBoundaryRetryButtonStyles}>
          Try again
        </button>
      </div>
    );
  }
}
