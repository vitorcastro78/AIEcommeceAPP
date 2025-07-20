// ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.GetPaymentMethodResponse+CreditCardInfo.ts

export interface CreditCardInfo {
  id: string;
  expirationMonth: string;
  cardNumber: string;
  expirationYear: string;
  cardType: string;
  cardHolderName: string;
}

export type { CreditCardInfo as GetPaymentMethodResponseCreditCardInfo };