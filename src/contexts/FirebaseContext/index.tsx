import React, { createContext, ReactElement, useContext } from 'react';

import Firebase from '../../services/FirebaseService';

/**
 * Holds the most up-to-date context object.
 */
const FirebaseContext = createContext<Firebase | null>(null);

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
  return <FirebaseContext.Provider value={new Firebase()}>{children}</FirebaseContext.Provider>;
}

/**
 * Use this function to access the context object.
 */
export function useFirebase(): Firebase {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('Firebase does not exist');
  }
  return context;
}
