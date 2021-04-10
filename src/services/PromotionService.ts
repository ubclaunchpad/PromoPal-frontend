import { Place } from '@googlemaps/google-maps-services-js';
import axios, { AxiosResponse } from 'axios';

import {
  DeletePromotionsResponse,
  DownvotePromotionResponse,
  GetPromotionsResponse,
  PostPromotionsResponse,
  UpvotePromotionResponse,
} from '../types/api';
import { Image } from '../types/image';
import {
  FilterOptions,
  GetPromotionDTO,
  PostPromotionDTO,
  Promotion,
  Sort,
} from '../types/promotion';
import { isError } from '../utils/api';
import Routes from '../utils/routes';
import AmazonS3Service from './AmazonS3Service';
import GooglePlacesService from './GooglePlacesService';

class PromotionService {
  /**
   * Deletes the promotion with the given id.
   *
   * @param id - The id of the promotion to delete
   */
  public async deletePromotion(id: string): Promise<void> {
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
   * Fetches entire list of promotions. If a query object is given, filters the promotions according to the given query.
   * If an error occurs, an empty list will be returned.
   *
   * @param userId [optional] - The userId of a logged in user
   * @param query [optional] - An array of objects with key-value pairs for the query parameters
   */
  public async getPromotions(userId?: string, query?: GetPromotionDTO): Promise<Promotion[]> {
    const endpoint = Routes.PROMOTIONS.GET;
    return axios
      .get(endpoint, {
        params: {
          ...query,
          userId: userId,
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
   * Creates a new promotion.
   *
   * @param promotionDTO - An object containing the fields of the promotion
   * @param image - An promotion image to upload
   */
  public async postPromotion(promotionDTO: PostPromotionDTO, image?: Image): Promise<void> {
    const url = Routes.PROMOTIONS.POST;
    return axios
      .post(url, promotionDTO)
      .then(async ({ data }: AxiosResponse<PostPromotionsResponse>) => {
        if (isError<PostPromotionsResponse>(data)) {
          return Promise.reject(data);
        }
        if (image) {
          // Will resolve even on error
          await AmazonS3Service.uploadImage(image, data.id);
        }
        return Promise.resolve();
      })
      .catch((err: Error) => Promise.reject(err));
  }

  /**
   * Retrieves the restaurant associated with the promotion.
   *
   * @param restaurantId - The placeId of the restaurant
   * @returns
   */
  public async getRestaurant(restaurantId: string): Promise<Place> {
    return GooglePlacesService.getRestaurantDetails(restaurantId);
  }

  /**
   * Returns the subset of all promotions which satisfy at least one filter key in the `filters` parameter
   * and sort them by the `sort` parameter.
   *
   * @param filters - An object specifying the keys and the values to filter the promotions by
   * @param sort - A string representing the key to sort the promotions by
   * @param userId [optional] - The userId of a logged in user
   */
  public async queryPromotions(
    filters: FilterOptions,
    sort?: Sort,
    userId?: string
  ): Promise<Promotion[]> {
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

    return this.getPromotions(userId, promotionQueryDTO);
  }

  /**
   * Upvotes the promotion for the current user.
   *
   * @param promotionId - The id of the promotion to upvote
   * @param userId - The user id of a logged in user
   */
  public async upvotePromotion(promotionId: string, userId: string): Promise<void> {
    const endpoint = Routes.PROMOTIONS.UPVOTE(promotionId);
    return axios
      .post(endpoint, { uid: userId })
      .then(({ data }: AxiosResponse<UpvotePromotionResponse>) => {
        if (isError<UpvotePromotionResponse>(data)) {
          return Promise.reject(data);
        }
        return Promise.resolve();
      })
      .catch((err: Error) => Promise.reject(err));
  }

  /**
   * Downvotes the promotion for the current user.
   *
   * @param promotionId - The id of the promotion to downvote
   * @param userId - The user id of a logged in user
   */
  public async downvotePromotion(promotionId: string, userId: string): Promise<void> {
    const endpoint = Routes.PROMOTIONS.DOWNVOTE(promotionId);
    return axios
      .post(endpoint, { uid: userId })
      .then(({ data }: AxiosResponse<DownvotePromotionResponse>) => {
        if (isError<DownvotePromotionResponse>(data)) {
          return Promise.reject(data);
        }
        return Promise.resolve();
      })
      .catch((err: Error) => Promise.reject(err));
  }
}

export default new PromotionService();
