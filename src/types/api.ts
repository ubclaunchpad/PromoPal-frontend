import { Place } from '@googlemaps/google-maps-services-js';

import { Promotion } from './promotion';
import { User } from './user';

// Generic
export type ApiResponse<T> = T | ApiError;

export interface ApiError {
  errorCode: string;
  message: string[];
}

// Promotions
export type PromotionsResponse = ApiResponse<Promotion[]>;

// Restaurants
export type RestaurantDetailsResponse = ApiResponse<Place>;
export type RestaurantPromotionsResponse = ApiResponse<Promotion[]>;

// Users
export type UploadedPromotionsResponse = ApiResponse<User>;
