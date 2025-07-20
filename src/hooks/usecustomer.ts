Assuming you are using React Query and the types from your codebase, here are custom hooks for managing customers:

Install dependencies if not already:
sh
npm install @tanstack/react-query axios


src/hooks/useCustomers.ts:

import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query'
import {
  GetCustomerResponseTypes
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Customers.GetCustomerResponseTypes'
import {
  PostCustomerRequestTypes
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Customers.PostCustomerRequestTypes'
import {
  PutCustomerRequestTypes
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Customers.PutCustomerRequestTypes'
import customerService from '../services/customerService'

type Pagination = { page?: number; pageSize?: number }
type GetCustomersParams = Pagination & { [key: string]: any }

const CUSTOMERS_QUERY_KEY = ['customers']

export function useCustomers(params: GetCustomersParams = {}) {
  return useQuery<GetCustomerResponseTypes[], Error>({
    queryKey: [CUSTOMERS_QUERY_KEY, params],
    queryFn: () => customerService.get(params),
    keepPreviousData: true,
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  return useMutation<GetCustomerResponseTypes, Error, PostCustomerRequestTypes>({
    mutationFn: (data) => customerService.post(data),
    onMutate: async (newCustomer) => {
      await queryClient.cancelQueries({ queryKey: [CUSTOMERS_QUERY_KEY] })
      const previous = queryClient.getQueryData<GetCustomerResponseTypes[]>([CUSTOMERS_QUERY_KEY]) || []
      const optimisticCustomer = { ...newCustomer, id: Math.random().toString() } as GetCustomerResponseTypes
      queryClient.setQueryData<GetCustomerResponseTypes[]>([CUSTOMERS_QUERY_KEY], old => old ? [optimisticCustomer, ...old] : [optimisticCustomer])
      return { previous }
    },
    onError: (_err, _newCustomer, context) => {
      if (context?.previous) {
        queryClient.setQueryData([CUSTOMERS_QUERY_KEY], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY] })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  return useMutation<GetCustomerResponseTypes, Error, { id: string; data: PutCustomerRequestTypes }>({
    mutationFn: ({ id, data }) => customerService.put(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [CUSTOMERS_QUERY_KEY] })
      const previous = queryClient.getQueryData<GetCustomerResponseTypes[]>([CUSTOMERS_QUERY_KEY]) || []
      queryClient.setQueryData<GetCustomerResponseTypes[]>([CUSTOMERS_QUERY_KEY], old =>
        old
          ? old.map(c => (c.id === id ? { ...c, ...data } : c))
          : []
      )
      return { previous }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData([CUSTOMERS_QUERY_KEY], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY] })
    },
  })
}


Usage example:

import { useCustomers, useCreateCustomer, useUpdateCustomer } from './hooks/useCustomers'

const { data, isLoading, error, isFetching } = useCustomers({ page: 1, pageSize: 20 })
const createCustomer = useCreateCustomer()
const updateCustomer = useUpdateCustomer()


This covers fetching (with pagination), creating, and updating customers with loading, error, optimistic updates, and cache invalidation.