// src/services/recurringPaymentMethodApi.ts

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { 
  ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.PutRecurringPaymentMethodRequestTypes as PutRecurringPaymentMethodRequestTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.PutRecurringPaymentMethodRequestTypes';
import { 
  ZippedBeans.Zip.Backend.Application.WebAPI.Models.Customers.GetDefaultPaymentMethodResponseTypes as GetDefaultPaymentMethodResponseTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Customers.GetDefaultPaymentMethodResponseTypes';
import { 
  Microsoft.AspNetCore.Mvc.ProblemDetailsTypes as ProblemDetailsTypes 
} from '../types/Microsoft.AspNetCore.Mvc.ProblemDetailsTypes';

type PutRecurringPaymentMethodResponse = GetDefaultPaymentMethodResponseTypes | ProblemDetailsTypes;

const MAX_RETRIES = 3;
const RETRY_DELAY = 500;

const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function putRecurringPaymentMethod(
  data: PutRecurringPaymentMethodRequestTypes,
  retries = 0
): Promise<PutRecurringPaymentMethodResponse> {
  try {
    const response = await api.put<PutRecurringPaymentMethodResponse>(
      '/recurring-payment-method',
      data
    );
    return response.data;
  } catch (error) {
    if (
      retries < MAX_RETRIES &&
      axios.isAxiosError(error) &&
      (!error.response || error.response.status >= 500)
    ) {
      await delay(RETRY_DELAY * (retries + 1));
      return putRecurringPaymentMethod(data, retries + 1);
    }
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ProblemDetailsTypes;
    }
    throw error;
  }
}

export { putRecurringPaymentMethod };