'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground">
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>

          {error && process.env.NODE_ENV === 'development' && (
            <div className="text-left">
              <details className="text-xs bg-muted p-2 rounded">
                <summary className="cursor-pointer font-mono">Error Details</summary>
                <pre className="mt-2 whitespace-pre-wrap break-words">
                  {error.name}: {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </details>
            </div>
          )}

          <div className="flex gap-2 justify-center">
            <Button onClick={resetError} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button onClick={() => window.location.reload()} size="sm">
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for functional components to reset error boundaries
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}