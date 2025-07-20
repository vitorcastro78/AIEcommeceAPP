// src/hooks/usePayment.ts

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { ZippedBeans } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.CreateAdyenPaymentRequestTypes'
import type { ZippedBeans as PaymentResponse } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.CreateAdyenPaymentResponseTypes'
import paymentService from '../services/paymentService'

type PaymentRequest = ZippedBeans
type PaymentResponseType = PaymentResponse

export function useCreatePayment() {
  const queryClient = useQueryClient()
  return useMutation<PaymentResponseType, AxiosError, PaymentRequest>({
    mutationFn: (data) => paymentService.post('/api/payment', data).then(res => res.data),
    onMutate: async (newPayment) => {
      await queryClient.cancelQueries({ queryKey: ['payments'] })
      const previousPayments = queryClient.getQueryData<PaymentResponseType[]>(['payments'])
      if (previousPayments) {
        queryClient.setQueryData(['payments'], [
          { ...newPayment, optimistic: true } as unknown as PaymentResponseType,
          ...previousPayments,
        ])
      }
      return { previousPayments }
    },
    onError: (err, newPayment, context) => {
      if (context?.previousPayments) {
        queryClient.setQueryData(['payments'], context.previousPayments)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}