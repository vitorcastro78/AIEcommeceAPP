// PutCustomerRequest.ts

export interface PersonalInfo {
}

export interface ContactInfo {
}

export interface Address {
}

export interface PutCustomerRequest {
  personalInfo?: PersonalInfo;
  contactInfo?: ContactInfo;
  addresses?: Address[];
  additionalEmailAddresses?: string[];
}