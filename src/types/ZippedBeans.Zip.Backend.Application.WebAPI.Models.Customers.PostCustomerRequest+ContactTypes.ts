// ZippedBeans.Zip.Backend.Application.WebAPI.Models.Customers.PostCustomerRequest+Contact.ts

export interface Contact {
  email: string;
  phoneNumber: string;
  mobileNumber: string;
}

export interface ContactValidated extends Contact {
  isValidEmail: boolean;
  isValidPhoneNumber: boolean;
  isValidMobileNumber: boolean;
}