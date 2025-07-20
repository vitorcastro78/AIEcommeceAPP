// src/services/authorizeClientApi.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { 
  AuthorizationUrlRequest as AuthorizationUrlRequestTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Authentication.AuthorizationUrlRequestTypes';
import { 
  AuthorizationUrlResponse as AuthorizationUrlResponseTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Authentication.AuthorizationUrlResponseTypes';
import { 
  ProblemDetails as ProblemDetailsTypes 
} from '../types/Microsoft.AspNetCore.Mvc.ProblemDetailsTypes';

type AuthorizeClientResponse = AuthorizationUrlResponseTypes | ProblemDetailsTypes;

const MAX_RETRIES = 3;
const RETRY_DELAY = 500;

const api: AxiosInstance = axios.create({
  baseURL: '/api/authorize/client',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = config.headers || {};
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
      // handle unauthorized globally if needed
    }
    return Promise.reject(error);
  }
);

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryRequest<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        await delay(RETRY_DELAY);
      }
    }
  }
  throw lastError;
}

export async function postAuthorizeClient(
  data: AuthorizationUrlRequestTypes,
  config?: AxiosRequestConfig
): Promise<AuthorizeClientResponse> {
  return retryRequest(async () => {
    try {
      const response = await api.post<AuthorizationUrlResponseTypes>(
        '',
        data,
        config
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data as ProblemDetailsTypes;
      }
      throw error;
    }
  });
}