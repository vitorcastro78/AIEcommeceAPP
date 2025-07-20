// RatePlan.ts

export interface RatePlanCharge {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  billingPeriod: string;
  status: string;
  effectiveStartDate: string;
  effectiveEndDate: string;
}

export interface RatePlan {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive' | 'Pending' | string;
  effectiveStartDate: string;
  effectiveEndDate: string;
  totalPrice: number;
  rateplanCharges: RatePlanCharge[];
}