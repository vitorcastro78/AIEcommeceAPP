
import React, { useCallback, useEffect, useRef, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Props for EcommerceModal component
 */
export interface EcommerceModalProps {
  /** Controls the open state of the modal */
  open: boolean;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Called when modal requests to close */
  onClose: () => void;
  /** Optional: loading state */
  loading?: boolean;
  /** Optional: error message */
  error?: string | null;
  /** Optional: disables closing by overlay click or ESC */
  disableClose?: boolean;
  /** Optional: aria-label for modal */
  ariaLabel?: string;
  /** Optional: custom width (Tailwind classes) */
  widthClass?: string;
}

/**
 * Responsive, accessible, animated modal for ecommerce subscriptions
 */
export const EcommerceModal = memo(
  ({
    open,
    title,
    children,
    onClose,
    loading = false,
    error = null,
    disableClose = false,
    ariaLabel,
    widthClass = "w-full max-w-lg",
  }: EcommerceModalProps) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(open);
    }, [open]);

    useEffect(() => {
      if (!open || disableClose) return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, disableClose, onClose]);

    useEffect(() => {
      if (open && modalRef.current) {
        modalRef.current.focus();
      }
    }, [open]);

    const handleOverlayClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (disableClose) return;
        if (e.target === overlayRef.current) onClose();
      },
      [onClose, disableClose]
    );

    return (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
            aria-label={ariaLabel || title || "Modal"}
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={handleOverlayClick}
          >
            <motion.div
              ref={modalRef}
              className={`relative bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 ${widthClass} mx-4 sm:mx-0 outline-none focus:ring-2 focus:ring-primary-500`}
              tabIndex={0}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 25 } }}
              exit={{ scale: 0.96, opacity: 0, transition: { duration: 0.15 } }}
              role="document"
              aria-labelledby={title ? "modal-title" : undefined}
              aria-describedby={error ? "modal-error" : undefined}
            >
              <div className="flex items-center justify-between mb-4">
                {title && (
                  <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h2>
                )}
                {!disableClose && (
                  <button
                    type="button"
                    aria-label="Close modal"
                    className="ml-2 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={onClose}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {error && (
                <div id="modal-error" className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
                  {error}
                </div>
              )}
              <div className={`relative ${loading ? "pointer-events-none opacity-60" : ""}`}>
                {children}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 rounded-xl z-10">
                    <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

EcommerceModal.displayName = "EcommerceModal";
