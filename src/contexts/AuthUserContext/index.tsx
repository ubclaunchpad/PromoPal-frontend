import { User as AuthUser } from '@firebase/auth-types';
import React, { createContext, ReactElement, useContext, useEffect, useState } from 'react';

import { useFirebase } from '../../contexts/FirebaseContext';

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
  const firebase = useFirebase();

  useEffect(() => {
    firebase.getAuth().onAuthStateChanged((authUser: AuthUser | null) => {
      authUser ? setAuthUser(authUser) : setAuthUser(null);
    });
  });

  return <AuthUserContext.Provider value={authUser}>{children}</AuthUserContext.Provider>;
}

/**
 * Use this function to access the context object.
 */
export function useAuthUser(): AuthUser | null {
  const context = useContext(AuthUserContext);
  return context;
}
