import axios, { AxiosResponse } from 'axios';

import UserService from '../services/UserService';
import { DeletePromotionsResponse, GetPromotionsResponse } from '../types/api';
import { FilterOptions, Promotion, PromotionDTO, Sort } from '../types/promotion';
import { Restaurant } from '../types/restaurant';
import { isError } from '../utils/api';
import Routes from '../utils/routes';

/**
 * Fetches entire list of promotions. If a query object is given, filters the promotions according to the given query.
 * If an error occurs, an empty list will be returned.
 *
 * @param query [optional] - An array of objects with key-value pairs for the query parameters
 */
export async function getPromotions(query?: PromotionDTO[]): Promise<Promotion[]> {
  const userId = UserService.getUserId();
  let endpoint = Routes.PROMOTIONS.GET(userId);
  if (query && query.length > 0) {
    endpoint += '?';
    query.forEach((param: PromotionDTO, index: number) => {
      const [key] = Object.keys(param);
      const [value] = Object.values(param);

      // First query param is not prefixed by an ampersand
      endpoint += `${index > 0 ? '&' : ''}${key}=${value}`;
    });
  }

  return axios
    .get(endpoint)
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

export async function getRestaurant(id: string): Promise<Restaurant> {
  // TODO: find restaurant given placeId from promotion
  return {
    id,
    address: '1850 W 4th Ave, Vancouver, BC V6J 1M3',
    cuisineType: 'Italian',
    distance: 500,
    name: 'Trattoria',
    phoneNumber: '604-732-1441',
    photos: [],
    price: '$$',
    rating: 4.1,
    reviews: 'https://google.com',
    website: 'https://www.glowbalgroup.com/trattoria/trattoria-burnaby.html',
    hours: {
      sunday: '10:30 AM - Late',
      monday: '11:30 AM - Late',
      tuesday: '11:30 AM - Late',
      wednesday: '11:30 AM - Late',
      thursday: '11:30 AM - Late',
      friday: '11:30 AM - Late',
      saturday: '10:30 AM - Late',
    },
  };
}

/**
 * Returns the subset of all promotions which satisfy at least one filter key in the `filters` parameter.
 *
 * @param filters - An object specifying the keys and the values to filter the promotions by
 */
export function filterPromotions(filters: FilterOptions): Promise<Promotion[]> {
  const { cuisine, dayOfWeek, discountType, promotionType } = filters;

  const promotionQueryDTO: Record<string, string>[] = [];
  if (cuisine?.length > 0) {
    cuisine.forEach((cuisine: string) => promotionQueryDTO.push({ cuisine }));
  }
  if (dayOfWeek.length > 0) {
    dayOfWeek.forEach((dayOfWeek: string) => promotionQueryDTO.push({ dayOfWeek }));
  }
  if (discountType?.length > 0) {
    // Handle case where filter is one of ["$ Off", "% Off"]
    let discount = 'Other';
    if (discountType !== 'Other') {
      discount = discountType.substring(0, 1);
    }
    promotionQueryDTO.push({ discountType: discount });
  }
  if (promotionType?.length > 0) {
    promotionType.forEach((promotionType: string) => promotionQueryDTO.push({ promotionType }));
  }

  return getPromotions(promotionQueryDTO);
}

/**
 * Sorts the given of list of promotions by the given key.
 *
 * @param arr - The list of promotions to sort
 * @param key - The key which to sort the promotions by
 */
export function sortPromotions(arr: Promotion[], key: Sort): Promotion[] {
  let promotions = [...arr];
  switch (key) {
    case Sort.Distance:
      promotions = sortByDistance(promotions);
      break;
    case Sort.MostPopular:
      promotions = sortByPopularity(promotions);
      break;
    case Sort.Rating:
      promotions = sortByRating(promotions);
      break;
  }
  return promotions;
}

// TODO: see https://github.com/ubclaunchpad/foodies/issues/99
function sortByDistance(promotions: Promotion[]): Promotion[] {
  return promotions;
}

// TODO: see https://github.com/ubclaunchpad/foodies/issues/99
function sortByPopularity(promotions: Promotion[]): Promotion[] {
  return promotions;
}

// TODO: see https://github.com/ubclaunchpad/foodies/issues/99
function sortByRating(promotions: Promotion[]): Promotion[] {
  return promotions;
}
