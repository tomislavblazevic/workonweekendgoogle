import React from 'react';
import './ErrorBoundary.css';

type State = { error: Error | null };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('ErrorBoundary caught error:', error, info);
  }

    render() {
      if (this.state.error) {
        return (
          <div className="errorBoundary">
            <h2>Application error</h2>
            <div>{this.state.error?.message}</div>
            <details className="errorDetails">
              <summary>Stack</summary>
              <pre>{this.state.error?.stack}</pre>
            </details>
          </div>
        );
      }
  
      return this.props.children as React.ReactElement;
    }
  }
  