// src/hooks/useInvoices.ts

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { GetInvoicesResponseTypes } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Invoices.GetInvoicesResponseTypes'
import { InvoiceTypes } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Invoices.GetInvoicesResponse+InvoiceTypes'
import invoiceService from '../services/invoiceService'

type UseInvoicesParams = {
  page?: number
  pageSize?: number
  filters?: Record<string, any>
}

type UseInvoicesResult = {
  invoices: InvoiceTypes[] | undefined
  total: number
  isLoading: boolean
  isError: boolean
  error: unknown
  refetch: () => void
}

const fetchInvoices = async (params: UseInvoicesParams): Promise<GetInvoicesResponseTypes> => {
  const { page = 1, pageSize = 20, filters = {} } = params
  const response = await invoiceService.get('/api/invoices', {
    params: { page, pageSize, ...filters },
  })
  return response.data
}

export function useInvoices(params: UseInvoicesParams = {}): UseInvoicesResult {
  const queryClient = useQueryClient()
  const queryKey = ['invoices', params]

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<GetInvoicesResponseTypes>(
    queryKey,
    () => fetchInvoices(params),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5,
      onSuccess: () => {
        queryClient.invalidateQueries(['invoices'])
      },
    }
  )

  return {
    invoices: data?.invoices,
    total: data?.total ?? 0,
    isLoading,
    isError,
    error,
    refetch,
  }
}