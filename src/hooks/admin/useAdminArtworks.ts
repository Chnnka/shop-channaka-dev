import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../api/queryKeys';
import AdminService from '../../api/services/AdminService';
import type { ArtworkQueryParams } from '../../types/artwork';

/** Every artwork, archived included, for the admin pages */
export function useAdminArtworks(params: ArtworkQueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.artworks.list(params),
    queryFn: () => AdminService.adminGetArtworks(params)
  });
}
