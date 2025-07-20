
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { usepayment, usepaymentMethod, usecustomer } from '../hooks/usepayment';
import { Rb2CoreSubscriptionEnumsPaymentMethodTypeTypes } from '../types/Rb2.Core.Subscription.Enums.PaymentMethodTypeTypes';
import { ZippedBeansZipBackendApplicationWebAPIModelsPaymentsCreateAdyenPaymentRequestCardDetailsTypes } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.CreateAdyenPaymentRequest+CardDetailsTypes';
import { ZippedBeansZipBackendApplicationWebAPIModelsPaymentsCreateAdyenPaymentRequestTypes } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.CreateAdyenPaymentRequestTypes';
import { ZippedBeansZipBackendApplicationWebAPIModelsPaymentsCreateAdyenPaymentResponseTypes } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.CreateAdyenPaymentResponseTypes';

type PaymentFormProps = {
  amount: number;
  currency: string;
  onSuccess: (paymentResponse: ZippedBeansZipBackendApplicationWebAPIModelsPaymentsCreateAdyenPaymentResponseTypes) => void;
  onError?: (error: string) => void;
  customerId: string;
  className?: string;
};

const paymentMethods = [
  { value: 'CreditCard', label: 'Credit Card' },
  { value: 'SEPA', label: 'SEPA Direct Debit' },
];

export const PaymentForm: React.FC<PaymentFormProps> = React.memo(
  ({ amount, currency, onSuccess, onError, customerId, className }) => {
    const [selectedMethod, setSelectedMethod] = useState<string>('CreditCard');
    const [cardDetails, setCardDetails] = useState<ZippedBeansZipBackendApplicationWebAPIModelsPaymentsCreateAdyenPaymentRequestCardDetailsTypes>({
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: '',
      holderName: '',
    });
    const [iban, setIban] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const { mutateAsync: createPayment } = usepayment();

    const handleMethodChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedMethod(e.target.value);
      setError(null);
    }, []);

    const handleCardInput = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardDetails((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      },
      []
    );

    const handleIbanInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setIban(e.target.value);
    }, []);

    const isCardValid = useMemo(() => {
      return (
        cardDetails.cardNumber.length >= 13 &&
        cardDetails.expiryMonth.length === 2 &&
        cardDetails.expiryYear.length === 2 &&
        cardDetails.cvc.length >= 3 &&
        cardDetails.holderName.length > 2
      );
    }, [cardDetails]);

    const isIbanValid = useMemo(() => iban.length > 10, [iban]);

    const isFormValid = useMemo(() => {
      if (selectedMethod === 'CreditCard') return isCardValid;
      if (selectedMethod === 'SEPA') return isIbanValid;
      return false;
    }, [selectedMethod, isCardValid, isIbanValid]);

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
          let paymentRequest: ZippedBeansZipBackendApplicationWebAPIModelsPaymentsCreateAdyenPaymentRequestTypes;
          if (selectedMethod === 'CreditCard') {
            paymentRequest = {
              customerId,
              amount,
              currency,
              paymentMethodType: Rb2CoreSubscriptionEnumsPaymentMethodTypeTypes.CreditCard,
              cardDetails,
            };
          } else {
            paymentRequest = {
              customerId,
              amount,
              currency,
              paymentMethodType: Rb2CoreSubscriptionEnumsPaymentMethodTypeTypes.SEPA,
              sepaIban: iban,
            };
          }
          const response = await createPayment(paymentRequest);
          onSuccess(response);
        } catch (err: any) {
          setError(err?.message || 'Payment failed');
          onError?.(err?.message || 'Payment failed');
        } finally {
          setIsSubmitting(false);
        }
      },
      [selectedMethod, cardDetails, iban, amount, currency, customerId, createPayment, onSuccess, onError]
    );

    return (
      <motion.form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 flex flex-col gap-6 ${className || ''}`}
        aria-label="Payment form"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        role="form"
      >
        <div>
          <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            id="payment-method"
            name="payment-method"
            value={selectedMethod}
            onChange={handleMethodChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-required="true"
            aria-label="Select payment method"
          >
            {paymentMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>
        {selectedMethod === 'CreditCard' && (
          <motion.div
            key="credit-card-fields"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="flex flex-col gap-4"
          >
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                id="cardNumber"
                name="cardNumber"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                maxLength={19}
                value={cardDetails.cardNumber}
                onChange={handleCardInput}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-required="true"
                aria-label="Card number"
                pattern="[0-9 ]*"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry MM
                </label>
                <input
                  id="expiryMonth"
                  name="expiryMonth"
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  value={cardDetails.expiryMonth}
                  onChange={handleCardInput}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-required="true"
                  aria-label="Expiry month"
                  pattern="[0-9]*"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry YY
                </label>
                <input
                  id="expiryYear"
                  name="expiryYear"
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  value={cardDetails.expiryYear}
                  onChange={handleCardInput}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-required="true"
                  aria-label="Expiry year"
                  pattern="[0-9]*"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  id="cvc"
                  name="cvc"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={cardDetails.cvc}
                  onChange={handleCardInput}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-required="true"
                  aria-label="CVC"
                  pattern="[0-9]*"
                />
              </div>
            </div>
            <div>
              <label htmlFor="holderName" className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                id="holderName"
                name="holderName"
                type="text"
                autoComplete="cc-name"
                value={cardDetails.holderName}
                onChange={handleCardInput}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-required="true"
                aria-label="Cardholder name"
              />
            </div>
          </motion.div>
        )}
        {selectedMethod === 'SEPA' && (
          <motion.div
            key="sepa-fields"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="flex flex-col gap-4"
          >
            <div>
              <label htmlFor="iban" className="block text-sm font-medium text-gray-700 mb-1">
                IBAN
              </label>
              <input
                id="iban"
                name="iban"
                type="text"
                autoComplete="off"
                value={iban}
                onChange={handleIbanInput}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-required="true"
                aria-label="IBAN"
              />
            </div>
          </motion.div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900" aria-live="polite">
              Total: {amount.toFixed(2)} {currency}
            </span>
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded bg-blue-600 text-white font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isSubmitting || !isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={isSubmitting || !isFormValid}
            aria-disabled={isSubmitting || !isFormValid}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
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
                Processing...
              </span>
            ) : (
              'Pay Now'
            )}
          </button>
        </div>
        {error && (
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative"
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="block">{error}</span>
          </motion.div>
        )}
      </motion.form>
    );
  }
);

export default PaymentForm;
