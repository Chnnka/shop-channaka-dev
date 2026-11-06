import { useMutation } from '@tanstack/react-query';
import AdminService from '../../api/services/AdminService';

/** Uploads one image file; resolves to the stored image's src */
export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => AdminService.uploadImage(file)
  });
}
