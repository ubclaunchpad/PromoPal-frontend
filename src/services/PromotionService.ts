import LocationService from '../services/LocationService';
import { PromotionsResponse } from '../types/api';
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
  let endpoint = Routes.PROMOTIONS;
  if (query && query.length > 0) {
    endpoint += '?';
    query.forEach((param: PromotionDTO, index: number) => {
      Object.entries(param).forEach(([key, value], paramIdx) => {
        // First query param is not prefixed by an ampersand
        endpoint += `${index + paramIdx > 0 ? '&' : ''}${key}=${value}`;
      });
    });
  }

  return fetch(endpoint)
    .then((response: Response) => response.json())
    .then((response: PromotionsResponse) => {
      if (isError<PromotionsResponse>(response)) {
        return Promise.reject(response);
      }
      return Promise.resolve(response);
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
 * Returns the subset of all promotions which satisfy at least one filter key in the `filters` parameter
 * and sort them by the `sort` parameter.
 *
 * @param filters - An object specifying the keys and the values to filter the promotions by
 * @param sort - A string representing the key to sort the promotions by
 */
export async function queryPromotions(filters: FilterOptions, sort?: Sort): Promise<Promotion[]> {
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

  if (sort) {
    const queryParams: { [paramKey: string]: string } = { sort };
    if (sort === Sort.Distance) {
      const {
        coords: { latitude, longitude },
      } = await LocationService.getCurrentLocation();
      queryParams.lat = `${latitude}`;
      queryParams.lon = `${longitude}`;
    }
    promotionQueryDTO.push(queryParams);
  }

  return getPromotions(promotionQueryDTO);
}
