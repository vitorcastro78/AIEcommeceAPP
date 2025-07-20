
import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { 
  PutPaymentTransactionRequestTypes 
} from 'src/types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.PutPaymentTransactionRequestTypes';
import { 
  PutPaymentTransactionResponseTypes 
} from 'src/types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Payments.PutPaymentTransactionResponseTypes';
import paymentTransactionService from 'src/services/payment-transactionService';

type UsePutPaymentTransactionOptions = {
  onSuccess?: (data: PutPaymentTransactionResponseTypes) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
  optimisticUpdate?: (variables: PutPaymentTransactionRequestTypes) => void;
  rollback?: () => void;
};

export function usePutPaymentTransaction(
  options?: UsePutPaymentTransactionOptions
): UseMutationResult<
  PutPaymentTransactionResponseTypes,
  AxiosError,
  PutPaymentTransactionRequestTypes
> {
  const queryClient = useQueryClient();

  return useMutation<
    PutPaymentTransactionResponseTypes,
    AxiosError,
    PutPaymentTransactionRequestTypes
  >(
    async (data) => {
      return await paymentTransactionService.put<PutPaymentTransactionResponseTypes>(`/api/payment-transactions`, data).then(res => res.data);
    },
    {
      onMutate: async (variables) => {
        await queryClient.cancelQueries(['payment-transactions']);
        if (options?.optimisticUpdate) {
          options.optimisticUpdate(variables);
        }
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(['payment-transactions']);
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        if (options?.rollback) {
          options.rollback();
        }
        options?.onError?.(error);
      },
      onSettled: () => {
        queryClient.invalidateQueries(['payment-transactions']);
        options?.onSettled?.();
      }
    }
  );
}
