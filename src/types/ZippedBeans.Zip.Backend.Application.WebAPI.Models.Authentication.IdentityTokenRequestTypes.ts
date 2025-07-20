// ZippedBeans.Zip.Backend.Application.WebAPI.Models.Authentication.IdentityTokenRequest.ts

export interface IdentityTokenRequest {
  clientId: string;
  clientSecret: string;
  identityId: string;
  identityEmail: string;
  identityLocale: string;
}

export interface IdentityTokenRequestValidated extends IdentityTokenRequest {
  isValidClientId: boolean;
  isValidClientSecret: boolean;
  isValidIdentityId: boolean;
  isValidIdentityEmail: boolean;
  isValidIdentityLocale: boolean;
}