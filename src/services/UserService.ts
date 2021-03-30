import axios, { AxiosResponse } from 'axios';

import {
  GetUserResponse,
  SavePromotion,
  SavePromotionResponse,
  UnsavePromotionResponse,
  UpdateUserResponse,
  UploadedPromotionsResponse,
} from '../types/api';
import { Promotion } from '../types/promotion';
import { User } from '../types/user';
import { isError } from '../utils/api';
import Routes from '../utils/routes';

class UserService {
  private _userId: string;

  public constructor() {
    this._userId = '8f8fc016-5bb2-4906-ad88-68932c438665';
  }

  public get userId(): string {
    return this._userId;
  }

  /**
   * Fetches the uploaded promotions of the currently logged in user.
   */
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

  /**
   * Gets the details of the currently logged in user.
   */
  public async getUser(): Promise<User> {
    const url = Routes.USERS.GET(this.userId);
    return axios
      .get(url)
      .then(({ data }: AxiosResponse<GetUserResponse>) => {
        if (isError<GetUserResponse>(data)) {
          return Promise.reject(data);
        }
        return Promise.resolve(data);
      })
      .catch((err: Error) => Promise.reject(err));
  }

  /**
   * Sets the promotion as saved for the current user.
   *
   * @param promotionId - The id of the promotion to save
   */
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

  /**
   * Sets the promotion as unsaved for the current user.
   *
   * @param promotionId - The id of the promotion to unsave
   */
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

  /**
   * Updates the given properties for the currently logged-in user on the BE.
   *
   * @param user - An object with properties to update on the user
   */
  public async updateUser(user: Partial<User>): Promise<void> {
    const url = Routes.USERS.UPDATE(this.userId);
    return axios
      .patch(url, user)
      .then(({ data }: AxiosResponse<UpdateUserResponse>) => {
        if (isError<UpdateUserResponse>(data)) {
          return Promise.reject(data);
        }
        return Promise.resolve();
      })
      .catch((err: Error) => Promise.reject(err));
  }
}

export default new UserService();
