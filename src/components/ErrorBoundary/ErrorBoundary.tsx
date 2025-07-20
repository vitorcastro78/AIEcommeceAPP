
import React, { ReactNode, useCallback, useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  /**
   * Optional custom error message
   */
  errorMessage?: string;
}

/**
 * ErrorBoundary component for ecommerce subscription flows.
 * Handles rendering fallback UI on error, with animation, accessibility, and reset.
 */
const ErrorBoundary: React.FC<ErrorBoundaryProps> = memo(
  ({ children, fallback, onReset, errorMessage }) => {
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);

    const resetError = useCallback(() => {
      setError(null);
      setLoading(false);
      if (onReset) onReset();
    }, [onReset]);

    useEffect(() => {
      setError(null);
    }, [children]);

    const FallbackContent = fallback ? (
      fallback
    ) : (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center min-h-[40vh] p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <svg
          className="w-12 h-12 text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {errorMessage || 'Algo deu errado'}
        </h2>
        <p className="text-gray-600 mb-4 text-center">
          Ocorreu um erro inesperado. Por favor, tente novamente ou entre em contato com o suporte.
        </p>
        <button
          onClick={resetError}
          className="px-5 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
          aria-label="Tentar novamente"
        >
          Tentar novamente
        </button>
      </motion.div>
    );

    class ErrorCatcher extends React.Component<{ onError: (error: Error) => void; children: ReactNode }> {
      componentDidCatch(error: Error) {
        this.props.onError(error);
      }
      render() {
        return this.props.children;
      }
    }

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh]" aria-busy="true" aria-live="polite">
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"
          />
          <span className="text-blue-700 font-medium">Carregando...</span>
        </div>
      );
    }

    return (
      <ErrorCatcher
        onError={err => {
          setError(err);
          setLoading(false);
        }}
      >
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              {FallbackContent}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </ErrorCatcher>
    );
  }
);

export default ErrorBoundary;

