
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { 
  GetCustomerResponseTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Customers.GetCustomerResponseTypes';
import { 
  PostCustomerRequestTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Customers.PostCustomerRequestTypes';
import { 
  PutCustomerRequestTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Customers.PutCustomerRequestTypes';
import { 
  ProblemDetailsTypes 
} from '../types/Microsoft.AspNetCore.Mvc.ProblemDetailsTypes';

const BASE_URL = '/api/customers';
const MAX_RETRIES = 3;

let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Handle token refresh logic here if needed
    }
    return Promise.reject(error);
  }
);

const withRetry = async <T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> => {
  let lastError: any;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw lastError;
};

export type GetCustomersParams = {
  page?: number;
  pageSize?: number;
  [key: string]: any;
};

export const getCustomers = async (
  params?: GetCustomersParams,
  config?: AxiosRequestConfig
): Promise<GetCustomerResponseTypes> => {
  return withRetry(async () => {
    const response = await api.get<GetCustomerResponseTypes>('', {
      params,
      ...config,
    });
    return response.data;
  });
};

export const postCustomer = async (
  data: PostCustomerRequestTypes,
  config?: AxiosRequestConfig
): Promise<GetCustomerResponseTypes> => {
  return withRetry(async () => {
    const response = await api.post<GetCustomerResponseTypes>('', data, config);
    return response.data;
  });
};

export const putCustomer = async (
  customerId: string,
  data: PutCustomerRequestTypes,
  config?: AxiosRequestConfig
): Promise<GetCustomerResponseTypes> => {
  return withRetry(async () => {
    const response = await api.put<GetCustomerResponseTypes>(`/${customerId}`, data, config);
    return response.data;
  });
};
