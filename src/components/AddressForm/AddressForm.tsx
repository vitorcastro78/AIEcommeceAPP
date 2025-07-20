
import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { usecountrie } from '../../hooks/usecountrie';
import { ZippedBeans } from '../../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Customers.AddressTypes';
import type { ZippedBeans as AddressTypes } from '../../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Customers.AddressTypes';

type AddressFormProps = {
  initialAddress?: Partial<AddressTypes>;
  onSubmit: (address: AddressTypes) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  className?: string;
};

const AddressForm: React.FC<AddressFormProps> = React.memo(
  ({ initialAddress, onSubmit, isSubmitting = false, submitLabel = 'Save Address', className }) => {
    const [address, setAddress] = useState<Partial<AddressTypes>>(initialAddress ?? {});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [formError, setFormError] = useState<string | null>(null);

    const { data: countries, isLoading: countriesLoading, error: countriesError } = usecountrie();

    const countryOptions = useMemo(
      () =>
        countries?.countries?.map((c: any) => ({
          code: c.code,
          name: c.name,
        })) ?? [],
      [countries]
    );

    const requiredFields: (keyof AddressTypes)[] = useMemo(
      () => [
        'firstName',
        'lastName',
        'addressLine1',
        'city',
        'postalCode',
        'country',
      ],
      []
    );

    const validate = useCallback(
      (values: Partial<AddressTypes>) => {
        for (const field of requiredFields) {
          if (!values[field] || (typeof values[field] === 'string' && !values[field]?.trim())) {
            return `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
          }
        }
        return null;
      },
      [requiredFields]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
      },
      []
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        setTouched((prev) => ({ ...prev, [e.target.name]: true }));
      },
      []
    );

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        const error = validate(address);
        setFormError(error);
        if (!error) {
          onSubmit(address as AddressTypes);
        }
      },
      [address, onSubmit, validate]
    );

    return (
      <motion.form
        className={`w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4 ${className ?? ''}`}
        onSubmit={handleSubmit}
        aria-label="Address Form"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        noValidate
      >
        <fieldset disabled={isSubmitting || countriesLoading} aria-busy={isSubmitting || countriesLoading}>
          <legend className="text-xl font-semibold mb-2">Shipping Address</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                First Name<span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.firstName && !address.firstName ? 'border-red-500' : 'border-gray-300'}`}
                value={address.firstName ?? ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required="true"
                aria-invalid={!!(touched.firstName && !address.firstName)}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                Last Name<span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.lastName && !address.lastName ? 'border-red-500' : 'border-gray-300'}`}
                value={address.lastName ?? ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required="true"
                aria-invalid={!!(touched.lastName && !address.lastName)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="addressLine1" className="block text-sm font-medium mb-1">
              Address Line 1<span className="text-red-500">*</span>
            </label>
            <input
              id="addressLine1"
              name="addressLine1"
              type="text"
              autoComplete="address-line1"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.addressLine1 && !address.addressLine1 ? 'border-red-500' : 'border-gray-300'}`}
              value={address.addressLine1 ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
              aria-invalid={!!(touched.addressLine1 && !address.addressLine1)}
            />
          </div>
          <div>
            <label htmlFor="addressLine2" className="block text-sm font-medium mb-1">
              Address Line 2
            </label>
            <input
              id="addressLine2"
              name="addressLine2"
              type="text"
              autoComplete="address-line2"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              value={address.addressLine2 ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="false"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                City<span className="text-red-500">*</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.city && !address.city ? 'border-red-500' : 'border-gray-300'}`}
                value={address.city ?? ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required="true"
                aria-invalid={!!(touched.city && !address.city)}
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
                Postal Code<span className="text-red-500">*</span>
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                autoComplete="postal-code"
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.postalCode && !address.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                value={address.postalCode ?? ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required="true"
                aria-invalid={!!(touched.postalCode && !address.postalCode)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-1">
              Country<span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              name="country"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.country && !address.country ? 'border-red-500' : 'border-gray-300'}`}
              value={address.country ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
              aria-invalid={!!(touched.country && !address.country)}
              disabled={countriesLoading}
            >
              <option value="" disabled>
                {countriesLoading ? 'Loading countries...' : 'Select country'}
              </option>
              {countryOptions.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            {countriesError && (
              <span className="text-red-500 text-xs mt-1 block" role="alert">
                Failed to load countries.
              </span>
            )}
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium mb-1">
              State/Province
            </label>
            <input
              id="state"
              name="state"
              type="text"
              autoComplete="address-level1"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              value={address.state ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="false"
            />
          </div>
          {formError && (
            <motion.div
              className="text-red-600 text-sm mt-2"
              role="alert"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {formError}
            </motion.div>
          )}
          <motion.button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition disabled:opacity-60"
            disabled={isSubmitting || countriesLoading}
            whileTap={{ scale: 0.97 }}
            aria-busy={isSubmitting}
            aria-label={submitLabel}
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
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              submitLabel
            )}
          </motion.button>
        </fieldset>
      </motion.form>
    );
  }
);

export default AddressForm;

