// src/hooks/useRecurringPaymentMethod.ts

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { ZippedBeans } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.PutRecurringPaymentMethodRequestTypes'
import recurringPaymentMethodService from '../services/recurring-payment-methodService'

type PutRecurringPaymentMethodRequest = ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.PutRecurringPaymentMethodRequestTypes
type PutRecurringPaymentMethodResponse = unknown

export function usePutRecurringPaymentMethod() {
  const queryClient = useQueryClient()

  const mutation = useMutation<
    PutRecurringPaymentMethodResponse,
    AxiosError,
    PutRecurringPaymentMethodRequest
  >(
    (data) => recurringPaymentMethodService.put('/api/recurring-payment-method', data).then(res => res.data),
    {
      onMutate: async (newData) => {
        await queryClient.cancelQueries(['recurring-payment-method'])
        const previousData = queryClient.getQueryData(['recurring-payment-method'])
        queryClient.setQueryData(['recurring-payment-method'], (old: any) => ({
          ...old,
          ...newData,
        }))
        return { previousData }
      },
      onError: (err, _newData, context: any) => {
        if (context?.previousData) {
          queryClient.setQueryData(['recurring-payment-method'], context.previousData)
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(['recurring-payment-method'])
      },
    }
  )

  return {
    putRecurringPaymentMethod: mutation.mutate,
    putRecurringPaymentMethodAsync: mutation.mutateAsync,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  }
}