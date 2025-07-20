// SubscriptionDetail.ts

export interface SubscriptionDetail {
  number: string;
  startDate: string;
  endDate: string;
  status: string | null;
  ratePlans: any[]; // Replace 'any' with a specific RatePlan interface if available
  currentTerm: number;
  autoRenew: boolean;
  initialTerm: number;
  renewalTerm: number;
}