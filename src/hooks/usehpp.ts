// src/hooks/useHppZuora.ts

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ZippedBeans } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.CreateZuoraHppInstanceRequestTypes'
import type { ZippedBeans as ZippedBeansResponse } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.CreateZuoraHppInstanceResponseTypes'
import type { AxiosError } from 'axios'
import hppService from '../services/hppService'

type Request = ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.CreateZuoraHppInstanceRequestTypes
type Response = ZippedBeansResponse.Zip.Backend.Application.WebAPI.Models.Payments.CreateZuoraHppInstanceResponseTypes

export function useHppZuora() {
  const queryClient = useQueryClient()
  const mutation = useMutation<Response, AxiosError, Request>({
    mutationFn: (data) => hppService.postZuoraHpp(data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['zuora-hpp'] })
      const previous = queryClient.getQueryData<Response>(['zuora-hpp'])
      queryClient.setQueryData(['zuora-hpp'], (old: any) => ({
        ...old,
        optimistic: true,
        ...variables,
      }))
      return { previous }
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['zuora-hpp'], context.previous)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zuora-hpp'] })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['zuora-hpp'] })
    },
  })
  return {
    createZuoraHpp: mutation.mutate,
    createZuoraHppAsync: mutation.mutateAsync,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  }
}