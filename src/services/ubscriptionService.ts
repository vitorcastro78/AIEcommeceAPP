// src/services/subscriptionApi.ts

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { 
  GetSubscriptionDetailResponseTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Subscriptions.GetSubscriptionDetailResponseTypes'
import { 
  PostSubscriptionRequestTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Subscriptions.PostSubscriptionRequestTypes'
import { 
  Rb2CoreExceptionsErrorMessageTypes as ErrorMessageTypes 
} from '../types/Rb2.Core.Exceptions.ErrorMessageTypes'

const MAX_RETRIES = 3

const api: AxiosInstance = axios.create({
  baseURL: '/api/subscriptions',
  timeout: 10000,
})

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('authToken')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

async function retryRequest<T>(fn: () => Promise<AxiosResponse<T>>, retries = MAX_RETRIES): Promise<T> {
  let lastError: any
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fn()
      return res.data
    } catch (err) {
      lastError = err
      if (axios.isAxiosError(err) && (!err.response || err.response.status >= 500)) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)))
        continue
      }
      throw formatError(err)
    }
  }
  throw formatError(lastError)
}

function formatError(error: any): ErrorMessageTypes {
  if (axios.isAxiosError(error)) {
    if (error.response && error.response.data) {
      return error.response.data as ErrorMessageTypes
    }
    return { message: error.message }
  }
  return { message: 'Unknown error' }
}

export async function getSubscriptions(params?: { page?: number; pageSize?: number }): Promise<GetSubscriptionDetailResponseTypes> {
  return retryRequest(() =>
    api.get<GetSubscriptionDetailResponseTypes>('', {
      params: {
        page: params?.page,
        pageSize: params?.pageSize,
      },
    })
  )
}

export async function postSubscription(data: PostSubscriptionRequestTypes): Promise<GetSubscriptionDetailResponseTypes> {
  return retryRequest(() =>
    api.post<GetSubscriptionDetailResponseTypes>('', data)
  )
}