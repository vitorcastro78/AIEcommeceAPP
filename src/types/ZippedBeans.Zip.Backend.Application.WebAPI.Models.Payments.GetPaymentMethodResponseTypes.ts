// ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.GetPaymentMethodResponse.ts

export interface CreditCardData {
  cardHolderName: string;
  lastFourDigits: string;
  expirationMonth: number;
  expirationYear: number;
  brand: string;
}

export interface GetPaymentMethodResponse {
  id: string;
  isDefault: boolean;
  paymentMethodType: string;
  creditCardData?: CreditCardData | null;
}