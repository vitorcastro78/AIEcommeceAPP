
import React, { useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProduct } from "../hooks/useproduct";
import { ZippedBeans } from "../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponseTypes";
import { ZippedBeans as RatePlanTypes } from "../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponse+RatePlanTypes";
import { ZippedBeans as RatePlanChargeTypes } from "../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponse+RatePlanChargeTypes";

type CartItem = {
  productId: string;
  ratePlanId: string;
  quantity: number;
};

type ShoppingCartProps = {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, ratePlanId: string, quantity: number) => void;
  onRemove: (productId: string, ratePlanId: string) => void;
  onCheckout: () => void;
  isOpen: boolean;
  onClose: () => void;
};

const ShoppingCart: React.FC<ShoppingCartProps> = React.memo(
  ({ cartItems, onUpdateQuantity, onRemove, onCheckout, isOpen, onClose }) => {
    const { data, isLoading, isError } = useProduct();

    const products = useMemo(() => {
      if (!data?.products) return [];
      return data.products as ZippedBeans[];
    }, [data]);

    const getProduct = useCallback(
      (productId: string) => products.find((p) => p.id === productId),
      [products]
    );

    const getRatePlan = useCallback(
      (product: ZippedBeans | undefined, ratePlanId: string) =>
        product?.ratePlans?.find((rp: RatePlanTypes) => rp.id === ratePlanId),
      []
    );

    const getPrice = useCallback(
      (ratePlan: RatePlanTypes | undefined) =>
        ratePlan?.charges?.[0]?.pricing?.price || 0,
      []
    );

    const total = useMemo(
      () =>
        cartItems.reduce((sum, item) => {
          const product = getProduct(item.productId);
          const ratePlan = getRatePlan(product, item.ratePlanId);
          const price = getPrice(ratePlan);
          return sum + price * item.quantity;
        }, 0),
      [cartItems, getProduct, getRatePlan, getPrice]
    );

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 flex flex-col"
            aria-modal="true"
            role="dialog"
            aria-label="Shopping cart"
          >
            <header className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold" id="cart-title">
                Shopping Cart
              </h2>
              <button
                aria-label="Close cart"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg width="24" height="24" fill="none" aria-hidden="true">
                  <path
                    d="M6 6l12 12M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4" aria-labelledby="cart-title">
              {isLoading ? (
                <div className="flex justify-center items-center h-40" role="status" aria-live="polite">
                  <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
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
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                </div>
              ) : isError ? (
                <div className="text-red-600 text-center" role="alert">
                  Failed to load products. Please try again.
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-gray-500 text-center py-12" aria-live="polite">
                  Your cart is empty.
                </div>
              ) : (
                <ul className="space-y-4">
                  {cartItems.map((item) => {
                    const product = getProduct(item.productId);
                    const ratePlan = getRatePlan(product, item.ratePlanId);
                    const price = getPrice(ratePlan);
                    return (
                      <motion.li
                        key={`${item.productId}-${item.ratePlanId}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="flex items-center gap-4 bg-gray-50 rounded-lg p-3"
                        aria-label={`Cart item: ${product?.name || "Product"}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{product?.name}</div>
                          <div className="text-sm text-gray-500 truncate">
                            {ratePlan?.name}
                          </div>
                          <div className="text-sm text-gray-700 mt-1">
                            €{price.toFixed(2)} / {ratePlan?.charges?.[0]?.pricing?.interval || "month"}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() =>
                              onUpdateQuantity(
                                item.productId,
                                item.ratePlanId,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span aria-live="polite" className="w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() =>
                              onUpdateQuantity(
                                item.productId,
                                item.ratePlanId,
                                item.quantity + 1
                              )
                            }
                            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none"
                          >
                            +
                          </button>
                        </div>
                        <button
                          aria-label="Remove item"
                          onClick={() => onRemove(item.productId, item.ratePlanId)}
                          className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <svg width="20" height="20" fill="none" aria-hidden="true">
                            <path
                              d="M6 6l8 8M6 14L14 6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>
            <footer className="p-4 border-t bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-gray-700">Total</span>
                <span className="font-bold text-lg text-blue-600" aria-live="polite">
                  €{total.toFixed(2)}
                </span>
              </div>
              <button
                onClick={onCheckout}
                disabled={cartItems.length === 0 || isLoading || isError}
                className="w-full py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
                aria-disabled={cartItems.length === 0 || isLoading || isError}
                aria-label="Proceed to checkout"
              >
                Checkout
              </button>
            </footer>
          </motion.aside>
        )}
      </AnimatePresence>
    );
  }
);

export default ShoppingCart;
