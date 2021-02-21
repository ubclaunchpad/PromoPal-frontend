import { UploadedPromotionsResponse } from '../types/api';
import { Promotion } from '../types/promotion';
import { isError } from '../utils/api';
import Routes from '../utils/routes';

class UserService {
  public async getUploadedPromotions(userId: string): Promise<Promotion[]> {
    const url = `${Routes.USERS}/${userId}/uploadedPromotions/`;
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
