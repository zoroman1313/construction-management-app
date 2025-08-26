'use client';

import { Component, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(err: unknown) {
    // Optionally, log to an error reporting service
    console.error('Accounting tab error:', err);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
