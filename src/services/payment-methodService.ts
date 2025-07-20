// src/services/paymentMethodsApi.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ZippedBeans } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.GetPaymentMethodResponseTypes'
import { Rb2 } from '../types/Rb2.Core.Exceptions.ErrorMessageTypes'

const BASE_URL = '/api/payment-methods'
const MAX_RETRIES = 3
const RETRY_DELAY = 500

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function retryRequest<T>(
  fn: () => Promise<AxiosResponse<T>>,
  retries = MAX_RETRIES
): Promise<AxiosResponse<T>> {
  let lastError
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      await sleep(RETRY_DELAY)
    }
  }
  throw lastError
}

export interface GetPaymentMethodsParams {
  page?: number
  pageSize?: number
}

export async function getPaymentMethods(
  params?: GetPaymentMethodsParams,
  config?: AxiosRequestConfig
): Promise<ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.GetPaymentMethodResponseTypes[]> {
  const response = await retryRequest(() =>
    api.get<ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.GetPaymentMethodResponseTypes[]>('', {
      params,
      ...config,
    })
  )
  return response.data
}