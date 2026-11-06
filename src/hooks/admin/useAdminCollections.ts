import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../api/queryKeys';
import AdminService from '../../api/services/AdminService';

/** Every collection, unpublished included, for the admin pages */
export function useAdminCollections() {
  return useQuery({
    queryKey: queryKeys.admin.collections.all,
    queryFn: () => AdminService.adminGetCollections()
  });
}
