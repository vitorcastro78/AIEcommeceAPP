// src/services/authenticateCustomerIdentityApi.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { 
  IdentityTokenRequestTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Authentication.IdentityTokenRequestTypes'
import { 
  TokenResponseTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Authentication.TokenResponseTypes'
import { 
  ProblemDetailsTypes 
} from '../types/Microsoft.AspNetCore.Mvc.ProblemDetailsTypes'

const BASE_URL = '/api/authenticate/customer/identity'
const MAX_RETRIES = 3

let authToken: string | null = null

const api: AxiosInstance = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (authToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${authToken}`
      }
    }
    return config
  }
)

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      authToken = null
    }
    return Promise.reject(error)
  }
)

export const setAuthToken = (token: string) => {
  authToken = token
}

const retry = async <T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> => {
  let lastError
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (i === retries - 1) throw lastError
      await new Promise(res => setTimeout(res, 500 * (i + 1)))
    }
  }
  throw lastError
}

export const postAuthenticateCustomerIdentity = async (
  data: IdentityTokenRequestTypes
): Promise<TokenResponseTypes> => {
  return retry(async () => {
    try {
      const response = await api.post<TokenResponseTypes>(BASE_URL, data)
      return response.data
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errData: ProblemDetailsTypes = error.response.data
        throw errData
      }
      throw error
    }
  })
}