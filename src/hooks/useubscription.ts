// src/hooks/useSubscriptions.ts

import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query'
import { 
  GetSubscriptionDetailResponseTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Subscriptions.GetSubscriptionDetailResponseTypes'
import { 
  PostSubscriptionRequestTypes 
} from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Subscriptions.PostSubscriptionRequestTypes'
import ubscriptionService from '../services/ubscriptionService'

type Subscription = GetSubscriptionDetailResponseTypes['subscription']
type SubscriptionsResponse = {
  data: Subscription[]
  total: number
  page: number
  pageSize: number
}
type Pagination = { page?: number; pageSize?: number }

const SUBSCRIPTIONS_QUERY_KEY = (pagination: Pagination) => [
  'subscriptions',
  pagination.page ?? 1,
  pagination.pageSize ?? 10,
] as QueryKey

export function useSubscriptions(pagination: Pagination = { page: 1, pageSize: 10 }) {
  return useQuery<SubscriptionsResponse, Error>({
    queryKey: SUBSCRIPTIONS_QUERY_KEY(pagination),
    queryFn: async () => {
      const res = await ubscriptionService.get('/api/subscriptions', {
        params: { page: pagination.page, pageSize: pagination.pageSize },
      })
      return res.data
    },
    keepPreviousData: true,
  })
}

export function useCreateSubscription() {
  const queryClient = useQueryClient()
  return useMutation<
    Subscription,
    Error,
    PostSubscriptionRequestTypes,
    { previous: SubscriptionsResponse | undefined }
  >({
    mutationFn: async (newSub) => {
      const res = await ubscriptionService.post('/api/subscriptions', newSub)
      return res.data
    },
    onMutate: async (newSub) => {
      await queryClient.cancelQueries({ queryKey: ['subscriptions'] })
      const previous = queryClient.getQueryData<SubscriptionsResponse>(SUBSCRIPTIONS_QUERY_KEY({ page: 1, pageSize: 10 }))
      if (previous) {
        queryClient.setQueryData<SubscriptionsResponse>(
          SUBSCRIPTIONS_QUERY_KEY({ page: 1, pageSize: 10 }),
          {
            ...previous,
            data: [newSub as unknown as Subscription, ...previous.data],
            total: previous.total + 1,
          }
        )
      }
      return { previous }
    },
    onError: (_err, _newSub, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SUBSCRIPTIONS_QUERY_KEY({ page: 1, pageSize: 10 }), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
    },
  })
}