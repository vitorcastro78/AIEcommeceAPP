// CardDetails.ts

export interface CardDetails {
  type: string; // e.g., 'scheme'
  cardNumber: string; // 12-19 digits, numeric string
  expiryMonth: string; // MM, 01-12
  expiryYear: string; // YYYY, >= current year
  name: string; // Cardholder name
  securityCode: string; // 3-4 digits, numeric string
}

export type CardDetailsValidation = {
  type: (value: string) => boolean;
  cardNumber: (value: string) => boolean;
  expiryMonth: (value: string) => boolean;
  expiryYear: (value: string) => boolean;
  name: (value: string) => boolean;
  securityCode: (value: string) => boolean;
};

export const cardDetailsValidation: CardDetailsValidation = {
  type: (value) => typeof value === 'string' && value.length > 0,
  cardNumber: (value) => /^\d{12,19}$/.test(value),
  expiryMonth: (value) => /^(0[1-9]|1[0-2])$/.test(value),
  expiryYear: (value) => /^\d{4}$/.test(value) && Number(value) >= new Date().getFullYear(),
  name: (value) => typeof value === 'string' && value.trim().length > 0,
  securityCode: (value) => /^\d{3,4}$/.test(value),
};