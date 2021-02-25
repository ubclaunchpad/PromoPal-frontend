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

// Users
export type GetUserResponse = ApiResponse<User>;
export type UpdateUserResponse = ApiResponse<string>;
export type UploadedPromotionsResponse = ApiResponse<User>;
