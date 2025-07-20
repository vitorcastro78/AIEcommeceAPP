// src/services/invoicesApi.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { 
  GetInvoicesResponseTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Invoices.GetInvoicesResponseTypes'
import { 
  ProblemDetailsTypes 
} from '../types/Microsoft.AspNetCore.Mvc.ProblemDetailsTypes'

const BASE_URL = '/api/invoices'
const MAX_RETRIES = 2

let accessToken: string | null = null

export const setAccessToken = (token: string) => {
  accessToken = token
}

const api: AxiosInstance = axios.create({
  baseURL: '',
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
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (!originalRequest._retry) {
      originalRequest._retry = 1
    } else {
      originalRequest._retry += 1
    }
    if (originalRequest._retry <= MAX_RETRIES) {
      return api(originalRequest)
    }
    return Promise.reject(error)
  }
)

type GetInvoicesParams = {
  page?: number
  pageSize?: number
  [key: string]: any
}

export const getInvoices = async (
  params?: GetInvoicesParams
): Promise<GetInvoicesResponseTypes> => {
  try {
    const response: AxiosResponse<GetInvoicesResponseTypes> = await api.get(BASE_URL, {
      params,
    })
    return response.data
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data as ProblemDetailsTypes
    }
    throw error
  }
}