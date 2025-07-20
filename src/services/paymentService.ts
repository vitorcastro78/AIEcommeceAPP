// src/services/paymentApi.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { 
  CreateAdyenPaymentRequestTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.CreateAdyenPaymentRequestTypes';
import { 
  CreateAdyenPaymentResponseTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.CreateAdyenPaymentResponseTypes';
import { 
  ProblemDetailsTypes 
} from '../types/Microsoft.AspNetCore.Mvc.ProblemDetailsTypes';

const BASE_URL = '/api/payment';
const MAX_RETRIES = 3;
let accessToken: string | null = null;

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
    return config;
  }
);

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Optionally handle token refresh here
    }
    return Promise.reject(error);
  }
);

export const setAccessToken = (token: string) => {
  accessToken = token;
};

const retryRequest = async <T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> => {
  let lastError: any;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === retries - 1) throw lastError;
      await new Promise(res => setTimeout(res, 500 * (attempt + 1)));
    }
  }
  throw lastError;
};

export const createPayment = async (
  data: CreateAdyenPaymentRequestTypes
): Promise<CreateAdyenPaymentResponseTypes> => {
  return retryRequest(async () => {
    try {
      const response = await api.post<CreateAdyenPaymentResponseTypes>('/', data);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errData = error.response.data as ProblemDetailsTypes;
        throw errData;
      }
      throw error;
    }
  });
};