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
import { PostUserDTO, User, UserInputData } from '../types/user';
import { isError } from '../utils/api';
import Routes from '../utils/routes';

class UserService {
  // Todo: move this into AuthUserContext, but first look for usages of the userId and make sure we do not
  // break existing behaviour
  private _userId = '';

  public get userId(): string {
    return this._userId;
  }

  /**
   * Fetches the uploaded promotions of the currently logged in user.
   */
  public async getUploadedPromotions(firebaseService: FirebaseService): Promise<Promotion[]> {
    firebaseService.getAuth().currentUser?.getIdToken();
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
  public async getUser(firebaseService: FirebaseService): Promise<User> {
    firebaseService.getAuth().currentUser?.getIdToken();
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
   * @param firebaseService
   */
  public async savePromotion(
    promotionId: string,
    firebaseService: FirebaseService
  ): Promise<SavePromotion> {
    firebaseService.getAuth().currentUser?.getIdToken();
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
  public async unsavePromotion(
    promotionId: string,
    firebaseService: FirebaseService
  ): Promise<UnsavePromotionResponse> {
    firebaseService.getAuth().currentUser?.getIdToken();
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
   * Registers a user in Firebase and in the BE
   *
   * @param firebaseService - The firebaseService object
   * @param data - Data to register the user with
   * todo: pass in AuthUserContext
   * todo update AuthUserContext with the user id
   */
  public async registerUser(firebaseService: FirebaseService, data: UserInputData): Promise<void> {
    try {
      const userCredential: firebase.auth.UserCredential = await firebaseService.doCreateUserWithEmailAndPassword(
        data.email,
        data.password
      );
      const idToken = await userCredential.user?.getIdToken();
      if (!userCredential.user?.uid || !idToken) {
        // TODO: handle errors more appropriately https://promopal.atlassian.net/browse/PP-38
        return Promise.reject(new Error('Sorry we were unable to register you, please try again.'));
      }
      const url = Routes.USERS.POST;
      const postUserDTO: PostUserDTO = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        firebaseId: userCredential.user?.uid,
      };
      try {
        const response: AxiosResponse<User> = await axios.post(url, postUserDTO, {
          headers: {
            authorization: idToken,
          },
        });
        // todo: remove the field _userId, keeping it here temporarily so application still runs
        this._userId = response.data.id;
        return Promise.resolve();
      } catch (e) {
        // we were not able to create user successfully, delete user in firebase
        await userCredential.user?.delete();
        throw e;
      }
    } catch (error) {
      if (error.response?.data) {
        return Promise.reject({ message: error.response.data });
      }
      return Promise.reject(error);
    }
  }

  /**
   * Updates the given properties for the currently logged-in user
   * in Firebase and in the BE.
   *
   * @param firebaseService - The firebaseService object
   * @param data - Data to update the user with
   */
  public async updateUser(firebaseService: FirebaseService, data: UserInputData): Promise<void> {
    firebaseService.getAuth().currentUser?.getIdToken();
    return firebaseService.doEmailUpdate(data.password, data.email).then(() => {
      // Update user in BE
      const url = Routes.USERS.UPDATE(this.userId);
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
   * todo: pass in AuthUserContext
   * todo update AuthUserContext with the user id
   * */
  async doSignInWithEmailAndPassword(
    firebaseService: FirebaseService,
    data: { email: string; password: string; staySignedIn: boolean }
  ): Promise<firebase.auth.UserCredential> {
    try {
      const userCredential = await firebaseService.doSignInWithEmailAndPassword(
        data.email,
        data.password,
        data.staySignedIn
      );
      const idToken = await userCredential.user?.getIdToken();
      if (!idToken || !userCredential.user?.uid) {
        // TODO: handle errors more appropriately https://promopal.atlassian.net/browse/PP-38
        return Promise.reject(new Error('Sorry we were unable to register you, please try again.'));
      }

      const url = Routes.USERS.GET_BY_FIREBASE_ID(userCredential.user.uid);
      const response: AxiosResponse<User> = await axios.get(url, {
        headers: {
          authorization: idToken,
        },
      });
      this._userId = response.data.id;
      return Promise.resolve(userCredential);
    } catch (error) {
      // TODO: handle errors more appropriately https://promopal.atlassian.net/browse/PP-38
      if (error.response?.data) {
        return Promise.reject({ message: error.response.data });
      }
      return Promise.reject(error);
    }
  }
}

export default new UserService();
