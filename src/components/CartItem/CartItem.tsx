
import React, { useCallback, memo } from 'react';
import { motion } from 'framer-motion';

export type CartItemProps = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  currency: string;
  quantity: number;
  interval: string;
  loading?: boolean;
  error?: string;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
};

/**
 * CartItem component for displaying a subscription product in the cart.
 */
const CartItem: React.FC<CartItemProps> = memo(
  ({
    id,
    name,
    description,
    imageUrl,
    price,
    currency,
    quantity,
    interval,
    loading = false,
    error,
    onIncrease,
    onDecrease,
    onRemove,
  }) => {
    const handleIncrease = useCallback(() => {
      if (!loading) onIncrease(id);
    }, [id, onIncrease, loading]);

    const handleDecrease = useCallback(() => {
      if (!loading) onDecrease(id);
    }, [id, onDecrease, loading]);

    const handleRemove = useCallback(() => {
      if (!loading) onRemove(id);
    }, [id, onRemove, loading]);

    return (
      <motion.li
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow-md border border-gray-100 w-full"
        aria-busy={loading}
        aria-live="polite"
        aria-label={`Cart item: ${name}`}
      >
        <div className="flex-shrink-0 w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="object-cover w-full h-full"
              loading="lazy"
              aria-hidden={loading}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl" aria-hidden>
              <svg width="48" height="48" fill="none" aria-hidden>
                <rect width="48" height="48" rx="8" fill="#f3f4f6" />
                <path d="M16 32h16M24 16v16" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-2 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-lg font-semibold text-gray-900">{name}</span>
            <span className="text-base font-medium text-gray-700">
              {currency} {(price * quantity).toFixed(2)}{' '}
              <span className="text-xs text-gray-500">/ {interval}</span>
            </span>
          </div>
          {description && (
            <span className="text-sm text-gray-500 line-clamp-2">{description}</span>
          )}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2" aria-label="Quantity">
              <button
                type="button"
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                aria-label="Decrease quantity"
                onClick={handleDecrease}
                disabled={loading || quantity <= 1}
                tabIndex={0}
              >
                <span aria-hidden>-</span>
              </button>
              <span className="w-8 text-center" aria-live="polite">
                {loading ? (
                  <svg className="animate-spin h-4 w-4 mx-auto text-gray-400" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                ) : (
                  quantity
                )}
              </span>
              <button
                type="button"
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                aria-label="Increase quantity"
                onClick={handleIncrease}
                disabled={loading}
                tabIndex={0}
              >
                <span aria-hidden>+</span>
              </button>
            </div>
            <button
              type="button"
              className="ml-auto px-3 py-1.5 rounded-md text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
              aria-label="Remove item"
              onClick={handleRemove}
              disabled={loading}
              tabIndex={0}
            >
              Remove
            </button>
          </div>
          {error && (
            <div
              className="mt-2 text-sm text-red-600"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}
        </div>
      </motion.li>
    );
  }
);

export default CartItem;
