import axios, { AxiosResponse } from 'axios';

import { GetPromotionsResponse, PostPromotionsResponse } from '../types/api';
import {
  FilterOptions,
  GetPromotionDTO,
  PostPromotionDTO,
  Promotion,
  Sort,
} from '../types/promotion';
import { Restaurant } from '../types/restaurant';
import { isError } from '../utils/api';
import Routes from '../utils/routes';

/**
 * Fetches entire list of promotions. If a query object is given, filters the promotions according to the given query.
 * If an error occurs, an empty list will be returned.
 *
 * @param query [optional] - An array of objects with key-value pairs for the query parameters
 */
export async function getPromotions(query?: GetPromotionDTO[]): Promise<Promotion[]> {
  let endpoint = Routes.PROMOTIONS.GET;
  if (query && query.length > 0) {
    endpoint += '?';
    query.forEach((param: GetPromotionDTO, index: number) => {
      const [key] = Object.keys(param);
      const [value] = Object.values(param);

      // First query param is not prefixed by an ampersand
      endpoint += `${index > 0 ? '&' : ''}${key}=${value}`;
    });
  }

  return fetch(endpoint)
    .then((response: Response) => response.json())
    .then((response: GetPromotionsResponse) => {
      if (isError<GetPromotionsResponse>(response)) {
        return Promise.reject(response);
      }
      return Promise.resolve(response);
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

export async function getRestaurant(id: string): Promise<Restaurant> {
  // TODO: https://promopal.atlassian.net/browse/PP-25
  return {
    address: '1850 W 4th Ave, Vancouver, BC V6J 1M3',
    business_status: '',
    cuisine: 'Italian',
    distance: 1500,
    lat: 0,
    lon: 0,
    openingHours: {},
    name: 'Trattoria',
    phoneNumber: '604-732-1441',
    photos: [],
    priceLevel: '$$',
    rating: 4.1,
    totalRating: 100,
    mapUrl: '',
    reviews: [],
    website: 'https://www.glowbalgroup.com/trattoria/trattoria-burnaby.html',
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
function sortByDistance(promotions: Promotion[]) {
  return promotions;
}

// TODO: see https://github.com/ubclaunchpad/foodies/issues/99
function sortByPopularity(promotions: Promotion[]) {
  return promotions;
}

// TODO: see https://github.com/ubclaunchpad/foodies/issues/99
function sortByRating(promotions: Promotion[]) {
  return promotions;
}
