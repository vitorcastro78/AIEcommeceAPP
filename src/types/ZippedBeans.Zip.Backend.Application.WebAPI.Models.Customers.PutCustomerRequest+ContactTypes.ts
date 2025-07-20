// PutCustomerRequestContact.ts

export interface PutCustomerRequestContact {
  email: string;
  phoneNumber: string;
  mobileNumber: string;
}

export interface PutCustomerRequestContactValidated extends PutCustomerRequestContact {
  isValidEmail: boolean;
  isValidPhoneNumber: boolean;
  isValidMobileNumber: boolean;
}