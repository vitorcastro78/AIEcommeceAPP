
import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { usecustomer } from '../hooks/usecustomer';
import { useubscription } from '../hooks/useubscription';
import { usepayment } from '../hooks/usepayment';
import { ZippedBeans } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Customers.GetCustomerResponseTypes';
import { ZippedBeans as SubscriptionTypes } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Subscriptions.GetSubscriptionDetailResponseTypes';

export interface UserProfileProps {
  userId: string;
  className?: string;
}

/**
 * UserProfile component for ecommerce subscriptions.
 * @param props UserProfileProps
 */
export const UserProfile: React.FC<UserProfileProps> = React.memo(({ userId, className }) => {
  const {
    data: customer,
    isLoading: isCustomerLoading,
    error: customerError,
    refetch: refetchCustomer,
  } = usecustomer(userId);

  const {
    data: subscriptions,
    isLoading: isSubscriptionsLoading,
    error: subscriptionsError,
    refetch: refetchSubscriptions,
  } = useubscription(userId);

  const {
    data: payments,
    isLoading: isPaymentsLoading,
    error: paymentsError,
    refetch: refetchPayments,
  } = usepayment(userId);

  const handleRetry = useCallback(() => {
    refetchCustomer();
    refetchSubscriptions();
    refetchPayments();
  }, [refetchCustomer, refetchSubscriptions, refetchPayments]);

  const isLoading = isCustomerLoading || isSubscriptionsLoading || isPaymentsLoading;
  const isError = customerError || subscriptionsError || paymentsError;

  const mainInfo = useMemo(() => {
    if (!customer) return null;
    const person = customer.person || {};
    const contact = customer.contact || {};
    return {
      name: person.firstName && person.lastName ? `${person.firstName} ${person.lastName}` : customer.email,
      email: customer.email,
      phone: contact.phone,
      address: customer.addresses?.[0],
    };
  }, [customer]);

  const activeSubscriptions = useMemo(() => {
    if (!subscriptions?.subscriptions) return [];
    return subscriptions.subscriptions.filter((sub: SubscriptionTypes.SubscriptionDetailTypes) =>
      ['Active', 'Trial'].includes(sub.status)
    );
  }, [subscriptions]);

  return (
    <motion.section
      className={`w-full max-w-3xl mx-auto p-4 md:p-8 bg-white rounded-lg shadow-lg ${className || ''}`}
      aria-label="User Profile"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: 'spring' }}
      tabIndex={0}
    >
      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[200px]" aria-busy="true">
          <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-gray-600 text-sm">Carregando perfil...</span>
        </div>
      )}
      {isError && (
        <div className="flex flex-col items-center justify-center min-h-[200px]" role="alert">
          <span className="text-red-600 text-lg font-semibold mb-2">Erro ao carregar dados do usuário.</span>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Tentar novamente"
          >
            Tentar novamente
          </button>
        </div>
      )}
      {!isLoading && !isError && mainInfo && (
        <div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <motion.div
              className="flex-shrink-0 w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              aria-label="Avatar do usuário"
            >
              {mainInfo.name?.[0]?.toUpperCase() || 'U'}
            </motion.div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1" aria-label="Nome do usuário">
                {mainInfo.name}
              </h2>
              <p className="text-gray-600 text-sm" aria-label="E-mail">{mainInfo.email}</p>
              {mainInfo.phone && (
                <p className="text-gray-600 text-sm" aria-label="Telefone">{mainInfo.phone}</p>
              )}
              {mainInfo.address && (
                <p className="text-gray-600 text-sm mt-1" aria-label="Endereço">
                  {mainInfo.address.street}, {mainInfo.address.city} - {mainInfo.address.country}
                </p>
              )}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Assinaturas Ativas</h3>
            {activeSubscriptions.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma assinatura ativa.</p>
            ) : (
              <ul className="space-y-4">
                {activeSubscriptions.map((sub: SubscriptionTypes.SubscriptionDetailTypes) => (
                  <motion.li
                    key={sub.id}
                    className="p-4 bg-gray-50 rounded-lg flex flex-col md:flex-row md:items-center justify-between"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    tabIndex={0}
                    aria-label={`Assinatura ${sub.productName}`}
                  >
                    <div>
                      <span className="font-medium text-gray-900">{sub.productName}</span>
                      <span className="ml-2 text-xs text-gray-500">{sub.status}</span>
                      <div className="text-gray-600 text-sm">
                        {sub.startDate} - {sub.endDate || 'Ativo'}
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {sub.ratePlans?.[0]?.price ? `R$ ${sub.ratePlans[0].price}` : 'Preço não disponível'}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Métodos de Pagamento</h3>
            {payments?.methods?.length ? (
              <ul className="space-y-2">
                {payments.methods.map((method: any) => (
                  <li
                    key={method.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded"
                    tabIndex={0}
                    aria-label={`Método de pagamento ${method.type}`}
                  >
                    <span className="text-gray-700 font-medium">{method.type}</span>
                    <span className="text-gray-500 text-xs">{method.last4 ? `•••• ${method.last4}` : ''}</span>
                    {method.isDefault && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Padrão</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Nenhum método de pagamento cadastrado.</p>
            )}
          </div>
        </div>
      )}
    </motion.section>
  );
});
