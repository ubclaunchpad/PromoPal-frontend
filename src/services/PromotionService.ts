import { isAfter, isBefore } from 'date-fns';

import GoogleGeometryService from '../services/GoogleGeometryService';
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
      const [key] = Object.keys(param);
      const [value] = Object.values(param);

      // First query param is not prefixed by an ampersand
      endpoint += `${index > 0 ? '&' : ''}${key}=${value}`;
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
export async function sortPromotions(arr: Promotion[], key: Sort): Promise<Promotion[]> {
  const promotions = [...arr];
  switch (key) {
    case Sort.Distance:
      return sortByDistance(promotions);
    case Sort.MostPopular:
      return sortByPopularity(promotions);
    case Sort.MostRecent:
      return sortByRecency(promotions);
    default:
      return promotions;
  }
}

async function sortByDistance(promotions: Promotion[]): Promise<Promotion[]> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      const success = (position: { coords: { latitude: number; longitude: number } }) => {
        const { latitude: currLat, longitude: currLon } = position.coords;

        const promos = promotions.map((promotion) => {
          const { lat, lon } = promotion;
          promotion.distance = GoogleGeometryService.computeDistance(currLat, currLon, lat, lon);
          return promotion;
        });

        const sortedPromotions = promos.sort((a, b) => b.distance - a.distance);
        resolve(sortedPromotions);
      };

      const error = () => reject(promotions);

      navigator.geolocation.getCurrentPosition(success, error, { timeout: 10000 });
    } else {
      reject(promotions);
    }
  });
}

function sortByPopularity(promotions: Promotion[]) {
  return promotions.sort((a, b) => b.votes - a.votes);
}

function sortByRecency(promotions: Promotion[]) {
  return promotions.sort((a, b) => {
    if (isBefore(new Date(a.dateAdded), new Date(b.dateAdded))) {
      return -1;
    } else if (isAfter(new Date(a.dateAdded), new Date(b.dateAdded))) {
      return 1;
    }
    return 0;
  });
}
