// src/formatters.ts

export type CurrencyFormatterOptions = {
  locale?: string
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

export type DateFormatterOptions = {
  locale?: string
  dateStyle?: 'full' | 'long' | 'medium' | 'short'
  timeStyle?: 'full' | 'long' | 'medium' | 'short'
  timeZone?: string
}

export type PercentageFormatterOptions = {
  locale?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

/**
 * Formats a number as a currency string.
 * @param value The numeric value to format.
 * @param options Formatting options.
 * @returns The formatted currency string.
 * @throws If value is not a finite number.
 */
export const formatCurrency = (
  value: number,
  options: CurrencyFormatterOptions = {}
): string => {
  if (typeof value !== 'number' || !isFinite(value)) {
    throw new TypeError('Value must be a finite number')
  }
  const {
    locale = 'en-US',
    currency = 'USD',
    minimumFractionDigits,
    maximumFractionDigits,
  } = options
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value)
}

/**
 * Formats a Date or date string as a localized date string.
 * @param date The date to format.
 * @param options Formatting options.
 * @returns The formatted date string.
 * @throws If date is invalid.
 */
export const formatDate = (
  date: Date | string | number,
  options: DateFormatterOptions = {}
): string => {
  const {
    locale = 'en-US',
    dateStyle = 'medium',
    timeStyle,
    timeZone,
  } = options
  const d =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date
  if (!(d instanceof Date) || isNaN(d.getTime())) {
    throw new TypeError('Invalid date')
  }
  return new Intl.DateTimeFormat(locale, {
    dateStyle,
    timeStyle,
    timeZone,
  }).format(d)
}

/**
 * Formats a number as a percentage string.
 * @param value The numeric value to format (e.g., 0.25 for 25%).
 * @param options Formatting options.
 * @returns The formatted percentage string.
 * @throws If value is not a finite number.
 */
export const formatPercentage = (
  value: number,
  options: PercentageFormatterOptions = {}
): string => {
  if (typeof value !== 'number' || !isFinite(value)) {
    throw new TypeError('Value must be a finite number')
  }
  const {
    locale = 'en-US',
    minimumFractionDigits,
    maximumFractionDigits,
  } = options
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value)
}

/**
 * Formats a number as a localized decimal string.
 * @param value The numeric value to format.
 * @param locale The locale string.
 * @returns The formatted decimal string.
 * @throws If value is not a finite number.
 */
export const formatDecimal = (
  value: number,
  locale: string = 'en-US'
): string => {
  if (typeof value !== 'number' || !isFinite(value)) {
    throw new TypeError('Value must be a finite number')
  }
  return new Intl.NumberFormat(locale).format(value)
}

// tests/formatters.test.ts

import {
  formatCurrency,
  formatDate,
  formatPercentage,
  formatDecimal,
} from '../src/formatters'

describe('formatCurrency', () => {
  it('formats USD currency', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })
  it('formats BRL currency', () => {
    expect(formatCurrency(1234.56, { locale: 'pt-BR', currency: 'BRL' })).toBe('R$ 1.234,56')
  })
  it('throws on invalid value', () => {
    expect(() => formatCurrency(NaN)).toThrow()
  })
})

describe('formatDate', () => {
  it('formats date string', () => {
    expect(formatDate('2024-06-01')).toMatch(/\d{1,2}\/\d{1,2}\/\d{2,4}/)
  })
  it('formats with locale', () => {
    expect(formatDate('2024-06-01', { locale: 'pt-BR' })).toMatch(/\d{1,2}\/\d{1,2}\/\d{2,4}/)
  })
  it('throws on invalid date', () => {
    expect(() => formatDate('invalid-date')).toThrow()
  })
})

describe('formatPercentage', () => {
  it('formats percentage', () => {
    expect(formatPercentage(0.25)).toBe('25%')
  })
  it('formats with fraction digits', () => {
    expect(formatPercentage(0.1234, { minimumFractionDigits: 2 })).toBe('12.34%')
  })
  it('throws on invalid value', () => {
    expect(() => formatPercentage(Infinity)).toThrow()
  })
})

describe('formatDecimal', () => {
  it('formats decimal', () => {
    expect(formatDecimal(1234567.89)).toBe('1,234,567.89')
  })
  it('formats with locale', () => {
    expect(formatDecimal(1234567.89, 'de-DE')).toBe('1.234.567,89')
  })
  it('throws on invalid value', () => {
    expect(() => formatDecimal('foo' as any)).toThrow()
  })
})