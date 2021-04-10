import axios, { AxiosResponse } from 'axios';
import firebase from 'firebase';

import FirebaseService from '../services/FirebaseService';
import {
  DeleteUserResponse,
  GetUserResponse,
  SavePromotion,
  SavePromotionResponse,
  UnsavePromotionResponse,
  UpdateUserResponse,
  UploadedPromotionsResponse,
} from '../types/api';
import { Promotion } from '../types/promotion';
import { AuthUser, User, UserInput } from '../types/user';
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
   * @param userId - The id of the user to get
   */
  public async getUser(userId: string): Promise<User> {
    FirebaseService.getAuth().currentUser?.getIdToken();
    const url = Routes.USERS.GET(userId);
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
  public async registerUser(data: UserInput): Promise<void> {
    try {
      const url = Routes.USERS.POST;
      await axios.post(url, { ...data, confirmPassword: undefined });
      // after successful creation of user, sign in to trigger AuthUserContext and update state
      await FirebaseService.doSignInWithEmailAndPassword(data.email, data.password, false);
      return Promise.resolve();
    } catch (err) {
      if (err.response?.data?.message && Array.isArray(err.response.data.message)) {
        return Promise.reject({ message: err.response.data.message.join(' ') });
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
   * @param authUser - The logged in user
   * @param data - Data to update the user with
   */
  public async updateUser(authUser: AuthUser, data: UserInput): Promise<void> {
    try {
      FirebaseService.getAuth().currentUser?.getIdToken();
      if (authUser.firebaseUser.email !== data.email) {
        await FirebaseService.doEmailUpdate(data.password, data.email);
      } else {
        // we still want to make sure user is authenticated to make changes to the rest of their account details
        await FirebaseService.doReauthenticateUser(data.password);
      }

      if (
        authUser.user.firstName === data.firstName &&
        authUser.user.lastName === data.lastName &&
        authUser.user.username === data.username
      ) {
        return Promise.resolve();
      }

      const url = Routes.USERS.UPDATE(authUser.user.id);
      const user: Partial<User> = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      };
      await axios
        .patch(url, user)
        .then(async ({ data }: AxiosResponse<UpdateUserResponse>) => {
          if (isError<UpdateUserResponse>(data)) {
            return Promise.reject(data);
          }
          // hack: force onIdTokenChanged to be called
          await authUser.firebaseUser.getIdToken(true);
          return Promise.resolve();
        })
        .catch((err: Error) => Promise.reject(err));
    } catch (err) {
      if (err.response?.data?.message && Array.isArray(err.response.data.message)) {
        return Promise.reject({ message: err.response.data.message.join(' ') });
      }
      return Promise.reject(err);
    }
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
   * @param email - The user's email
   */
  public resetUserPassword(email: string): void {
    return FirebaseService.doPasswordReset(email);
  }

  /**
   * Wrapper for FirebaseService.doDeleteUser()
   * Deletes the currently logged-in user.
   *
   * @param userId - The id of the user
   * @param password - The user's password
   */
  public async deleteUser(userId: string, password: string): Promise<DeleteUserResponse> {
    return FirebaseService.doDeleteUser(password)
      .then(() => {
        const url = Routes.USERS.DELETE(userId);
        return axios.delete(url);
      })
      .then(({ data }: AxiosResponse<DeleteUserResponse>) => {
        if (isError<DeleteUserResponse>(data)) {
          return Promise.reject(data);
        }
        return Promise.resolve();
      })
      .catch((err: Error) => Promise.reject(err));
  }
}

export default new UserService();
