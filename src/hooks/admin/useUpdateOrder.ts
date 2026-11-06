import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateCatalogQueries, queryKeys } from '../../api/queryKeys';
import AdminService from '../../api/services/AdminService';
import type { OrderStatusPatch } from '../../types/order';

/**
 * Changes an order's payment or fulfillment status. This can sell or release the order's
 * artworks, so the artwork lists are refreshed along with the orders.
 */
export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: OrderStatusPatch }) =>
      AdminService.updateOrderStatus(id, patch),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.all }),
        invalidateCatalogQueries(queryClient)
      ])
  });
}
