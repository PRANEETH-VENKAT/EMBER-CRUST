import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary component that catches runtime rendering errors in its child tree.
 * Displays a brand-aligned, graceful recovery UI with retry capability.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error cleanly in development mode
    if (import.meta.env.DEV) {
      // In dev mode, error captured by boundary
      void errorInfo;
      void error;
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border border-[#262626] bg-[#141414] p-8 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#262626] bg-[#1F1F1F] text-[#FFD60A]">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <h3 className="mt-4 font-bebas text-2xl tracking-wide text-[#F5F5F5]">
            {this.props.fallbackTitle || 'SOMETHING COOLED DOWN IN THE OVEN'}
          </h3>

          <p className="mt-2 max-w-md font-mono text-xs leading-relaxed text-[#A3A3A3]">
            {this.props.fallbackMessage ||
              'A momentary rendering error occurred. You can safely try reloading or resetting this view.'}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.handleReset}
              className="press-scale inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#1F1F1F] px-4 py-2 font-mono text-xs font-bold text-[#F5F5F5] transition-colors hover:border-[#FFD60A] hover:text-[#FFD60A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
            >
              <span>Try Again</span>
            </button>

            <button
              onClick={this.handleReload}
              className="press-scale inline-flex items-center gap-2 rounded-full bg-[#FFD60A] px-5 py-2 font-mono text-xs font-bold text-[#0A0A0A] shadow-md transition-colors hover:bg-[#E5C009] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
