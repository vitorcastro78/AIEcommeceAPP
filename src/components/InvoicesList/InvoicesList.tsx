
import React, { useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useinvoice } from "../hooks/useinvoice";
import type { ZippedBeans } from "../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Invoices.GetInvoicesResponseTypes";
import type { ZippedBeans as InvoiceType } from "../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Invoices.GetInvoicesResponse+InvoiceTypes";

export interface InvoicesListProps {
  customerId: string;
  onInvoiceClick?: (invoice: InvoiceType) => void;
  className?: string;
}

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString();
}

function formatCurrency(amount?: number, currency?: string) {
  if (amount == null) return "";
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
  });
}

/**
 * InvoicesList component for displaying a list of invoices for a customer.
 */
export const InvoicesList: React.FC<InvoicesListProps> = React.memo(
  ({ customerId, onInvoiceClick, className }) => {
    const {
      data,
      isLoading,
      isError,
      error,
      refetch,
    } = useinvoice({ customerId });

    const invoices: InvoiceType[] = useMemo(
      () => data?.invoices ?? [],
      [data]
    );

    const handleInvoiceClick = useCallback(
      (invoice: InvoiceType) => {
        if (onInvoiceClick) onInvoiceClick(invoice);
      },
      [onInvoiceClick]
    );

    if (isLoading) {
      return (
        <div
          className={`flex items-center justify-center min-h-[200px] ${className || ""}`}
          aria-busy="true"
          aria-live="polite"
        >
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading"
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
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </div>
      );
    }

    if (isError) {
      return (
        <div
          className={`flex flex-col items-center justify-center min-h-[200px] text-red-600 ${className || ""}`}
          role="alert"
          aria-live="assertive"
        >
          <span className="mb-2 font-semibold">Failed to load invoices.</span>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Retry loading invoices"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!invoices.length) {
      return (
        <div
          className={`flex items-center justify-center min-h-[200px] text-gray-500 ${className || ""}`}
          aria-live="polite"
        >
          No invoices found.
        </div>
      );
    }

    return (
      <div
        className={`w-full max-w-4xl mx-auto ${className || ""}`}
        aria-label="Invoices List"
      >
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="min-w-full divide-y divide-gray-200" role="table">
            <thead className="bg-gray-50" role="rowgroup">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Invoice #
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <AnimatePresence>
              <tbody className="bg-white divide-y divide-gray-100" role="rowgroup">
                {invoices.map((invoice) => (
                  <motion.tr
                    key={invoice.invoiceNumber}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={variants}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-blue-50 focus-within:bg-blue-100"
                    tabIndex={0}
                    aria-label={`Invoice ${invoice.invoiceNumber}`}
                    onClick={() => handleInvoiceClick(invoice)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleInvoiceClick(invoice);
                      }
                    }}
                    role="row"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(invoice.invoiceDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "Open"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                        aria-label={`Status: ${invoice.status}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInvoiceClick(invoice);
                        }}
                        aria-label={`View details for invoice ${invoice.invoiceNumber}`}
                      >
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </AnimatePresence>
          </table>
        </div>
      </div>
    );
  }
);

InvoicesList.displayName = "InvoicesList";

