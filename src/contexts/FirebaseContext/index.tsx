import React, { createContext, ReactElement, useContext } from 'react';

import FirebaseService from '../../services/FirebaseService';
// TODO: do not need this provider/context anymore
/**
 * Holds the most up-to-date context object.
 */
const FirebaseContext = createContext<FirebaseService | null>(null);

/**
 * @component FirebaseProvider
 * The context provider component for firebase.
 *
 * @param children - The child components or elements
 */
export function FirebaseProvider({
  children,
}: {
  children: ReactElement | ReactElement[];
}): ReactElement {
  return (
    <FirebaseContext.Provider value={new FirebaseService()}>{children}</FirebaseContext.Provider>
  );
}

/**
 * Use this function to access the context object.
 */
export function useFirebase(): FirebaseService {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('Firebase does not exist');
  }
  return context;
}
