import axios, { AxiosResponse } from 'axios';

import {
  SavePromotion,
  SavePromotionResponse,
  UnsavePromotionResponse,
  UploadedPromotionsResponse,
} from '../types/api';
import { Promotion } from '../types/promotion';
import { isError } from '../utils/api';
import Routes from '../utils/routes';

class UserService {
  private userId: string;

  public constructor() {
    this.userId = 'abdf0d76-2d5f-4b4c-9f6f-2d669a56b766';
  }

  public getUserId(): string {
    return this.userId;
  }

  public async getUploadedPromotions(): Promise<Promotion[]> {
    const endpoint = Routes.USERS.UPLOADED_PROMOTIONS(this.userId);
    return axios
      .get(endpoint)
      .then(({ data }: AxiosResponse<UploadedPromotionsResponse>) => {
        if (isError<UploadedPromotionsResponse>(data)) {
          return Promise.reject(data);
        }
        return Promise.resolve(data.uploadedPromotions);
      })
      .catch((err: Error) => Promise.reject(err));
  }

  public async savePromotion(promotionId: string): Promise<SavePromotion> {
    const endpoint = Routes.USERS.SAVE_PROMOTION(this.userId, promotionId);
    return axios
      .post(endpoint)
      .then(({ data }: AxiosResponse<SavePromotionResponse>) => {
        if (isError<SavePromotionResponse>(data)) {
          return Promise.reject(data);
        }
        return Promise.resolve(data);
      })
      .catch((err: Error) => Promise.reject(err));
  }

  public async unsavePromotion(promotionId: string): Promise<UnsavePromotionResponse> {
    const endpoint = Routes.USERS.UNSAVE_PROMOTION(this.userId, promotionId);
    return axios
      .delete(endpoint)
      .then(({ data }: AxiosResponse<UnsavePromotionResponse>) => {
        if (isError<UnsavePromotionResponse>(data)) {
          return Promise.reject(data);
        }
        return Promise.resolve(data);
      })
      .catch((err: Error) => Promise.reject(err));
  }
}

export default new UserService();
