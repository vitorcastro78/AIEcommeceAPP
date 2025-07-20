
import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Props for LoadingSpinner component.
 */
export interface LoadingSpinnerProps {
  /**
   * If true, spinner is visible.
   * @default true
   */
  loading?: boolean;
  /**
   * Optional error message to display.
   */
  error?: string | null;
  /**
   * Spinner size (in px).
   * @default 48
   */
  size?: number;
  /**
   * Spinner color (Tailwind color class).
   * @default 'text-primary'
   */
  colorClass?: string;
  /**
   * Optional label for accessibility.
   */
  label?: string;
  /**
   * If true, spinner overlays the page.
   * @default false
   */
  overlay?: boolean;
}

/**
 * LoadingSpinner component for ecommerce subscription flows.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(
  ({
    loading = true,
    error = null,
    size = 48,
    colorClass = 'text-primary',
    label = 'Loading',
    overlay = false,
  }) => {
    const spinner = useMemo(
      () => (
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: 'linear',
          }}
          className={`inline-block`}
          aria-hidden="true"
        >
          <svg
            className={`animate-spin ${colorClass}`}
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            role="presentation"
          >
            <circle
              className="opacity-20"
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="6"
            />
            <path
              className="opacity-80"
              fill="currentColor"
              d="M44 24c0-11.046-8.954-20-20-20v6c7.732 0 14 6.268 14 14h6z"
            />
          </svg>
        </motion.div>
      ),
      [size, colorClass]
    );

    if (!loading && !error) return null;

    return (
      <div
        className={
          overlay
            ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/40'
            : 'flex flex-col items-center justify-center w-full'
        }
        role="status"
        aria-live="polite"
        aria-busy={loading}
        aria-label={label}
      >
        {loading && spinner}
        {loading && (
          <span className="sr-only" aria-live="polite">
            {label}
          </span>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-sm text-red-600 max-w-xs"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </motion.div>
        )}
      </div>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

