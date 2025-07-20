
import React, { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProduct } from "../../hooks/useproduct";
import { ZippedBeans } from "../../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponseTypes";

export interface SearchBarProps {
  /**
   * Placeholder text for the search input
   */
  placeholder?: string;
  /**
   * Callback when a product is selected
   */
  onSelectProduct?: (product: ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponseTypes.ProductTypes) => void;
  /**
   * Minimum characters to trigger search
   */
  minSearchLength?: number;
  /**
   * Debounce delay in ms
   */
  debounceMs?: number;
  /**
   * Optional className for container
   */
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = React.memo(
  ({
    placeholder = "Search subscriptions...",
    onSelectProduct,
    minSearchLength = 2,
    debounceMs = 300,
    className = "",
  }) => {
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
          setDebouncedQuery(value);
        }, debounceMs);
      },
      [debounceMs]
    );

    const {
      data: products,
      isLoading,
      isError,
      error,
    } = useProduct(
      useMemo(
        () =>
          debouncedQuery.length >= minSearchLength
            ? { search: debouncedQuery }
            : undefined,
        [debouncedQuery, minSearchLength]
      )
    );

    const handleSelect = useCallback(
      (product: ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponseTypes.ProductTypes) => {
        if (onSelectProduct) onSelectProduct(product);
        setQuery("");
        setDebouncedQuery("");
        setFocused(false);
      },
      [onSelectProduct]
    );

    const showDropdown = useMemo(
      () =>
        focused &&
        debouncedQuery.length >= minSearchLength &&
        (isLoading || (products && products.products && products.products.length > 0) || isError),
      [focused, debouncedQuery, minSearchLength, isLoading, products, isError]
    );

    return (
      <div className={`relative w-full max-w-lg ${className}`}>
        <label htmlFor="search-bar" className="sr-only">
          Search subscriptions
        </label>
        <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
          <svg
            className="w-5 h-5 text-gray-400 ml-3"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="search-bar"
            type="text"
            className="flex-1 py-2 px-3 bg-transparent outline-none text-gray-900 placeholder-gray-400"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            aria-autocomplete="list"
            aria-controls="search-bar-listbox"
            aria-expanded={showDropdown}
            aria-activedescendant=""
            role="combobox"
            autoComplete="off"
          />
        </div>
        <AnimatePresence>
          {showDropdown && (
            <motion.ul
              id="search-bar-listbox"
              role="listbox"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-auto"
            >
              {isLoading && (
                <li
                  className="flex items-center px-4 py-3 text-gray-500"
                  role="option"
                  aria-disabled="true"
                >
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-blue-500"
                    viewBox="0 0 24 24"
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
                  Loading...
                </li>
              )}
              {isError && (
                <li
                  className="px-4 py-3 text-red-500"
                  role="option"
                  aria-disabled="true"
                >
                  {error instanceof Error ? error.message : "Error loading products"}
                </li>
              )}
              {products &&
                products.products &&
                products.products.length > 0 &&
                products.products.map((product) => (
                  <li
                    key={product.id}
                    role="option"
                    tabIndex={0}
                    aria-selected="false"
                    className="cursor-pointer px-4 py-3 hover:bg-blue-50 focus:bg-blue-100 transition text-gray-900"
                    onMouseDown={() => handleSelect(product)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleSelect(product);
                      }
                    }}
                  >
                    <div className="font-medium truncate">{product.name}</div>
                    {product.description && (
                      <div className="text-xs text-gray-500 truncate">
                        {product.description}
                      </div>
                    )}
                  </li>
                ))}
              {products &&
                products.products &&
                products.products.length === 0 &&
                !isLoading &&
                !isError && (
                  <li
                    className="px-4 py-3 text-gray-500"
                    role="option"
                    aria-disabled="true"
                  >
                    No subscriptions found.
                  </li>
                )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

export default SearchBar;

