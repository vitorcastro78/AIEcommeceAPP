// src/services/paymentTransactionsApi.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { 
  PutPaymentTransactionRequestTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.PutPaymentTransactionRequestTypes';
import { 
  PutPaymentTransactionResponseTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.PutPaymentTransactionResponseTypes';
import { 
  ErrorMessageTypes 
} from '../types/Rb2.Core.Exceptions.ErrorMessageTypes';

const MAX_RETRIES = 3;

const api: AxiosInstance = axios.create({
  baseURL: '/api/payment-transactions',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

async function putPaymentTransaction(
  data: PutPaymentTransactionRequestTypes,
  config?: AxiosRequestConfig,
  retryCount = 0
): Promise<PutPaymentTransactionResponseTypes> {
  try {
    const response = await api.put<PutPaymentTransactionResponseTypes>('/', data, config);
    return response.data;
  } catch (error) {
    if (
      retryCount < MAX_RETRIES &&
      axios.isAxiosError(error) &&
      (!error.response || error.response.status >= 500)
    ) {
      return putPaymentTransaction(data, config, retryCount + 1);
    }
    if (axios.isAxiosError(error) && error.response?.data) {
      throw error.response.data as ErrorMessageTypes;
    }
    throw error;
  }
}

export { putPaymentTransaction };