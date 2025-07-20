// src/hooks/usePaymentMethods.ts

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { GetPaymentMethodResponseTypes } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.GetPaymentMethodResponseTypes'
import paymentMethodService from '../services/payment-methodService'

type UsePaymentMethodsOptions = {
  page?: number
  pageSize?: number
  enabled?: boolean
}

type UsePaymentMethodsResult = {
  data: GetPaymentMethodResponseTypes[] | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
  refetch: () => void
  invalidate: () => void
}

const fetchPaymentMethods = async (page = 1, pageSize = 20): Promise<GetPaymentMethodResponseTypes[]> => {
  const response = await paymentMethodService.get('/api/payment-methods', {
    params: { page, pageSize }
  })
  return response.data
}

export function usePaymentMethods(options: UsePaymentMethodsOptions = {}): UsePaymentMethodsResult {
  const { page = 1, pageSize = 20, enabled = true } = options
  const queryClient = useQueryClient()
  const queryKey = ['payment-methods', page, pageSize]

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<GetPaymentMethodResponseTypes[]>(
    queryKey,
    () => fetchPaymentMethods(page, pageSize),
    {
      keepPreviousData: true,
      enabled
    }
  )

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['payment-methods'] })
  }

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    invalidate
  }
}