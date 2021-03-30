import { Place } from '@googlemaps/google-maps-services-js';
import axios, { AxiosError, AxiosResponse } from 'axios';

import { RestaurantDetailsResponse, RestaurantPromotionsResponse } from '../types/api';
import { Promotion } from '../types/promotion';
import { isError } from '../utils/api';
import Routes from '../utils/routes';

class RestaurantService {
  public async getRestaurantDetails(restaurantId: string): Promise<Place> {
    return axios
      .get(Routes.RESTAURANTS.RESTAURANT_DETAILS(restaurantId))
      .then(({ data }: AxiosResponse<RestaurantDetailsResponse>) => {
        if (isError<RestaurantDetailsResponse>(data)) {
          return Promise.reject(data);
        }
        return Promise.resolve(data);
      })
      .catch((err: AxiosError) => Promise.reject(err));
  }

  public async getRestaurantPromotions(restaurantId: string): Promise<Promotion[]> {
    return axios
      .get(Routes.RESTAURANTS.RESTAURANT_PROMOTIONS(restaurantId))
      .then(({ data }: AxiosResponse<RestaurantPromotionsResponse>) => {
        if (isError<RestaurantPromotionsResponse>(data)) {
          return Promise.reject(data);
        }
        return Promise.resolve(data);
      })
      .catch((err: AxiosError) => Promise.reject(err));
  }
}

export default new RestaurantService();
