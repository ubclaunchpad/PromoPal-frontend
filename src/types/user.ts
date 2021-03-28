import { Promotion } from './promotion';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  uploadedPromotions: Promotion[];
  username: string;
}
