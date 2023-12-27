import React, { Component, useEffect } from 'react';
import ReactGA from 'react-ga4';

export function ErrorFallbackComponent({ error }) {
  const handleError = (errorMessage = 'error boundary on react app') => {
    ReactGA.event({
      category: 'Errors',
      action: errorMessage,
      label: 'error boundary',
    });
  };

  useEffect(() => {
    const page = window.location.pathname;
    const date = new Date().toLocaleDateString();
    const message = error?.message;
    const errorMessage = `Error : ${message} on route: ${page} on date: ${date}`;

    handleError(errorMessage);
  }, []);

  return (
    <div style={{ padding: 20, margin: 20, background: 'hotpink' }}>
      <h3>Something went wrong</h3>
      <p>{error?.message}</p>
    </div>
  );
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
  }

  static getDerivedStateFromError(error) {
    console.log(error);
    return { error: true };
  }

  render() {
    const { error } = this.state;
    const { children, Fallback } = this.props;

    if (error) return <Fallback error={error} />;
    return children;
  }
}

export default ErrorBoundary;
