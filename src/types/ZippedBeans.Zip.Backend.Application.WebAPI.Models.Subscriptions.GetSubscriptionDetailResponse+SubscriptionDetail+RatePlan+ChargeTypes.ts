export interface Charge {
  id: string;
  name: string;
  quantity: number;
  billingPeriod: string;
  pricing?: any;
  model?: any;
  discountAmount: number;
  discountPercentage: number;
}