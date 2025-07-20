// src/hooks/useCountries.ts

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import countrieService from '../services/countrieService'
import type { GetCountriesResponseTypes } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Countries.GetCountriesResponseTypes'

type UseCountriesOptions = {
  page?: number
  pageSize?: number
  enabled?: boolean
  select?: (data: GetCountriesResponseTypes) => any
}

const fetchCountries = async (page = 1, pageSize = 50): Promise<GetCountriesResponseTypes> => {
  const params = { page, pageSize }
  const { data } = await countrieService.get<GetCountriesResponseTypes>('/api/countries', { params })
  return data
}

export function useCountries(options: UseCountriesOptions = {}) {
  const {
    page = 1,
    pageSize = 50,
    enabled = true,
    select,
  } = options
  const queryClient = useQueryClient()
  const queryKey = ['countries', page, pageSize]

  const query = useQuery<GetCountriesResponseTypes, AxiosError>({
    queryKey,
    queryFn: () => fetchCountries(page, pageSize),
    enabled,
    select,
    keepPreviousData: true,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['countries'] })

  return {
    ...query,
    invalidate,
  }
}