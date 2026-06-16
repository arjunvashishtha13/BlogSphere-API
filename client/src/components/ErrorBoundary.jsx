import { Component } from 'react';
import Button from './Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="font-display text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm text-ink-muted dark:text-[#b8b5ad] max-w-md mb-6">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <Button
            variant="primary"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Refresh page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
