import { Place, PlacePhoto } from '@googlemaps/google-maps-services-js';

import RestaurantService from '../services/RestaurantService';

class GooglePlacesService {
  /**
   * Mapping of restaurant id's with associated place details
   * * Each restaurant is associated with a unique placeId.
   */
  private currRestaurants: Map<string, Place>;

  constructor() {
    this.currRestaurants = new Map();
  }

  /**
   * Gets all restaurant details for certain restaurant
   * @param restaurantId the id of the restaurant
   */
  getRestaurantDetails(restaurantId: string): Promise<Place> {
    // if mapping already contains this restaurantId, return the place
    const existingPlace = this.currRestaurants.get(restaurantId);
    if (existingPlace) {
      return Promise.resolve(existingPlace);
    }

    return RestaurantService.getRestaurantDetails(restaurantId)
      .then((place: Place) => {
        this.currRestaurants.set(restaurantId, place);
        return Promise.resolve(place);
      })
      .catch((err: Error) => Promise.reject(err));
  }

  /**
   * Gets photos for a restaurant
   * @param restaurantId the id of the restaurant
   * */
  async getRestaurantPhoto(restaurantId: string): Promise<PlacePhoto[]> {
    try {
      const place = await this.getRestaurantDetails(restaurantId);
      return place.photos ?? [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Constructs and returns the url for a restaurant photo.
   * Note: retrieves the photo with the largest max width/height for the best quality.
   *
   * @param photo the restaurant photo
   */
  getRestaurantPhotoUrl({ photo_reference }: PlacePhoto): string {
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/photo?';
    const queryParams = new URLSearchParams({
      maxheight: '1600',
      maxwidth: '1600',
      photoreference: photo_reference,
      key: process.env.REACT_APP_GOOGLE_PHOTOS_PUBLIC_API_KEY as string,
    });
    return baseUrl + queryParams.toString();
  }
}

export default new GooglePlacesService();
