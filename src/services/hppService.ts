// src/services/zuoraApiService.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import { 
  CreateZuoraHppInstanceRequestTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.CreateZuoraHppInstanceRequestTypes'
import { 
  CreateZuoraHppInstanceResponseTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.CreateZuoraHppInstanceResponseTypes'
import { 
  ProblemDetailsTypes 
} from '../types/Microsoft.AspNetCore.Mvc.ProblemDetailsTypes'

const BASE_URL = '/api/hpp/zuora'
const MAX_RETRIES = 3

let accessToken: string | null = null

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // handle token refresh logic here if needed
    }
    return Promise.reject(error)
  }
)

export const setZuoraApiAccessToken = (token: string) => {
  accessToken = token
}

async function retryRequest<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  let lastError: any
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt === retries - 1) throw error
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
    }
  }
  throw lastError
}

export type ZuoraHppPostResponse = CreateZuoraHppInstanceResponseTypes | ProblemDetailsTypes

export const postZuoraHpp = async (
  data: CreateZuoraHppInstanceRequestTypes
): Promise<ZuoraHppPostResponse> => {
  return retryRequest(async () => {
    try {
      const response = await api.post<CreateZuoraHppInstanceResponseTypes>('/', data)
      return response.data
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data as ProblemDetailsTypes
      }
      throw error
    }
  })
}