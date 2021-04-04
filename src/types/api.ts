import { Place } from '@googlemaps/google-maps-services-js';

import { Promotion } from './promotion';
import { User } from './user';

// Generic
export type ApiResponse<T> = T | ApiError;

export interface ApiError {
  errorCode: string;
  message: string[];
}

// Enums
export type EnumResponse = ApiResponse<string[]>;

// Promotions
export type GetPromotionsResponse = ApiResponse<Promotion[]>;
export type DeletePromotionsResponse = ApiResponse<string>;
export type PostPromotionsResponse = ApiResponse<void>;

// Restaurants
export type RestaurantDetailsResponse = ApiResponse<Place>;
export type RestaurantPromotionsResponse = ApiResponse<Promotion[]>;

// Users
export interface SavePromotion {
  promotionId: string;
  userId: string;
}

export interface UnsavePromotion {
  promotionId: string;
  userId: string;
}

export type DeleteUserResponse = ApiResponse<void>;
export type GetUserResponse = ApiResponse<User>;
export type SavePromotionResponse = ApiResponse<SavePromotion>;
export type UnsavePromotionResponse = ApiResponse<UnsavePromotion>;
export type UpdateUserResponse = ApiResponse<string>;
export type UploadedPromotionsResponse = ApiResponse<User>;
