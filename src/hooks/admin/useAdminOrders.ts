import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../api/queryKeys';
import AdminService from '../../api/services/AdminService';

/** Every order, newest first, for the admin pages */
export function useAdminOrders() {
  return useQuery({
    queryKey: queryKeys.admin.orders.all,
    queryFn: () => AdminService.adminGetOrders()
  });
}
