import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateCatalogQueries, queryKeys } from '../api/queryKeys';
import ArtworkService from '../api/services/ArtworkService';
import type { CreateOrderPayload } from '../types/order';

/** Places an order; its artworks become reserved, so the catalog and admin orders are refreshed */
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ArtworkService.createOrder(payload),
    onSuccess: () =>
    Promise.all([
    invalidateCatalogQueries(queryClient),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.all })]
    )
  });
}
