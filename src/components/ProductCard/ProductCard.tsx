
import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * Props for ProductCard component.
 */
export interface ProductCardProps {
  /** Product unique identifier */
  id: string;
  /** Product name */
  name: string;
  /** Product description */
  description: string;
  /** Product image URL */
  imageUrl: string;
  /** Product price (formatted) */
  price: string;
  /** Billing period (e.g., "per month") */
  billingPeriod?: string;
  /** Is the product loading */
  loading?: boolean;
  /** Error message, if any */
  error?: string;
  /** Is the product out of stock or unavailable */
  disabled?: boolean;
  /** Called when user clicks subscribe */
  onSubscribe: (id: string) => void;
  /** Optional: highlight badge (e.g., "Most Popular") */
  badge?: string;
}

/**
 * ProductCard component for displaying a subscription product.
 */
export const ProductCard: React.FC<ProductCardProps> = memo(
  ({
    id,
    name,
    description,
    imageUrl,
    price,
    billingPeriod,
    loading = false,
    error,
    disabled = false,
    onSubscribe,
    badge,
  }) => {
    const handleSubscribe = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!disabled && !loading) {
          onSubscribe(id);
        }
      },
      [id, onSubscribe, disabled, loading]
    );

    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        aria-busy={loading}
        aria-disabled={disabled}
        tabIndex={0}
        className={`relative flex flex-col bg-white rounded-xl shadow-md overflow-hidden transition-all border border-gray-100 hover:shadow-lg focus-within:ring-2 focus-within:ring-indigo-500 ${
          disabled ? 'opacity-60 pointer-events-none' : ''
        }`}
        role="region"
        aria-label={`Product: ${name}`}
      >
        {badge && (
          <span className="absolute top-3 left-3 z-10 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
        <div className="w-full aspect-[4/3] bg-gray-50 flex items-center justify-center">
          {loading ? (
            <div className="animate-pulse w-24 h-24 bg-gray-200 rounded-lg" aria-label="Loading image" />
          ) : (
            <img
              src={imageUrl}
              alt={name}
              className="object-contain w-full h-full"
              loading="lazy"
              draggable={false}
            />
          )}
        </div>
        <div className="flex flex-col flex-1 p-5 gap-2">
          <h2 className="text-lg font-bold text-gray-900 truncate" title={name}>
            {loading ? (
              <span className="inline-block w-2/3 h-5 bg-gray-200 animate-pulse rounded" />
            ) : (
              name
            )}
          </h2>
          <p className="text-sm text-gray-600 flex-1 line-clamp-3" aria-label="Product description">
            {loading ? (
              <span className="inline-block w-full h-4 bg-gray-100 animate-pulse rounded mb-1" />
            ) : (
              description
            )}
          </p>
          <div className="mt-2 flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-indigo-700" aria-label="Product price">
                {loading ? (
                  <span className="inline-block w-16 h-6 bg-gray-200 animate-pulse rounded" />
                ) : (
                  price
                )}
              </span>
              {billingPeriod && !loading && (
                <span className="text-xs text-gray-500">{billingPeriod}</span>
              )}
            </div>
            <button
              type="button"
              className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                loading || disabled ? 'pointer-events-none' : ''
              }`}
              aria-label={`Subscribe to ${name}`}
              aria-disabled={loading || disabled}
              disabled={loading || disabled}
              onClick={handleSubscribe}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                'Subscribe'
              )}
            </button>
          </div>
          {error && (
            <div
              className="mt-2 text-sm text-red-600 bg-red-50 rounded px-2 py-1"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}
        </div>
      </motion.article>
    );
  }
);

ProductCard.displayName = 'ProductCard';

