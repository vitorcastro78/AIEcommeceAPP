
import React, { useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Notification types for ecommerce events.
 */
export type NotificationType = "success" | "error" | "info" | "warning";

/**
 * Props for Notification component.
 */
export interface NotificationProps {
  /** Notification message */
  message: string;
  /** Notification type */
  type?: NotificationType;
  /** Show/hide notification */
  open: boolean;
  /** Optional title */
  title?: string;
  /** Optional icon override */
  icon?: React.ReactNode;
  /** Optional loading state */
  loading?: boolean;
  /** Optional error state */
  error?: boolean;
  /** Duration in ms before auto-close (0 = no auto-close) */
  duration?: number;
  /** Callback when notification closes */
  onClose?: () => void;
  /** ARIA role */
  role?: "alert" | "status";
}

/**
 * Notification component for ecommerce subscriptions.
 */
export const Notification: React.FC<NotificationProps> = React.memo(
  ({
    message,
    type = "info",
    open,
    title,
    icon,
    loading = false,
    error = false,
    duration = 4000,
    onClose,
    role = "alert",
  }) => {
    useEffect(() => {
      if (!open || loading || duration === 0) return;
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }, [open, loading, duration, onClose]);

    const handleClose = useCallback(() => {
      onClose?.();
    }, [onClose]);

    const typeStyles = useMemo(() => {
      switch (type) {
        case "success":
          return "bg-green-50 border-green-400 text-green-800";
        case "error":
          return "bg-red-50 border-red-400 text-red-800";
        case "warning":
          return "bg-yellow-50 border-yellow-400 text-yellow-800";
        default:
          return "bg-blue-50 border-blue-400 text-blue-800";
      }
    }, [type]);

    const typeIcon = useMemo(() => {
      if (icon) return icon;
      if (loading)
        return (
          <svg
            className="animate-spin h-6 w-6 text-gray-400"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
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
        );
      switch (type) {
        case "success":
          return (
            <svg
              className="h-6 w-6 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="12" fill="currentColor" opacity="0.1" />
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M7 13l3 3 7-7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          );
        case "error":
          return (
            <svg
              className="h-6 w-6 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="12" fill="currentColor" opacity="0.1" />
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M15 9l-6 6m0-6l6 6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          );
        case "warning":
          return (
            <svg
              className="h-6 w-6 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="12" fill="currentColor" opacity="0.1" />
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M12 8v4m0 4h.01"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          );
        default:
          return (
            <svg
              className="h-6 w-6 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="12" fill="currentColor" opacity="0.1" />
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          );
      }
    }, [type, icon, loading]);

    return (
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`fixed z-50 inset-x-0 mx-auto max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl px-4 sm:px-0 bottom-6 sm:bottom-8`}
            aria-live={role === "alert" ? "assertive" : "polite"}
            role={role}
          >
            <div
              className={`flex items-start w-full border-l-4 rounded-lg shadow-lg p-4 ${typeStyles} transition-colors duration-200`}
              tabIndex={0}
              aria-atomic="true"
            >
              <div className="flex-shrink-0 mt-0.5">{typeIcon}</div>
              <div className="ml-3 flex-1">
                {title && (
                  <div className="text-sm font-semibold mb-1">{title}</div>
                )}
                <div className="text-sm break-words">
                  {loading ? (
                    <span className="text-gray-500">Loading...</span>
                  ) : error ? (
                    <span className="text-red-700">{message}</span>
                  ) : (
                    message
                  )}
                </div>
              </div>
              <button
                type="button"
                className="ml-4 inline-flex items-center justify-center rounded-md p-1.5 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Close notification"
                onClick={handleClose}
                tabIndex={0}
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

Notification.displayName = "Notification";
