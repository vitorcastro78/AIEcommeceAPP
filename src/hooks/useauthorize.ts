// src/hooks/useAuthorize.ts

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { ZippedBeans } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Authentication.AuthorizationUrlRequestTypes'
import type { ZippedBeans as ZippedBeansResponse } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Authentication.AuthorizationUrlResponseTypes'
import type { ProblemDetailsTypes } from '../types/Microsoft.AspNetCore.Mvc.ProblemDetailsTypes'
import { authorizeService } from '../services/authorizeService'

type AuthorizeRequest = ZippedBeans.AuthorizationUrlRequest
type AuthorizeResponse = ZippedBeansResponse.AuthorizationUrlResponse

export function useAuthorize() {
  const queryClient = useQueryClient()
  const mutation = useMutation<AuthorizeResponse, AxiosError<ProblemDetailsTypes>, AuthorizeRequest>({
    mutationFn: (data) => authorizeService.post('/api/authorize/client', data).then(r => r.data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries(['authorize'])
      const previous = queryClient.getQueryData<AuthorizeResponse>(['authorize'])
      queryClient.setQueryData(['authorize'], (old: AuthorizeResponse | undefined) => ({
        ...old,
        ...variables
      }))
      return { previous }
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['authorize'], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['authorize'])
    }
  })

  return {
    authorize: mutation.mutate,
    authorizeAsync: mutation.mutateAsync,
    data: mutation.data,
    error: mutation.error,
    isLoading: mutation.isLoading,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: mutation.reset
  }
}