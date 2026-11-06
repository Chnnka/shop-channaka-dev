import type { Artwork, ArtworkQueryParams, Collection } from "../../types/artwork";
import type { Order } from "../../types/commerce";
import type { CreateOrderPayload } from "../../types/order";
import { get, post } from "../apiClient";

/** Public storefront endpoints: no login needed, archived and unpublished items are excluded */
class ArtworkService {
  /** Every public artwork and published collection, in one request */
  static async getCatalog() {
    return get<{ artworks: Artwork[]; collections: Collection[] }>({ path: "/api/catalog" });
  }

  static async getArtworks(params: ArtworkQueryParams = {}) {
    const { artworks } = await get<{ artworks: Artwork[] }>({ path: "/api/artworks", params });
    return artworks;
  }

  /** Rejects with a 404 ApiError if there is no public artwork with this slug */
  static async getArtworkBySlug(slug: string) {
    const { artwork } = await get<{ artwork: Artwork }>({
      path: `/api/artworks/${encodeURIComponent(slug)}`,
    });
    return artwork;
  }

  /** A published collection with its public artworks; rejects with a 404 ApiError if unknown */
  static async getCollectionBySlug(slug: string) {
    return get<{ collection: Collection; artworks: Artwork[] }>({
      path: `/api/collections/${encodeURIComponent(slug)}`,
    });
  }

  /**
   * Places an order. The server works out prices and shipping, creates the order as pending
   * and reserves its artworks. Rejects with a 409 ApiError if any artwork is no longer available.
   */
  static async createOrder(reqBody: CreateOrderPayload) {
    const { order } = await post<{ order: Order }>({ path: "/api/orders", reqBody });
    return order;
  }
}

export default ArtworkService;
