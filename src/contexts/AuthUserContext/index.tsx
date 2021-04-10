import { User as FirebaseUser } from '@firebase/auth-types';
import axios from 'axios';
import React, { createContext, ReactElement, useContext, useEffect, useState } from 'react';

import FirebaseService from '../../services/FirebaseService';
import UserService from '../../services/UserService';
import { AuthUser, User } from '../../types/user';

/**
 * Holds the most up-to-date context object.
 */
const AuthUserContext = createContext<AuthUser | null>(null);

/**
 * @component AuthUserProvider
 * The context provider component for an auth user.
 *
 * @param children - The child components or elements
 */
export function AuthUserProvider({
  children,
}: {
  children: ReactElement | ReactElement[];
}): ReactElement {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Observer is triggered when the user signs in, signs out,
    // changes account details, changes password,
    // or when the user's ID token changes
    FirebaseService.getAuth().onIdTokenChanged((firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        axios.interceptors.request.use(
          async (request) => {
            if (
              request.url?.startsWith('/users') ||
              request.url?.startsWith('/promotions') ||
              request.url?.startsWith('/restaurants')
            ) {
              request.headers.authorization = await firebaseUser.getIdToken();
            }
            return request;
          },
          (err: Error) => {
            return Promise.reject(err);
          }
        );
        UserService.getUser(firebaseUser.uid)
          .then((user: User) => {
            setAuthUser({ user: user, firebaseUser: firebaseUser });
          })
          .catch(() => {
            setAuthUser(null);
          });
      } else {
        setAuthUser(null);
      }
    });
  }, []);
  return <AuthUserContext.Provider value={authUser}>{children}</AuthUserContext.Provider>;
}

/**
 * Use this function to access the context object.
 */
export function useAuthUser(): AuthUser | null {
  return useContext(AuthUserContext);
}
