import { Place } from '@googlemaps/google-maps-services-js';
import React, { createContext, ReactElement, useContext, useEffect, useReducer } from 'react';

import { restaurantCardReducer } from '../../reducers/RestaurantCardReducer';
import { Restaurant } from '../../types/promotion';
import { usePromotionsList } from '../PromotionsListContext';
import { Context, DispatchAction, DispatchParams, Payload, State } from './types';

export const initialState: State = {
  showCard: false,
  isLoading: false,
  restaurant: {} as Place & Restaurant,
};

/**
 * Holds the most up-to-date context object.
 */
const RestaurantCardContext = createContext<Context>({
  state: initialState,
  dispatch: () => null,
});

/**
 * @component RestaurantCardProvider
 * The context provider component for the restaurant card.
 *
 * @param children - The child components or elements
 */
export function RestaurantCardProvider({
  children,
}: {
  children: ReactElement | ReactElement[];
}): ReactElement {
  const [state, dispatch] = useReducer(restaurantCardReducer, initialState);

  const PromotionsContext = usePromotionsList();

  /**
   * On first load, hide restaurant card.
   */
  useEffect(() => {
    dispatch({ type: DispatchAction.HIDE_CARD });
  }, []);

  /**
   * If filter or sort keys for promotions change (i.e., dropdown buttons are used), hide the restaurant card.
   */
  useEffect(() => {
    dispatch({ type: DispatchAction.HIDE_CARD });
  }, [PromotionsContext.state.filter, PromotionsContext.state.sort]);

  return (
    <RestaurantCardContext.Provider value={{ state, dispatch }}>
      {children}
    </RestaurantCardContext.Provider>
  );
}

/**
 * Use this function to access the context object.
 * Destructure the return value to access `state` and `dispatch`.
 */
export function useRestaurantCard(): Context {
  const context = useContext(RestaurantCardContext);
  if (!context) {
    throw new Error('useRestaurantCard must be used within a RestaurantCardContext');
  }
  return context;
}

/* Re-export types */
export type { Context, DispatchParams, Payload, State };
export { DispatchAction };
