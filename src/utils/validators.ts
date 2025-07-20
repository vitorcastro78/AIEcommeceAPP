// src/validators.ts

export type ValidatorResult = { valid: true } | { valid: false; error: string };

/**
 * Validates if a value is a non-empty string.
 * @param value The value to validate.
 * @returns ValidatorResult
 */
export const isRequired = (value: unknown): ValidatorResult =>
  typeof value === 'string' && value.trim().length > 0
    ? { valid: true }
    : { valid: false, error: 'Field is required.' };

/**
 * Validates if a value is a valid email address.
 * @param value The value to validate.
 * @returns ValidatorResult
 */
export const isEmail = (value: unknown): ValidatorResult =>
  typeof value === 'string' &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? { valid: true }
    : { valid: false, error: 'Invalid email address.' };

/**
 * Validates if a value is a valid phone number (E.164 or common formats).
 * @param value The value to validate.
 * @returns ValidatorResult
 */
export const isPhone = (value: unknown): ValidatorResult =>
  typeof value === 'string' &&
  /^(\+?\d{1,3}[- ]?)?\d{7,15}$/.test(value.replace(/[()\s-]/g, ''))
    ? { valid: true }
    : { valid: false, error: 'Invalid phone number.' };

/**
 * Validates if a value is a valid postal code (generic, 3-10 alphanumeric).
 * @param value The value to validate.
 * @returns ValidatorResult
 */
export const isPostalCode = (value: unknown): ValidatorResult =>
  typeof value === 'string' &&
  /^[A-Za-z0-9\s\-]{3,10}$/.test(value)
    ? { valid: true }
    : { valid: false, error: 'Invalid postal code.' };

/**
 * Validates if a value is a valid credit card number (Luhn algorithm).
 * @param value The value to validate.
 * @returns ValidatorResult
 */
export const isCreditCard = (value: unknown): ValidatorResult => {
  if (typeof value !== 'string') return { valid: false, error: 'Invalid credit card number.' };
  const sanitized = value.replace(/\D/g, '');
  if (sanitized.length < 13 || sanitized.length > 19) return { valid: false, error: 'Invalid credit card number.' };
  let sum = 0;
  let shouldDouble = false;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = Number(sanitized[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0
    ? { valid: true }
    : { valid: false, error: 'Invalid credit card number.' };
};

/**
 * Validates if a value is a valid CVV (3 or 4 digits).
 * @param value The value to validate.
 * @returns ValidatorResult
 */
export const isCVV = (value: unknown): ValidatorResult =>
  typeof value === 'string' && /^\d{3,4}$/.test(value)
    ? { valid: true }
    : { valid: false, error: 'Invalid CVV.' };

/**
 * Validates if a value is a valid expiration date (MM/YY or MM/YYYY).
 * @param value The value to validate.
 * @returns ValidatorResult
 */
export const isExpiryDate = (value: unknown): ValidatorResult => {
  if (typeof value !== 'string') return { valid: false, error: 'Invalid expiry date.' };
  const match = value.match(/^(\d{2})\/(\d{2}|\d{4})$/);
  if (!match) return { valid: false, error: 'Invalid expiry date.' };
  const month = Number(match[1]);
  let year = Number(match[2]);
  if (month < 1 || month > 12) return { valid: false, error: 'Invalid expiry date.' };
  if (year < 100) year += 2000;
  const now = new Date();
  const expiry = new Date(year, month);
  return expiry > now
    ? { valid: true }
    : { valid: false, error: 'Card has expired.' };
};

/**
 * Composes multiple validators into one.
 * @param validators Array of validators.
 * @returns Validator function.
 */
export const composeValidators =
  (...validators: Array<(value: unknown) => ValidatorResult>) =>
  (value: unknown): ValidatorResult => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.valid) return result;
    }
    return { valid: true };
  };

// tests/validators.test.ts

import {
  isRequired,
  isEmail,
  isPhone,
  isPostalCode,
  isCreditCard,
  isCVV,
  isExpiryDate,
  composeValidators,
  ValidatorResult,
} from '../src/validators';

describe('Validators', () => {
  test('isRequired', () => {
    expect(isRequired('abc')).toEqual({ valid: true });
    expect(isRequired('')).toEqual({ valid: false, error: 'Field is required.' });
    expect(isRequired('   ')).toEqual({ valid: false, error: 'Field is required.' });
    expect(isRequired(null)).toEqual({ valid: false, error: 'Field is required.' });
  });

  test('isEmail', () => {
    expect(isEmail('test@example.com')).toEqual({ valid: true });
    expect(isEmail('invalid-email')).toEqual({ valid: false, error: 'Invalid email address.' });
    expect(isEmail('')).toEqual({ valid: false, error: 'Invalid email address.' });
  });

  test('isPhone', () => {
    expect(isPhone('+12345678901')).toEqual({ valid: true });
    expect(isPhone('123-456-7890')).toEqual({ valid: true });
    expect(isPhone('abc')).toEqual({ valid: false, error: 'Invalid phone number.' });
  });

  test('isPostalCode', () => {
    expect(isPostalCode('12345')).toEqual({ valid: true });
    expect(isPostalCode('A1B 2C3')).toEqual({ valid: true });
    expect(isPostalCode('')).toEqual({ valid: false, error: 'Invalid postal code.' });
    expect(isPostalCode('!@#')).toEqual({ valid: false, error: 'Invalid postal code.' });
  });

  test('isCreditCard', () => {
    expect(isCreditCard('4111 1111 1111 1111')).toEqual({ valid: true });
    expect(isCreditCard('1234 5678 9012 3456')).toEqual({ valid: false, error: 'Invalid credit card number.' });
    expect(isCreditCard('')).toEqual({ valid: false, error: 'Invalid credit card number.' });
  });

  test('isCVV', () => {
    expect(isCVV('123')).toEqual({ valid: true });
    expect(isCVV('1234')).toEqual({ valid: true });
    expect(isCVV('12')).toEqual({ valid: false, error: 'Invalid CVV.' });
    expect(isCVV('abcd')).toEqual({ valid: false, error: 'Invalid CVV.' });
  });

  test('isExpiryDate', () => {
    const futureYear = new Date().getFullYear() + 1;
    expect(isExpiryDate(`12/${futureYear}`)).toEqual({ valid: true });
    expect(isExpiryDate('01/99')).toEqual({ valid: true });
    expect(isExpiryDate('13/25')).toEqual({ valid: false, error: 'Invalid expiry date.' });
    expect(isExpiryDate('12/20')).toEqual({ valid: false, error: 'Card has expired.' });
    expect(isExpiryDate('invalid')).toEqual({ valid: false, error: 'Invalid expiry date.' });
  });

  test('composeValidators', () => {
    const validator = composeValidators(isRequired, isEmail);
    expect(validator('test@example.com')).toEqual({ valid: true });
    expect(validator('')).toEqual({ valid: false, error: 'Field is required.' });
    expect(validator('invalid')).toEqual({ valid: false, error: 'Invalid email address.' });
  });
});