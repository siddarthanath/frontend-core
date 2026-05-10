"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React error boundary — catches unhandled render errors and shows fallback UI.
 * Must be a class component (React requirement for error boundaries).
 * Wraps root layout and AppShell so no render error produces a white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-screen items-center justify-center p-8">
            <div className="max-w-md text-center">
              <h2 className="mb-2 text-lg font-semibold">Something went wrong</h2>
              <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                {this.state.error?.message ?? "An unexpected error occurred."}
              </p>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
