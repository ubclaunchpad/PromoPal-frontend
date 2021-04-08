import axios, { AxiosResponse } from 'axios';
import firebase from 'firebase';

import FirebaseService from '../services/FirebaseService';
import {
  GetUserResponse,
  SavePromotion,
  SavePromotionResponse,
  UnsavePromotionResponse,
  UpdateUserResponse,
  UploadedPromotionsResponse,
} from '../types/api';
import { Promotion } from '../types/promotion';
import { User, UserRegistration } from '../types/user';
import { isError } from '../utils/api';
import Routes from '../utils/routes';

class UserService {
  /**
   * Fetches the uploaded promotions of the currently logged in user.
   *
   * @param userId - The user id of the user's uploaded promotions to get
   */
  public async getUploadedPromotions(userId: string): Promise<Promotion[]> {
    FirebaseService.getAuth().currentUser?.getIdToken();
    const endpoint = Routes.USERS.UPLOADED_PROMOTIONS(userId);
    return axios
      .get(endpoint)
      .then(({ data }: AxiosResponse<UploadedPromotionsResponse>) => {
        if (isError<UploadedPromotionsResponse>(data)) {
          return Promise.reject(data);
        }
        return Promise.resolve(data);
      })
      .catch((err: Error) => Promise.reject(err));
  }

  /**
   * Gets the details of the currently logged in user.
   *
   * @param firebaseId - The firebase id of the user to get
   */
  public async getUser(firebaseId: string): Promise<User> {
    FirebaseService.getAuth().currentUser?.getIdToken();
    const url = Routes.USERS.GET_BY_FIREBASE_ID(firebaseId);
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
   * @param userId - The user id of the user saving the promotion
   * @param promotionId - The id of the promotion to save
   */
  public async savePromotion(userId: string, promotionId: string): Promise<SavePromotion> {
    FirebaseService.getAuth().currentUser?.getIdToken();
    const endpoint = Routes.USERS.SAVE_PROMOTION(userId, promotionId);
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
   * @param userId - The user id of the user unsaving the promotion
   * @param promotionId - The id of the promotion to unsave
   */
  public async unsavePromotion(
    userId: string,
    promotionId: string
  ): Promise<UnsavePromotionResponse> {
    FirebaseService.getAuth().currentUser?.getIdToken();
    const endpoint = Routes.USERS.UNSAVE_PROMOTION(userId, promotionId);
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
   * Registers a user in Firebase and in the BE
   *
   * @param data - Data to register the user with
   */
  public async registerUser(data: UserRegistration): Promise<void> {
    try {
      const url = Routes.USERS.POST;
      await axios.post(url, data);
      return Promise.resolve();
    } catch (err) {
      if (err.response?.data) {
        return Promise.reject({ message: err.response.data });
      }
      return Promise.reject(err);
    }
  }

  /**
   * Wrapper for FirebaseService.doSignInWithEmailAndPassword()
   * Logs in a user
   *
   * @param data - Data to log in the user with
   * */
  public async loginUser(data: {
    email: string;
    password: string;
    staySignedIn: boolean;
  }): Promise<firebase.auth.UserCredential> {
    return FirebaseService.doSignInWithEmailAndPassword(
      data.email,
      data.password,
      data.staySignedIn
    );
  }

  public async signUserOut(): Promise<void> {
    return FirebaseService.doSignOut();
  }

  /**
   * Updates the given properties for the currently logged-in user
   * in Firebase and in the BE.
   *
   * @param data - Data to update the user with
   */
  public async updateUser(userId: string, data: UserRegistration): Promise<void> {
    FirebaseService.getAuth().currentUser?.getIdToken();
    return FirebaseService.doEmailUpdate(data.password, data.email).then(() => {
      // Update user in BE
      const url = Routes.USERS.UPDATE(userId);
      const user: Partial<User> = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      };
      return axios
        .patch(url, user)
        .then(({ data }: AxiosResponse<UpdateUserResponse>) => {
          if (isError<UpdateUserResponse>(data)) {
            return Promise.reject(data);
          }
          return Promise.resolve();
        })
        .catch((err: Error) => Promise.reject(err));
    });
  }

  /**
   * Wrapper for FirebaseService.doPasswordUpdate()
   * Updates password for the currently logged-in user in Firebase.
   *
   * @param data - Data to update the user with
   */
  public async updateUserPassword(oldPassword: string, newPassword: string): Promise<void> {
    return FirebaseService.doPasswordUpdate(oldPassword, newPassword);
  }

  /**
   * Wrapper for FirebaseService.doPasswordReset()
   * Sends a reset password request to the email specified.
   *
   * @param email
   */
  public resetUserPassword(email: string): void {
    return FirebaseService.doPasswordReset(email);
  }

  /**
   * Wrapper for FirebaseService.doDeleteUser()
   * Deletes the currently logged-in user.
   *
   * @param password
   */
  public async deleteUser(password: string): Promise<void> {
    return FirebaseService.doDeleteUser(password);
  }
}

export default new UserService();
