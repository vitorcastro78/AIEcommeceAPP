
import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Breadcrumb item type
 */
export type BreadcrumbItem = {
  label: string;
  href?: string;
  loading?: boolean;
  error?: boolean;
};

/**
 * Props for Breadcrumb component
 */
export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  loading?: boolean;
  error?: boolean;
}

/**
 * Ecommerce Breadcrumb component for subscriptions
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = memo(
  ({ items, className = '', separator = '/', loading = false, error = false }) => {
    const isLoading = loading || items.some((i) => i.loading);
    const isError = error || items.some((i) => i.error);

    const renderedItems = useMemo(
      () =>
        items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li
              key={item.label + idx}
              className="flex items-center"
              aria-current={isLast ? 'page' : undefined}
            >
              <AnimatePresence mode="wait">
                {item.loading || isLoading ? (
                  <motion.span
                    className="w-16 h-4 bg-gray-200 rounded animate-pulse block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                ) : item.error || isError ? (
                  <motion.span
                    className="text-red-500 font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Error
                  </motion.span>
                ) : item.href && !isLast ? (
                  <motion.a
                    href={item.href}
                    className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                    tabIndex={0}
                    aria-label={item.label}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                  >
                    {item.label}
                  </motion.a>
                ) : (
                  <motion.span
                    className="text-gray-900 font-medium"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!isLast && (
                <span
                  className="mx-2 text-gray-400 select-none"
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}
            </li>
          );
        }),
      [items, isLoading, isError, separator]
    );

    return (
      <nav
        className={`w-full py-2 px-4 bg-white dark:bg-gray-900 rounded flex items-center overflow-x-auto ${className}`}
        aria-label="Breadcrumb"
        role="navigation"
      >
        <ol className="flex items-center space-x-0 text-sm w-full" role="list">
          {renderedItems}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

