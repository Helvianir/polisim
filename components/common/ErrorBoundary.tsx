
import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import Button from './Button';
import Card from './Card';

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Card title="Something went wrong" className="border-red-500 bg-red-50">
      <div className="space-y-4 text-center">
        <p className="text-red-700">An unexpected error occurred. Please try again.</p>
        <pre className="text-xs text-left bg-white p-2 rounded border overflow-auto text-red-600">{error.message}</pre>
        <Button onClick={resetErrorBoundary} variant="danger">
          Try Again & Reload
        </Button>
      </div>
    </Card>
  );
};

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
    return (
        <ReactErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // For this app, a simple reload is the most effective way to reset state
                window.location.reload();
            }}
        >
            {children}
        </ReactErrorBoundary>
    );
};

export default ErrorBoundary;