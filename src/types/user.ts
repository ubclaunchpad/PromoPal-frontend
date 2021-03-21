import { Promotion } from './promotion';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  uploadedPromotions: Promotion[];
  userName: string;
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}
