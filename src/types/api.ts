import { Promotion } from './promotion';
import { User } from './user';

// Generic
export type ApiResponse<T> = T | ApiError;

export interface ApiError {
  errorCode: string;
  message: string[];
}

// Promotions

export type DeletePromotionsResponse = ApiResponse<string>;
export type GetPromotionsResponse = ApiResponse<Promotion[]>;

// Users
export interface SavePromotion {
  promotionId: string;
  userId: string;
}

export interface UnsavePromotion {
  promotionId: string;
  userId: string;
}

export type GetUserResponse = ApiResponse<User>;
export type SavePromotionResponse = ApiResponse<SavePromotion>;
export type UnsavePromotionResponse = ApiResponse<UnsavePromotion>;
export type UpdateUserResponse = ApiResponse<string>;
export type UploadedPromotionsResponse = ApiResponse<User>;
