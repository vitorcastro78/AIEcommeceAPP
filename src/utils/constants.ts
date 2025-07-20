// src/constants/ecommerceConstants.ts

export type Currency = 'USD' | 'EUR' | 'BRL' | 'GBP' | 'JPY'

export type PaymentMethod = 'credit_card' | 'paypal' | 'pix' | 'boleto' | 'apple_pay' | 'google_pay'

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

export type ShippingMethod = 'standard' | 'express' | 'pickup' | 'same_day'

export const CURRENCIES: ReadonlyArray<Currency> = ['USD', 'EUR', 'BRL', 'GBP', 'JPY']

export const PAYMENT_METHODS: ReadonlyArray<PaymentMethod> = [
  'credit_card',
  'paypal',
  'pix',
  'boleto',
  'apple_pay',
  'google_pay'
]

export const ORDER_STATUSES: ReadonlyArray<OrderStatus> = [
  'pending',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
]

export const SHIPPING_METHODS: ReadonlyArray<ShippingMethod> = [
  'standard',
  'express',
  'pickup',
  'same_day'
]

/**
 * Checks if a value is a valid currency.
 * @param value - The value to check.
 * @returns True if valid, false otherwise.
 */
export function isValidCurrency(value: unknown): value is Currency {
  return typeof value === 'string' && CURRENCIES.includes(value as Currency)
}

/**
 * Checks if a value is a valid payment method.
 * @param value - The value to check.
 * @returns True if valid, false otherwise.
 */
export function isValidPaymentMethod(value: unknown): value is PaymentMethod {
  return typeof value === 'string' && PAYMENT_METHODS.includes(value as PaymentMethod)
}

/**
 * Checks if a value is a valid order status.
 * @param value - The value to check.
 * @returns True if valid, false otherwise.
 */
export function isValidOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === 'string' && ORDER_STATUSES.includes(value as OrderStatus)
}

/**
 * Checks if a value is a valid shipping method.
 * @param value - The value to check.
 * @returns True if valid, false otherwise.
 */
export function isValidShippingMethod(value: unknown): value is ShippingMethod {
  return typeof value === 'string' && SHIPPING_METHODS.includes(value as ShippingMethod)
}

/**
 * Gets a constant by type and value.
 * @param type - The constant type.
 * @param value - The value to retrieve.
 * @throws If the value is invalid for the given type.
 * @returns The value if valid.
 */
export function getConstant<T extends 'currency' | 'payment' | 'orderStatus' | 'shipping'>(
  type: T,
  value: string
): Currency | PaymentMethod | OrderStatus | ShippingMethod {
  switch (type) {
    case 'currency':
      if (isValidCurrency(value)) return value
      throw new Error('Invalid currency')
    case 'payment':
      if (isValidPaymentMethod(value)) return value
      throw new Error('Invalid payment method')
    case 'orderStatus':
      if (isValidOrderStatus(value)) return value
      throw new Error('Invalid order status')
    case 'shipping':
      if (isValidShippingMethod(value)) return value
      throw new Error('Invalid shipping method')
    default:
      throw new Error('Invalid constant type')
  }
}

// tests/constants/ecommerceConstants.test.ts

import {
  isValidCurrency,
  isValidPaymentMethod,
  isValidOrderStatus,
  isValidShippingMethod,
  getConstant,
  CURRENCIES,
  PAYMENT_METHODS,
  ORDER_STATUSES,
  SHIPPING_METHODS
} from '../src/constants/ecommerceConstants'

describe('ecommerceConstants', () => {
  test('isValidCurrency', () => {
    expect(isValidCurrency('USD')).toBe(true)
    expect(isValidCurrency('BRL')).toBe(true)
    expect(isValidCurrency('INR')).toBe(false)
    expect(isValidCurrency(123)).toBe(false)
  })

  test('isValidPaymentMethod', () => {
    expect(isValidPaymentMethod('paypal')).toBe(true)
    expect(isValidPaymentMethod('pix')).toBe(true)
    expect(isValidPaymentMethod('bitcoin')).toBe(false)
    expect(isValidPaymentMethod(null)).toBe(false)
  })

  test('isValidOrderStatus', () => {
    expect(isValidOrderStatus('pending')).toBe(true)
    expect(isValidOrderStatus('delivered')).toBe(true)
    expect(isValidOrderStatus('processing')).toBe(false)
    expect(isValidOrderStatus(undefined)).toBe(false)
  })

  test('isValidShippingMethod', () => {
    expect(isValidShippingMethod('express')).toBe(true)
    expect(isValidShippingMethod('pickup')).toBe(true)
    expect(isValidShippingMethod('drone')).toBe(false)
    expect(isValidShippingMethod({})).toBe(false)
  })

  test('getConstant returns valid constants', () => {
    expect(getConstant('currency', 'USD')).toBe('USD')
    expect(getConstant('payment', 'paypal')).toBe('paypal')
    expect(getConstant('orderStatus', 'paid')).toBe('paid')
    expect(getConstant('shipping', 'standard')).toBe('standard')
  })

  test('getConstant throws on invalid values', () => {
    expect(() => getConstant('currency', 'INR')).toThrow('Invalid currency')
    expect(() => getConstant('payment', 'bitcoin')).toThrow('Invalid payment method')
    expect(() => getConstant('orderStatus', 'processing')).toThrow('Invalid order status')
    expect(() => getConstant('shipping', 'drone')).toThrow('Invalid shipping method')
    expect(() => getConstant('currency' as any, 'USD')).not.toThrow()
    expect(() => getConstant('invalid' as any, 'USD')).toThrow('Invalid constant type')
  })

  test('constants arrays are correct', () => {
    expect(CURRENCIES).toContain('USD')
    expect(PAYMENT_METHODS).toContain('paypal')
    expect(ORDER_STATUSES).toContain('pending')
    expect(SHIPPING_METHODS).toContain('express')
  })
})