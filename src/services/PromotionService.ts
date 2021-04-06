import { Place } from '@googlemaps/google-maps-services-js';
import axios, { AxiosResponse } from 'axios';

import UserService from '../services/UserService';
import {
  DeletePromotionsResponse,
  GetPromotionsResponse,
  PostPromotionsResponse,
} from '../types/api';
import {
  FilterOptions,
  GetPromotionDTO,
  PostPromotionDTO,
  Promotion,
  Sort,
} from '../types/promotion';
import { isError } from '../utils/api';
import Routes from '../utils/routes';
import GooglePlacesService from './GooglePlacesService';

/**
 * Fetches entire list of promotions. If a query object is given, filters the promotions according to the given query.
 * If an error occurs, an empty list will be returned.
 *
 * @param query [optional] - An array of objects with key-value pairs for the query parameters
 */
export async function getPromotions(query?: GetPromotionDTO): Promise<Promotion[]> {
  const endpoint = Routes.PROMOTIONS.GET;
  return axios
    .get(endpoint, {
      params: {
        ...query,
        userId: UserService.userId,
      },
    })
    .then(({ data }: AxiosResponse<GetPromotionsResponse>) => {
      if (isError<GetPromotionsResponse>(data)) {
        return Promise.reject(data);
      }
      return Promise.resolve(data);
    })
    .catch((err: Error) => Promise.reject(err));
}

/**
 * Deletes the promotion with the given id.
 *
 * @param id - The id of the promotion to delete
 */
export async function deletePromotion(id: string): Promise<void> {
  const endpoint = Routes.PROMOTIONS.DELETE(id);
  return axios
    .delete(endpoint)
    .then(({ data }: AxiosResponse<DeletePromotionsResponse>) => {
      if (isError<DeletePromotionsResponse>(data)) {
        return Promise.reject(data);
      }
      return Promise.resolve();
    })
    .catch((err: Error) => Promise.reject(err));
}

/**
 * Creates a new promotion.
 *
 * @param promotionDTO - An object containing the fields of the promotion
 */
export async function postPromotion(promotionDTO: PostPromotionDTO): Promise<void> {
  const url = Routes.PROMOTIONS.POST;
  return axios
    .post(url, promotionDTO)
    .then(({ data }: AxiosResponse<PostPromotionsResponse>) => {
      if (isError<PostPromotionsResponse>(data)) {
        return Promise.reject(data);
      }
      return Promise.resolve();
    })
    .catch((err: Error) => Promise.reject(err));
}

export async function getRestaurant(restaurantId: string): Promise<Place> {
  return GooglePlacesService.getRestaurantDetails(restaurantId);
}

/**
 * Returns the subset of all promotions which satisfy at least one filter key in the `filters` parameter
 * and sort them by the `sort` parameter.
 *
 * @param filters - An object specifying the keys and the values to filter the promotions by
 * @param sort - A string representing the key to sort the promotions by
 */
export async function queryPromotions(filters: FilterOptions, sort?: Sort): Promise<Promotion[]> {
  const { cuisine, dayOfWeek, discountType, promotionType } = filters;

  const promotionQueryDTO: GetPromotionDTO = {
    cuisine,
    // note we only support querying one day of week at the moment
    dayOfWeek: dayOfWeek.length > 0 ? dayOfWeek[0] : undefined,
    // note we only support querying one promotion type at the moment
    promotionType: promotionType.length > 0 ? promotionType[0] : undefined,
  };

  if (discountType?.length > 0) {
    // Handle case where filter is one of ["$ Off", "% Off"]
    let discount = 'Other';
    if (discountType !== 'Other') {
      discount = discountType.substring(0, 1);
    }
    promotionQueryDTO.discountType = discount;
  }

  // todo: commented out until BE PR for sort is in
  // if (sort) {
  //   const queryParams: { [paramKey: string]: string } = { sort };
  //   if (sort === Sort.Distance) {
  //     const {
  //       coords: { latitude, longitude },
  //     } = await LocationService.GeolocationPosition.getCurrentLocation();
  //     queryParams.lat = `${latitude}`;
  //     queryParams.lon = `${longitude}`;
  //   }
  //   promotionQueryDTO.push(queryParams);
  // }

  return getPromotions(promotionQueryDTO);
}
