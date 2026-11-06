import type {
  Artwork,
  ArtworkQueryParams,
  Availability,
  Collection,
  CreateArtworkPayload,
  SaveCollectionPayload,
} from "../../types/artwork";
import type { Order } from "../../types/commerce";
import type { OrderStatusPatch } from "../../types/order";
import { deleteRequest, get, patch, post, put } from "../apiClient";

class AdminService {
  static async adminGetArtworks(params: ArtworkQueryParams = {}) {
    const { artworks } = await get<{ artworks: Artwork[] }>({
      path: "/api/admin/artworks",
      params,
    });
    return artworks;
  }

  /** One artwork, archived included; rejects with a 404 ApiError if the id is unknown */
  static async adminGetArtworkById(id: string) {
    const { artwork } = await get<{ artwork: Artwork }>({
      path: `/api/admin/artworks/${encodeURIComponent(id)}`,
    });
    return artwork;
  }

  /** Resolves to the saved artwork, with its id and timestamps */
  static async createArtwork(reqBody: CreateArtworkPayload) {
    const { artwork } = await post<{ artwork: Artwork }>({
      path: "/api/admin/artworks",
      reqBody,
    });
    return artwork;
  }

  /** Replaces every editable field; the server keeps the id and creation date */
  static async updateArtwork(id: string, reqBody: CreateArtworkPayload) {
    const { artwork } = await put<{ artwork: Artwork }>({
      path: `/api/admin/artworks/${encodeURIComponent(id)}`,
      reqBody,
    });
    return artwork;
  }

  static async setArtworkAvailability(id: string, availability: Availability) {
    const { artwork } = await patch<{ artwork: Artwork }>({
      path: `/api/admin/artworks/${encodeURIComponent(id)}/availability`,
      reqBody: { availability },
    });
    return artwork;
  }

  static async deleteArtwork(id: string) {
    await deleteRequest<null>({ path: `/api/admin/artworks/${encodeURIComponent(id)}` });
  }

  /** Every collection, unpublished included */
  static async adminGetCollections() {
    const { collections } = await get<{ collections: Collection[] }>({
      path: "/api/admin/collections",
    });
    return collections;
  }

  static async createCollection(reqBody: SaveCollectionPayload) {
    const { collection } = await post<{ collection: Collection }>({
      path: "/api/admin/collections",
      reqBody,
    });
    return collection;
  }

  static async updateCollection(id: string, reqBody: SaveCollectionPayload) {
    const { collection } = await put<{ collection: Collection }>({
      path: `/api/admin/collections/${encodeURIComponent(id)}`,
      reqBody,
    });
    return collection;
  }

  static async setCollectionPublished(id: string, published: boolean) {
    const { collection } = await patch<{ collection: Collection }>({
      path: `/api/admin/collections/${encodeURIComponent(id)}/published`,
      reqBody: { published },
    });
    return collection;
  }

  /** Moves a collection one place up (-1) or down (1); resolves to every collection in the new order */
  static async moveCollection(id: string, direction: -1 | 1) {
    const { collections } = await patch<{ collections: Collection[] }>({
      path: `/api/admin/collections/${encodeURIComponent(id)}/order`,
      reqBody: { direction },
    });
    return collections;
  }

  /** Deletes the collection; its artworks stay in the catalogue */
  static async deleteCollection(id: string) {
    await deleteRequest<null>({ path: `/api/admin/collections/${encodeURIComponent(id)}` });
  }

  static async adminGetOrders() {
    const { orders } = await get<{ orders: Order[] }>({ path: "/api/admin/orders" });
    return orders;
  }

  /** Paid sells the order's reserved artworks; failed, refunded or cancelled releases them */
  static async updateOrderStatus(id: string, reqBody: OrderStatusPatch) {
    const { order } = await patch<{ order: Order }>({
      path: `/api/admin/orders/${encodeURIComponent(id)}`,
      reqBody,
    });
    return order;
  }

  /**
   * Stores an image (JPEG, PNG, WebP or AVIF, at most 5 MB) and resolves to its URL path,
   * e.g. "/uploads/artworks/<name>.jpg", for use as an ArtworkImage src.
   */
  static async uploadImage(file: File) {
    const reqBody = new FormData();
    reqBody.append("image", file);
    const { src } = await post<{ src: string }>({
      path: "/api/admin/uploads",
      reqBody,
      timeout: 60_000,
    });
    return src;
  }
}

export default AdminService;
