// src/helpers/currency.ts
export type CurrencyFormatOptions = {
  locale?: string
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

/**
 * Formats a number as a currency string.
 * @param amount The numeric amount to format.
 * @param options Formatting options.
 * @returns The formatted currency string.
 */
export const formatCurrency = (
  amount: number,
  options: CurrencyFormatOptions = {}
): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new TypeError('Amount must be a valid number')
  }
  const {
    locale = 'en-US',
    currency = 'USD',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options
  return amount.toLocaleString(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  })
}

// src/helpers/discount.ts
/**
 * Calculates the discounted price.
 * @param price The original price.
 * @param discount Discount percentage (0-100).
 * @returns The price after discount.
 */
export const applyDiscount = (price: number, discount: number): number => {
  if (typeof price !== 'number' || isNaN(price) || price < 0) {
    throw new TypeError('Price must be a non-negative number')
  }
  if (typeof discount !== 'number' || isNaN(discount) || discount < 0 || discount > 100) {
    throw new RangeError('Discount must be a number between 0 and 100')
  }
  return +(price * (1 - discount / 100)).toFixed(2)
}

// src/helpers/cart.ts
export type CartItem = {
  id: string
  price: number
  quantity: number
}

/**
 * Calculates the total price of cart items.
 * @param items Array of cart items.
 * @returns The total price.
 */
export const calculateCartTotal = (items: CartItem[]): number => {
  if (!Array.isArray(items)) {
    throw new TypeError('Items must be an array')
  }
  return items.reduce((total, item) => {
    if (
      !item ||
      typeof item.price !== 'number' ||
      typeof item.quantity !== 'number' ||
      item.price < 0 ||
      item.quantity < 0
    ) {
      throw new TypeError('Invalid cart item')
    }
    return total + item.price * item.quantity
  }, 0)
}

// src/helpers/sku.ts
/**
 * Validates a SKU string.
 * @param sku The SKU to validate.
 * @returns True if valid, false otherwise.
 */
export const isValidSKU = (sku: string): boolean => {
  if (typeof sku !== 'string') {
    throw new TypeError('SKU must be a string')
  }
  return /^[A-Z0-9-_]{3,32}$/.test(sku)
}

// src/helpers/stock.ts
/**
 * Checks if the requested quantity is available in stock.
 * @param stock Current stock.
 * @param requested Requested quantity.
 * @returns True if available, false otherwise.
 */
export const isStockAvailable = (stock: number, requested: number): boolean => {
  if (
    typeof stock !== 'number' ||
    typeof requested !== 'number' ||
    isNaN(stock) ||
    isNaN(requested) ||
    stock < 0 ||
    requested < 0
  ) {
    throw new TypeError('Stock and requested must be non-negative numbers')
  }
  return stock >= requested
}

// tests/helpers.test.ts
import {
  formatCurrency,
  applyDiscount,
  calculateCartTotal,
  isValidSKU,
  isStockAvailable,
  CartItem,
} from '../src/helpers/currency'
import * as currency from '../src/helpers/currency'
import * as discount from '../src/helpers/discount'
import * as cart from '../src/helpers/cart'
import * as sku from '../src/helpers/sku'
import * as stock from '../src/helpers/stock'

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(currency.formatCurrency(1234.56)).toBe('$1,234.56')
  })
  it('formats with custom locale and currency', () => {
    expect(currency.formatCurrency(1234.56, { locale: 'pt-BR', currency: 'BRL' })).toBe('R$ 1.234,56')
  })
  it('throws on invalid amount', () => {
    expect(() => currency.formatCurrency(NaN)).toThrow()
  })
})

describe('applyDiscount', () => {
  it('applies discount correctly', () => {
    expect(discount.applyDiscount(100, 10)).toBe(90)
  })
  it('throws on invalid price', () => {
    expect(() => discount.applyDiscount(-1, 10)).toThrow()
  })
  it('throws on invalid discount', () => {
    expect(() => discount.applyDiscount(100, 200)).toThrow()
  })
})

describe('calculateCartTotal', () => {
  it('calculates total', () => {
    const items: cart.CartItem[] = [
      { id: 'a', price: 10, quantity: 2 },
      { id: 'b', price: 5, quantity: 1 },
    ]
    expect(cart.calculateCartTotal(items)).toBe(25)
  })
  it('throws on invalid items', () => {
    expect(() => cart.calculateCartTotal([{ id: 'a', price: -1, quantity: 1 }])).toThrow()
  })
})

describe('isValidSKU', () => {
  it('validates correct SKU', () => {
    expect(sku.isValidSKU('ABC-123')).toBe(true)
  })
  it('invalidates incorrect SKU', () => {
    expect(sku.isValidSKU('ab')).toBe(false)
  })
})

describe('isStockAvailable', () => {
  it('returns true if stock is enough', () => {
    expect(stock.isStockAvailable(10, 5)).toBe(true)
  })
  it('returns false if stock is not enough', () => {
    expect(stock.isStockAvailable(2, 5)).toBe(false)
  })
  it('throws on invalid input', () => {
    expect(() => stock.isStockAvailable(-1, 1)).toThrow()
  })
})