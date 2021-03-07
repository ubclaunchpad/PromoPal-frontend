import { UploadedPromotionsResponse } from '../types/api';
import { Promotion } from '../types/promotion';
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

  public async getUploadedPromotions(userId: string): Promise<Promotion[]> {
    const url = Routes.USERS.UPLOADED_PROMOTIONS(userId);
    return fetch(url)
      .then((response: Response) => response.json())
      .then((response: UploadedPromotionsResponse) => {
        if (isError<UploadedPromotionsResponse>(response)) {
          return Promise.reject(response);
        }
        const { uploadedPromotions } = response;
        return Promise.resolve(uploadedPromotions);
      })
      .catch((err: Error) => Promise.reject(err));
  }
}

export default new UserService();
