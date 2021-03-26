import { Place, PlacePhoto } from '@googlemaps/google-maps-services-js';
import axios, { AxiosError, AxiosResponse } from 'axios';

import Routes from '../utils/routes';

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
    if (existingPlace) return Promise.resolve(existingPlace);

    return axios
      .get(Routes.RESTAURANTS.RESTAURANT_DETAILS(restaurantId))
      .then((response: AxiosResponse<Place>) => {
        const place = response.data;
        this.currRestaurants.set(restaurantId, place);
        return Promise.resolve(place);
      })
      .catch((err: AxiosError) => {
        return Promise.reject(err);
      });
  }

  /**
   * Gets photos for a restaurant
   * @param restaurantId the id of the restaurant
   * */
  async getRestaurantPhoto(restaurantId: string): Promise<PlacePhoto[]> {
    const place = await this.getRestaurantDetails(restaurantId);
    return place.photos ?? [];
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
