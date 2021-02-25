import axios, { AxiosResponse } from 'axios';

import { GetUserResponse, UpdateUserResponse, UploadedPromotionsResponse } from '../types/api';
import { Promotion } from '../types/promotion';
import { User } from '../types/user';
import { isError } from '../utils/api';
import Routes from '../utils/routes';

class UserService {
  private userId: string;

  public constructor() {
    this.userId = '8f8fc016-5bb2-4906-ad88-68932c438665';
  }

  /**
   * Fetches the uploaded promotions of the currently logged in user.
   */
  public async getUploadedPromotions(): Promise<Promotion[]> {
    const url = Routes.USERS.UPLOADED_PROMOTIONS(this.userId);
    return axios
      .get(url)
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
