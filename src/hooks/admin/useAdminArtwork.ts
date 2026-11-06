import { skipToken, useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../api/queryKeys';
import AdminService from '../../api/services/AdminService';

/**
 * One artwork, archived included, for the admin editor. Does nothing while id is undefined.
 * Artwork mutations invalidate queryKeys.admin.artworks.all, which covers this query too.
 */
export function useAdminArtwork(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.admin.artworks.detail(id ?? ''),
    queryFn: id ? () => AdminService.adminGetArtworkById(id) : skipToken
  });
}
