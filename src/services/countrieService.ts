// src/services/countriesApi.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { 
  GetCountriesResponseTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Countries.GetCountriesResponseTypes'

const BASE_URL = '/api/countries'
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
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.config &&
      error.response &&
      error.response.status === 401 &&
      !error.config._retry
    ) {
      error.config._retry = true
      // Optionally: refresh token logic here
    }
    return Promise.reject(error)
  }
)

const withRetry = async <T>(
  fn: () => Promise<AxiosResponse<T>>,
  retries = MAX_RETRIES
): Promise<T> => {
  let lastError
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fn()
      return res.data
    } catch (err) {
      lastError = err
      if (attempt === retries) throw err
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
    }
  }
  throw lastError
}

export interface GetCountriesParams {
  page?: number
  pageSize?: number
  [key: string]: any
}

export const getCountries = async (
  params?: GetCountriesParams
): Promise<GetCountriesResponseTypes> => {
  return withRetry(() =>
    api.get<GetCountriesResponseTypes>(BASE_URL, { params })
  )
}