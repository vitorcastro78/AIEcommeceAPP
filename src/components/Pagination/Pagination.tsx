
import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Props for Pagination component
 */
export interface PaginationProps {
  /** Current page (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Is loading state */
  loading?: boolean;
  /** Error message */
  error?: string | null;
  /** Number of sibling pages to show around current */
  siblingCount?: number;
  /** Optional aria-label for navigation */
  ariaLabel?: string;
  /** Optional className for container */
  className?: string;
}

/**
 * Responsive, accessible, animated Pagination component for ecommerce subscriptions.
 */
export const Pagination: React.FC<PaginationProps> = React.memo(
  ({
    currentPage,
    totalPages,
    onPageChange,
    loading = false,
    error = null,
    siblingCount = 1,
    ariaLabel = 'Pagination Navigation',
    className = '',
  }) => {
    const DOTS = '...';

    const paginationRange = useMemo(() => {
      const totalPageNumbers = siblingCount * 2 + 5;
      if (totalPageNumbers >= totalPages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

      const showLeftDots = leftSiblingIndex > 2;
      const showRightDots = rightSiblingIndex < totalPages - 1;

      const range: (number | string)[] = [];

      if (!showLeftDots && showRightDots) {
        for (let i = 1; i <= 3 + siblingCount * 2; i++) range.push(i);
        range.push(DOTS, totalPages);
      } else if (showLeftDots && !showRightDots) {
        range.push(1, DOTS);
        for (let i = totalPages - (2 + siblingCount * 2); i <= totalPages; i++) range.push(i);
      } else if (showLeftDots && showRightDots) {
        range.push(1, DOTS);
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) range.push(i);
        range.push(DOTS, totalPages);
      }
      return range;
    }, [currentPage, totalPages, siblingCount]);

    const handlePageChange = useCallback(
      (page: number) => {
        if (!loading && page !== currentPage && page >= 1 && page <= totalPages) {
          onPageChange(page);
        }
      },
      [onPageChange, loading, currentPage, totalPages]
    );

    return (
      <nav
        aria-label={ariaLabel}
        className={`flex items-center justify-center mt-6 select-none ${className}`}
      >
        <AnimatePresence initial={false}>
          {error ? (
            <motion.div
              key="pagination-error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-red-600 text-sm px-4 py-2 rounded bg-red-50"
              role="alert"
            >
              {error}
            </motion.div>
          ) : (
            <motion.ul
              key="pagination-list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="inline-flex items-center gap-1"
              role="list"
            >
              <li>
                <button
                  type="button"
                  className="px-2 py-1 rounded-md text-gray-500 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Go to first page"
                  onClick={() => handlePageChange(1)}
                  disabled={loading || currentPage === 1}
                  tabIndex={0}
                >
                  <span className="hidden sm:inline">&laquo;</span>
                  <span className="sm:hidden">&lt;</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="px-2 py-1 rounded-md text-gray-500 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Go to previous page"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={loading || currentPage === 1}
                  tabIndex={0}
                >
                  <span>&lsaquo;</span>
                </button>
              </li>
              {paginationRange.map((page, idx) =>
                page === DOTS ? (
                  <li key={`dots-${idx}`}>
                    <span
                      className="px-2 py-1 text-gray-400 select-none"
                      aria-hidden="true"
                    >
                      {DOTS}
                    </span>
                  </li>
                ) : (
                  <li key={page}>
                    <button
                      type="button"
                      className={`px-3 py-1 rounded-md transition-colors duration-150 ${
                        page === currentPage
                          ? 'bg-primary-600 text-white font-semibold shadow'
                          : 'bg-white text-gray-700 hover:bg-primary-50'
                      } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      aria-current={page === currentPage ? 'page' : undefined}
                      aria-label={
                        page === currentPage
                          ? `Page ${page}, current page`
                          : `Go to page ${page}`
                      }
                      onClick={() => handlePageChange(Number(page))}
                      disabled={loading}
                      tabIndex={0}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}
              <li>
                <button
                  type="button"
                  className="px-2 py-1 rounded-md text-gray-500 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Go to next page"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={loading || currentPage === totalPages}
                  tabIndex={0}
                >
                  <span>&rsaquo;</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="px-2 py-1 rounded-md text-gray-500 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Go to last page"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={loading || currentPage === totalPages}
                  tabIndex={0}
                >
                  <span className="hidden sm:inline">&raquo;</span>
                  <span className="sm:hidden">&gt;</span>
                </button>
              </li>
              {loading && (
                <li>
                  <motion.div
                    key="pagination-loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="ml-3 flex items-center"
                    aria-label="Loading"
                  >
                    <svg
                      className="animate-spin h-5 w-5 text-primary-600"
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
                  </motion.div>
                </li>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';
