
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usecountrie } from "../hooks/usecountrie";
import { usecustomer } from "../hooks/usecustomer";
import { usepayment } from "../hooks/usepayment";
import { useproduct } from "../hooks/useproduct";
import { useubscription } from "../hooks/useubscription";
import { ZippedBeans } from "../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Customers.AddressTypes";
import { ZippedBeans as ZippedBeansCustomer } from "../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Customers.GetCustomerResponseTypes";
import { ZippedBeans as ZippedBeansProduct } from "../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponseTypes";
import { ZippedBeans as ZippedBeansPayment } from "../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.GetPaymentMethodResponseTypes";

type CheckoutFormProps = {
  selectedProductId: string;
  onSuccess?: (subscriptionId: string) => void;
  onError?: (error: string) => void;
  className?: string;
};

/**
 * CheckoutForm component for subscription ecommerce.
 */
export const CheckoutForm: React.FC<CheckoutFormProps> = React.memo(
  ({ selectedProductId, onSuccess, onError, className }) => {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
      firstName: "",
      lastName: "",
      email: "",
      country: "",
      address: "",
      city: "",
      zip: "",
      paymentMethodId: "",
    });
    const [errors, setErrors] = useState<{ [k: string]: string }>({});
    const [submitting, setSubmitting] = useState(false);

    const { data: countries, isLoading: loadingCountries } = usecountrie();
    const { data: customer, isLoading: loadingCustomer } = usecustomer();
    const { data: products, isLoading: loadingProducts } = useproduct();
    const { data: paymentMethods, isLoading: loadingPayments } = usepayment();
    const { mutateAsync: createSubscription } = useubscription();

    useEffect(() => {
      if (customer?.person) {
        setForm((prev) => ({
          ...prev,
          firstName: customer.person.firstName || "",
          lastName: customer.person.lastName || "",
          email: customer.contact?.email || "",
          country: customer.address?.country || "",
          address: customer.address?.addressLine1 || "",
          city: customer.address?.city || "",
          zip: customer.address?.postalCode || "",
        }));
      }
    }, [customer]);

    const selectedProduct = useMemo(
      () =>
        products?.products?.find(
          (p: any) => p.productId === selectedProductId
        ),
      [products, selectedProductId]
    );

    const availablePaymentMethods = useMemo(
      () => paymentMethods?.paymentMethods || [],
      [paymentMethods]
    );

    const validateStep = useCallback(() => {
      const stepErrors: { [k: string]: string } = {};
      if (step === 0) {
        if (!form.firstName) stepErrors.firstName = "First name required";
        if (!form.lastName) stepErrors.lastName = "Last name required";
        if (!form.email) stepErrors.email = "Email required";
      }
      if (step === 1) {
        if (!form.country) stepErrors.country = "Country required";
        if (!form.address) stepErrors.address = "Address required";
        if (!form.city) stepErrors.city = "City required";
        if (!form.zip) stepErrors.zip = "ZIP required";
      }
      if (step === 2) {
        if (!form.paymentMethodId)
          stepErrors.paymentMethodId = "Payment method required";
      }
      setErrors(stepErrors);
      return Object.keys(stepErrors).length === 0;
    }, [form, step]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
      },
      []
    );

    const handleNext = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep()) setStep((s) => s + 1);
      },
      [validateStep]
    );

    const handleBack = useCallback(() => setStep((s) => s - 1), []);

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep()) return;
        setSubmitting(true);
        try {
          const payload = {
            customer: {
              person: {
                firstName: form.firstName,
                lastName: form.lastName,
              },
              contact: {
                email: form.email,
              },
              address: {
                country: form.country,
                addressLine1: form.address,
                city: form.city,
                postalCode: form.zip,
              },
            },
            productId: selectedProductId,
            paymentMethodId: form.paymentMethodId,
          };
          const resp = await createSubscription(payload);
          setSubmitting(false);
          if (onSuccess) onSuccess(resp.subscriptionId);
        } catch (err: any) {
          setSubmitting(false);
          if (onError) onError(err?.message || "Checkout failed");
        }
      },
      [
        form,
        selectedProductId,
        createSubscription,
        onSuccess,
        onError,
        validateStep,
      ]
    );

    return (
      <motion.form
        className={`w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6 ${className || ""}`}
        aria-labelledby="checkout-title"
        onSubmit={step === 2 ? handleSubmit : handleNext}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2
          id="checkout-title"
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          Checkout
        </h2>
        <div className="flex items-center justify-between mb-4" aria-label="Progress">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 mx-1 rounded-full ${
                step >= s ? "bg-blue-500" : "bg-gray-200"
              }`}
              aria-current={step === s ? "step" : undefined}
            />
          ))}
        </div>
        {step === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
            aria-label="Personal Information"
          >
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                className={`mt-1 block w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.firstName ? "border-red-500" : ""
                }`}
                value={form.firstName}
                onChange={handleChange}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
                required
              />
              {errors.firstName && (
                <span
                  id="firstName-error"
                  className="text-red-600 text-xs"
                  role="alert"
                >
                  {errors.firstName}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                className={`mt-1 block w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.lastName ? "border-red-500" : ""
                }`}
                value={form.lastName}
                onChange={handleChange}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
                required
              />
              {errors.lastName && (
                <span
                  id="lastName-error"
                  className="text-red-600 text-xs"
                  role="alert"
                >
                  {errors.lastName}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`mt-1 block w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
                value={form.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                required
              />
              {errors.email && (
                <span
                  id="email-error"
                  className="text-red-600 text-xs"
                  role="alert"
                >
                  {errors.email}
                </span>
              )}
            </div>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
            aria-label="Address Information"
          >
            <div>
              <label htmlFor="country" className="block text-sm font-medium">
                Country
              </label>
              <select
                id="country"
                name="country"
                className={`mt-1 block w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.country ? "border-red-500" : ""
                }`}
                value={form.country}
                onChange={handleChange}
                aria-invalid={!!errors.country}
                aria-describedby={errors.country ? "country-error" : undefined}
                required
                disabled={loadingCountries}
              >
                <option value="">Select country</option>
                {countries?.countries?.map((c: any) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <span
                  id="country-error"
                  className="text-red-600 text-xs"
                  role="alert"
                >
                  {errors.country}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                className={`mt-1 block w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.address ? "border-red-500" : ""
                }`}
                value={form.address}
                onChange={handleChange}
                aria-invalid={!!errors.address}
                aria-describedby={errors.address ? "address-error" : undefined}
                required
              />
              {errors.address && (
                <span
                  id="address-error"
                  className="text-red-600 text-xs"
                  role="alert"
                >
                  {errors.address}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                className={`mt-1 block w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.city ? "border-red-500" : ""
                }`}
                value={form.city}
                onChange={handleChange}
                aria-invalid={!!errors.city}
                aria-describedby={errors.city ? "city-error" : undefined}
                required
              />
              {errors.city && (
                <span
                  id="city-error"
                  className="text-red-600 text-xs"
                  role="alert"
                >
                  {errors.city}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium">
                ZIP
              </label>
              <input
                id="zip"
                name="zip"
                type="text"
                autoComplete="postal-code"
                className={`mt-1 block w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.zip ? "border-red-500" : ""
                }`}
                value={form.zip}
                onChange={handleChange}
                aria-invalid={!!errors.zip}
                aria-describedby={errors.zip ? "zip-error" : undefined}
                required
              />
              {errors.zip && (
                <span
                  id="zip-error"
                  className="text-red-600 text-xs"
                  role="alert"
                >
                  {errors.zip}
                </span>
              )}
            </div>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
            aria-label="Payment Information"
          >
            <div>
              <label htmlFor="paymentMethodId" className="block text-sm font-medium">
                Payment Method
              </label>
              <select
                id="paymentMethodId"
                name="paymentMethodId"
                className={`mt-1 block w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.paymentMethodId ? "border-red-500" : ""
                }`}
                value={form.paymentMethodId}
                onChange={handleChange}
                aria-invalid={!!errors.paymentMethodId}
                aria-describedby={errors.paymentMethodId ? "paymentMethodId-error" : undefined}
                required
                disabled={loadingPayments}
              >
                <option value="">Select payment method</option>
                {availablePaymentMethods.map((pm: any) => (
                  <option key={pm.paymentMethodId} value={pm.paymentMethodId}>
                    {pm.type} {pm.cardInfo ? `•••• ${pm.cardInfo.last4}` : ""}
                  </option>
                ))}
              </select>
              {errors.paymentMethodId && (
                <span
                  id="paymentMethodId-error"
                  className="text-red-600 text-xs"
                  role="alert"
                >
                  {errors.paymentMethodId}
                </span>
              )}
            </div>
            <div className="bg-gray-50 rounded p-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Subscription</span>
                <span className="text-gray-900 font-semibold">
                  {selectedProduct?.name || "Product"}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-600">Price</span>
                <span className="text-gray-900 font-bold">
                  {selectedProduct?.ratePlans?.[0]?.charges?.[0]?.price
                    ? `€${selectedProduct.ratePlans[0].charges[0].price.toFixed(2)}`
                    : "--"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
        <div className="flex items-center justify-between mt-6">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Back"
              disabled={submitting}
            >
              Back
            </button>
          )}
          <div className="flex-1" />
          {step < 2 && (
            <button
              type="submit"
              className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next"
              disabled={submitting}
            >
              {loadingCountries || loadingCustomer || loadingProducts
                ? (
                  <span className="animate-pulse">Loading...</span>
                )
                : "Next"}
            </button>
          )}
          {step === 2 && (
            <button
              type="submit"
              className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Subscribe"
              disabled={submitting}
            >
              {submitting ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                "Subscribe"
              )}
            </button>
          )}
        </div>
      </motion.form>
    );
  }
);
