import { Promotion } from './promotion';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  uploadedPromotions: Promotion[];
  username: string;
  // todo: should have firebaseId
}

export interface UserInputData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface PostUserDTO {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  firebaseId?: string;
}
