import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props  { children: ReactNode; fallback?: ReactNode; }
interface State  { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center px-4">
            <div className="text-4xl">⚠️</div>
            <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
            <p className="text-sm text-text-secondary max-w-sm">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <button
              onClick={this.handleReset}
              className="mt-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
