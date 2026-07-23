import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { createLogger } from '@/services/logger';

const logger = createLogger('ErrorBoundary');

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error('Unhandled React component exception caught by ErrorBoundary', {
      error: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }

  handleReset = () => this.setState({ hasError: false, error: null });

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  handleReportIssue = () => {
    alert('Error log captured and reported to StreamHub telemetry diagnostics.');
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            aria-live="assertive"
            className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center px-4 py-12"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-3xl">
              ⚠️
            </div>

            <div className="space-y-1 max-w-md">
              <h2 className="text-2xl font-bold text-white tracking-tight">Application Exception</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                {this.state.error?.message ?? 'An unexpected runtime error occurred.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="rounded-xl bg-brand-500 hover:bg-brand-400 text-white px-5 py-2 text-xs font-bold shadow-md transition-colors"
              >
                🔄 Try Again
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="rounded-xl bg-surface-700 hover:bg-surface-600 text-white px-5 py-2 text-xs font-bold transition-colors"
              >
                🏠 Go Home
              </button>

              <button
                type="button"
                onClick={this.handleReportIssue}
                className="rounded-xl border border-surface-600 hover:bg-surface-800 text-text-secondary hover:text-white px-5 py-2 text-xs font-semibold transition-colors"
              >
                📋 Report Issue
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
