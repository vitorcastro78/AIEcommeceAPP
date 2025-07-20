
import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useproduct } from '../../hooks/useproduct';
import type { ZippedBeans } from '../../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponseTypes';

/**
 * Props for ProductList component.
 */
export interface ProductListProps {
  /**
   * Callback when a product is selected.
   */
  onSelectProduct?: (product: ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponseTypes.ProductTypes) => void;
  /**
   * Optional: Filter products by category or other criteria.
   */
  filter?: (product: ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponseTypes.ProductTypes) => boolean;
  /**
   * Optional: Custom className for container.
   */
  className?: string;
}

/**
 * ProductList component for displaying subscription products.
 */
export const ProductList: React.FC<ProductListProps> = React.memo(
  ({ onSelectProduct, filter, className }) => {
    const { data, isLoading, isError, error } = useproduct();

    const products = useMemo(() => {
      if (!data?.products) return [];
      return filter ? data.products.filter(filter) : data.products;
    }, [data, filter]);

    const handleSelect = useCallback(
      (product: ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponseTypes.ProductTypes) => {
        if (onSelectProduct) onSelectProduct(product);
      },
      [onSelectProduct]
    );

    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[200px]" role="status" aria-busy="true">
          <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="sr-only">Loading products...</span>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-red-600 text-center py-8" role="alert" aria-live="assertive">
          {typeof error === 'string' ? error : 'Failed to load products.'}
        </div>
      );
    }

    if (!products.length) {
      return (
        <div className="text-gray-500 text-center py-8" role="status" aria-live="polite">
          No products available.
        </div>
      );
    }

    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${className || ''}`}
        role="list"
        aria-label="Product List"
      >
        <AnimatePresence>
          {products.map((product) => (
            <motion.button
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={() => handleSelect(product)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition p-5 flex flex-col items-start text-left cursor-pointer"
              aria-label={`Select product ${product.name}`}
              role="listitem"
              tabIndex={0}
            >
              <div className="w-full aspect-w-16 aspect-h-9 mb-4 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-contain w-full h-full"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-gray-400 text-4xl" aria-hidden="true">📦</span>
                )}
              </div>
              <h2 className="text-lg font-semibold mb-1 text-gray-900">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
              <div className="mt-auto w-full">
                {product.ratePlans && product.ratePlans.length > 0 && (
                  <div className="flex flex-col gap-1">
                    {product.ratePlans.map((plan) => (
                      <span
                        key={plan.id}
                        className="inline-block bg-blue-50 text-blue-700 text-xs font-medium rounded px-2 py-1"
                        aria-label={`Plan: ${plan.name}`}
                      >
                        {plan.name}
                        {plan.charges && plan.charges.length > 0 && (
                          <>
                            {' '}
                            -{' '}
                            {plan.charges
                              .map(
                                (charge) =>
                                  charge.pricing &&
                                  charge.pricing.price !== undefined &&
                                  charge.pricing.currency
                                    ? `${charge.pricing.price.toLocaleString(undefined, {
                                        style: 'currency',
                                        currency: charge.pricing.currency,
                                      })} / ${charge.billingPeriod || 'period'}`
                                    : null
                              )
                              .filter(Boolean)
                              .join(', ')}
                          </>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

ProductList.displayName = 'ProductList';
