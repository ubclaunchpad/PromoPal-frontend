import { User as FirebaseUser } from '@firebase/auth-types';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface UserRegistration {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthUser {
  user: User;
  firebaseUser: FirebaseUser;
}
