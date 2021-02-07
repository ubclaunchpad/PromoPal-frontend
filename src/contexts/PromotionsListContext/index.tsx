import React, { createContext, ReactElement, useContext, useEffect, useReducer } from 'react';

import { promotionsListReducer } from '../../reducers/PromotionsListReducer';
import { getPromotions } from '../../services/PromotionService';
import { FilterOptions, Promotion, Sort } from '../../types/promotion';
import { Context, DispatchAction, DispatchParams, State } from './types';

export const defaultFilters: FilterOptions = {
  cuisine: [],
  dayOfWeek: [],
  discountType: '',
  promotionType: [],
};

export const defaultSort = Sort.Default;

const initialState: State = {
  isLoading: false,
  hasError: false,
  data: [],
  filter: defaultFilters,
  sort: defaultSort,
};

/**
 * Holds the most up-to-date context object.
 */
const PromotionsListContext = createContext<Context>({
  state: initialState,
  dispatch: () => null,
});

/**
 * @component PromotionsListProvider
 * The context provider component for promotions.
 *
 * @param children - The child components or elements
 */
export function PromotionsListProvider({
  children,
}: {
  children: ReactElement | ReactElement[];
}): ReactElement {
  const [state, dispatch] = useReducer(promotionsListReducer, initialState);

  /**
   * On component mount, fetch promotions and set them on the state.
   */
  useEffect(() => {
    dispatch({ type: DispatchAction.DATA_LOADING });
    getPromotions()
      .then((promotions: Promotion[]) => {
        const payload = { promotions };
        dispatch({ type: DispatchAction.DATA_SUCCESS, payload });
      })
      .catch(() => {
        const payload = { promotions: [] };
        dispatch({ type: DispatchAction.DATA_FAILURE, payload });
      });
  }, []);

  return (
    <PromotionsListContext.Provider value={{ state, dispatch }}>
      {children}
    </PromotionsListContext.Provider>
  );
}

/**
 * Use this function to access the context object.
 * Destructure the return value to access `state` and `dispatch`.
 */
export function usePromotionsList(): Context {
  const context = useContext(PromotionsListContext);
  if (!context) {
    throw new Error('usePromotionsList must be used within a PromotionsProvider');
  }
  return context;
}

/* Re-export types */
export type { Context, DispatchParams, State };
export { DispatchAction };
