import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ZippedBeans } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponseTypes';

const BASE_URL = '/api/products';
const MAX_RETRIES = 3;
let accessToken: string | null = null;

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
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
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.config &&
      error.response &&
      error.response.status === 401 &&
      !error.config._retry
    ) {
      error.config._retry = true;
      // Insert token refresh logic here if needed
    }
    return Promise.reject(error);
  }
);

export const setAccessToken = (token: string) => {
  accessToken = token;
};

type GetProductsParams = {
  page?: number;
  pageSize?: number;
  [key: string]: any;
};

const retryRequest = async <T>(
  fn: () => Promise<AxiosResponse<T>>,
  retries = MAX_RETRIES
): Promise<AxiosResponse<T>> => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i === retries - 1) throw error;
      await new Promise((res) => setTimeout(res, 500 * (i + 1)));
    }
  }
  throw lastError;
};

export const getProducts = async (
  params?: GetProductsParams
): Promise<ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponseTypes> => {
  try {
    const response = await retryRequest(() =>
      api.get<ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponseTypes>('', {
        params,
      })
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};