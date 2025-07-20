
import React, { useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useproduct } from "../../hooks/useproduct";

/**
 * Props for CategoryFilter component.
 */
export interface CategoryFilterProps {
  /**
   * Currently selected category id.
   */
  selectedCategoryId?: string | null;
  /**
   * Callback when a category is selected.
   */
  onCategorySelect: (categoryId: string | null) => void;
  /**
   * Optional: Show "All" option.
   */
  showAllOption?: boolean;
  /**
   * Optional: Label for "All" option.
   */
  allLabel?: string;
  /**
   * Optional: className for container.
   */
  className?: string;
}

/**
 * CategoryFilter component for ecommerce subscriptions.
 */
export const CategoryFilter: React.FC<CategoryFilterProps> = React.memo(
  ({
    selectedCategoryId,
    onCategorySelect,
    showAllOption = true,
    allLabel = "All Categories",
    className = "",
  }) => {
    const { data, isLoading, isError, error } = useproduct();

    const categories = useMemo(() => {
      if (!data?.categories) return [];
      return data.categories as { id: string; name: string }[];
    }, [data]);

    const handleSelect = useCallback(
      (categoryId: string | null) => {
        onCategorySelect(categoryId);
      },
      [onCategorySelect]
    );

    return (
      <nav
        aria-label="Product categories"
        className={`w-full flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center ${className}`}
      >
        {isLoading && (
          <div className="w-full flex justify-center items-center py-6">
            <svg
              className="animate-spin h-6 w-6 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading categories"
              role="status"
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
          </div>
        )}
        {isError && (
          <div
            className="w-full text-red-600 text-sm py-2"
            role="alert"
            aria-live="assertive"
          >
            {typeof error === "string"
              ? error
              : "Failed to load categories. Please try again."}
          </div>
        )}
        {!isLoading && !isError && (
          <ul className="flex flex-wrap gap-2 sm:gap-4 w-full" role="listbox">
            <AnimatePresence initial={false}>
              {showAllOption && (
                <motion.li
                  key="all"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    type="button"
                    aria-selected={selectedCategoryId == null}
                    aria-label={allLabel}
                    className={`px-4 py-2 rounded-full border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500
                      ${
                        selectedCategoryId == null
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }
                    `}
                    onClick={() => handleSelect(null)}
                  >
                    {allLabel}
                  </button>
                </motion.li>
              )}
              {categories.map((cat) => (
                <motion.li
                  key={cat.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    type="button"
                    aria-selected={selectedCategoryId === cat.id}
                    aria-label={cat.name}
                    className={`px-4 py-2 rounded-full border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500
                      ${
                        selectedCategoryId === cat.id
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }
                    `}
                    onClick={() => handleSelect(cat.id)}
                  >
                    {cat.name}
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </nav>
    );
  }
);

CategoryFilter.displayName = "CategoryFilter";

export default CategoryFilter;

