"use client"

import { Component, type ReactNode, type ErrorInfo } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Swap for Sentry.captureException(error) in production
    console.error("Unhandled render error", error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div
            className="flex min-h-screen flex-col items-center justify-center gap-4"
            style={{ background: "var(--bg)", color: "var(--fg)" }}
          >
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="max-w-xs text-center text-sm" style={{ color: "var(--fg-2)" }}>
              {this.state.error.message}
            </p>
            <Button variant="outline" onClick={() => this.setState({ error: null })}>
              Try again
            </Button>
          </div>
        )
      )
    }
    return this.props.children
  }
}
