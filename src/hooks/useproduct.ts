
// src/hooks/useProducts.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import productService from '../services/productService';
import { ZippedBeans } from '../types/ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponseTypes';

type Product = ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponseTypes['products'][number];

interface UseProductsOptions {
  page?: number;
  pageSize?: number;
}

interface UseProductsResult {
  products: Product[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: AxiosError | null;
  refetch: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
}

export function useProducts(options?: UseProductsOptions): UseProductsResult {
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(options?.page || 1);
  const pageSize = options?.pageSize || 20;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    ['products', page, pageSize],
    async () => {
      const response = await productService.getProducts({ page, pageSize });
      return response.data as ZippedBeans.Zip.Backend.Application.WebAPI.Models.Products.GetProductListResponseTypes;
    },
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5,
    }
  );

  const products = data?.products;
  const total = data?.totalCount || 0;
  const hasNextPage = page * pageSize < total;
  const hasPreviousPage = page > 1;

  React.useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(['products', page + 1, pageSize], () =>
        productService.getProducts({ page: page + 1, pageSize }).then(res => res.data)
      );
    }
  }, [hasNextPage, page, pageSize, queryClient]);

  return {
    products,
    isLoading,
    isError,
    error: error as AxiosError | null,
    refetch,
    hasNextPage,
    hasPreviousPage,
    page,
    pageSize,
    setPage,
  };
}

