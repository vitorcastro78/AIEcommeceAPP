
import React, { FC, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useProduct } from '../hooks/useproduct';
import { ZippedBeans } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponseTypes';

/**
 * Props for ProductDetails component.
 */
export interface ProductDetailsProps {
  /** Product ID to fetch details for */
  productId: string;
  /** Called when user clicks subscribe */
  onSubscribe?: (product: ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponseTypes['products'][0]) => void;
}

/**
 * ProductDetails component for subscription ecommerce.
 */
export const ProductDetails: FC<ProductDetailsProps> = React.memo(({ productId, onSubscribe }) => {
  const { data, isLoading, error } = useProduct(productId);

  const product = useMemo(() => {
    if (!data?.products?.length) return undefined;
    return data.products[0];
  }, [data]);

  const handleSubscribe = useCallback(() => {
    if (product && onSubscribe) onSubscribe(product);
  }, [product, onSubscribe]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" aria-busy="true" aria-live="polite">
        <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <span className="ml-4 text-gray-600 text-lg">Carregando produto...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-64" role="alert" aria-live="assertive">
        <span className="text-red-600 text-lg font-semibold">Erro ao carregar detalhes do produto.</span>
      </div>
    );
  }

  return (
    <motion.section
      className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-8 mt-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-labelledby="product-title"
      tabIndex={-1}
    >
      <div className="flex-shrink-0 flex justify-center items-center md:w-1/3">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="rounded-lg w-48 h-48 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48" aria-hidden="true">
              <rect x="8" y="8" width="32" height="32" rx="6" />
              <path d="M16 32l8-8 8 8" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h1 id="product-title" className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          {product.ratePlans && product.ratePlans.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Planos de Assinatura</h2>
              <ul className="space-y-2">
                {product.ratePlans.map((plan) => (
                  <li key={plan.id} className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 rounded p-3">
                    <span className="font-medium text-gray-900">{plan.name}</span>
                    <span className="text-blue-600 font-semibold mt-1 md:mt-0">
                      {plan.charges && plan.charges.length > 0
                        ? plan.charges[0].pricing?.price?.toLocaleString('pt-BR', { style: 'currency', currency: plan.charges[0].pricing?.currency || 'BRL' })
                        : 'Preço sob consulta'}
                      {plan.charges && plan.charges[0]?.pricing?.interval
                        ? <span className="ml-1 text-gray-500 text-sm">/ {plan.charges[0].pricing.interval}</span>
                        : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
            onClick={handleSubscribe}
            aria-label={`Assinar ${product.name}`}
          >
            Assinar agora
          </button>
        </div>
      </div>
    </motion.section>
  );
});

ProductDetails.displayName = 'ProductDetails';

