
import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useubscription } from '../hooks/useubscription';
import { ZippedBeans } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Subscriptions.GetSubscriptionDetailResponseTypes';

/**
 * Props for SubscriptionsSummary component
 */
export interface SubscriptionsSummaryProps {
  customerId: string;
  className?: string;
}

/**
 * SubscriptionsSummary component displays a summary of subscriptions for a customer.
 */
export const SubscriptionsSummary: React.FC<SubscriptionsSummaryProps> = React.memo(
  ({ customerId, className }) => {
    const {
      data: subscriptions,
      isLoading,
      isError,
      error,
      refetch,
    } = useubscription(customerId);

    const handleRetry = useCallback(() => {
      refetch();
    }, [refetch]);

    const summary = useMemo(() => {
      if (!subscriptions?.subscriptions) return [];
      return subscriptions.subscriptions.map((sub) => ({
        id: sub.id,
        name: sub.ratePlans?.[0]?.productDetails?.name ?? 'Subscription',
        status: sub.status,
        price: sub.ratePlans?.[0]?.charges?.[0]?.price ?? 0,
        currency: sub.ratePlans?.[0]?.charges?.[0]?.currency ?? '',
        nextBillingDate: sub.nextBillingDate,
        startDate: sub.startDate,
        endDate: sub.endDate,
      }));
    }, [subscriptions]);

    return (
      <section
        className={`w-full max-w-3xl mx-auto p-4 ${className ?? ''}`}
        aria-labelledby="subscriptions-summary-title"
      >
        <h2
          id="subscriptions-summary-title"
          className="text-2xl font-bold mb-4 text-gray-900"
        >
          Subscriptions Summary
        </h2>
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-40"
              aria-busy="true"
              aria-live="polite"
            >
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              <span className="ml-2 text-gray-700">Loading subscriptions...</span>
            </motion.div>
          )}
          {isError && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
              aria-live="assertive"
            >
              <span className="block font-bold">Error:</span>
              <span className="block">{(error as Error)?.message ?? 'Failed to load subscriptions.'}</span>
              <button
                onClick={handleRetry}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="Retry loading subscriptions"
              >
                Retry
              </button>
            </motion.div>
          )}
          {!isLoading && !isError && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3 }}
            >
              {summary.length === 0 ? (
                <div
                  className="text-gray-500 text-center py-8"
                  role="status"
                  aria-live="polite"
                >
                  No subscriptions found.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200" role="list">
                  {summary.map((sub) => (
                    <li
                      key={sub.id}
                      className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-2"
                      tabIndex={0}
                      aria-label={`Subscription ${sub.name}, status ${sub.status}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 truncate">{sub.name}</span>
                          <span
                            className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                              sub.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : sub.status === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                            aria-label={`Status: ${sub.status}`}
                          >
                            {sub.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-2">
                          <span>
                            Start: <time dateTime={sub.startDate}>{sub.startDate}</time>
                          </span>
                          {sub.endDate && (
                            <span>
                              End: <time dateTime={sub.endDate}>{sub.endDate}</time>
                            </span>
                          )}
                          {sub.nextBillingDate && (
                            <span>
                              Next Billing: <time dateTime={sub.nextBillingDate}>{sub.nextBillingDate}</time>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 mt-2 md:mt-0 flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {sub.currency}
                          {sub.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    );
  }
);

SubscriptionsSummary.displayName = 'SubscriptionsSummary';
