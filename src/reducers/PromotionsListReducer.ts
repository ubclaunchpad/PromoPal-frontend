import {
  defaultFilters,
  defaultSearchQuery,
  defaultSort,
  DispatchAction,
  DispatchParams,
  State,
} from '../contexts/PromotionsListContext';
import { FilterOptions, Promotion, Sort } from '../types/promotion';

/**
 * @function promotionsListReducer Reducer for managing state of list of promotions.
 *
 * Updates state to include the given filter key, sort key, and/or list of promotions.
 */
export function promotionsListReducer(state: State, { type, payload }: DispatchParams): State {
  let nextState = state;

  switch (type) {
    /**
     * Sets state.isLoading to true.
     */
    case DispatchAction.DATA_LOADING:
      nextState = {
        ...nextState,
        hasError: false,
        isLoading: true,
      };
      break;
    /**
     * Sets state.isLoading to false and state.hasError to false.
     */
    case DispatchAction.DATA_SUCCESS: {
      if (payload) {
        const { promotions } = payload as { promotions: Promotion[] };
        nextState = {
          ...nextState,
          data: promotions,
        };
      }
      nextState = {
        ...nextState,
        hasError: false,
        isLoading: false,
      };
      break;
    }
    /**
     * Sets state.isLoading to false and state.hasError to true.
     * Updates state.data to be either given promotions or previous promotions set on state if undefined.
     */
    case DispatchAction.DATA_FAILURE: {
      if (payload) {
        const { promotions } = payload as { promotions: Promotion[] };
        nextState = {
          ...nextState,
          data: promotions,
        };
      }
      nextState = {
        ...nextState,
        isLoading: false,
        hasError: true,
      };
      break;
    }
    /**
     * Replaces filters with the currently selected filters.
     */
    case DispatchAction.UPDATE_FILTERS: {
      const { filter } = payload as { filter: Partial<FilterOptions> };
      nextState = {
        ...nextState,
        filter: {
          ...state.filter,
          ...filter,
        },
      };
      break;
    }
    /**
     * Resets filters and sort key to defaults.
     */
    case DispatchAction.RESET_FILTERS: {
      nextState = {
        ...nextState,
        filter: defaultFilters,
        sort: defaultSort,
      };
      break;
    }
    /**
     * Sets sort key.
     */
    case DispatchAction.SORT: {
      const { sort } = payload as { sort: Sort };
      nextState = { ...nextState, sort };
      break;
    }

    /**
     * Sets search query
     */
    case DispatchAction.SEARCH_QUERY: {
      const { searchQuery } = payload as { searchQuery: string };
      nextState = { ...nextState, searchQuery };
      break;
    }

    /**
     * Resets search query to default
     */
    case DispatchAction.RESET_SEARCH_QUERY: {
      nextState = { ...nextState, searchQuery: defaultSearchQuery };
      break;
    }

    default:
      break;
  }

  return nextState;
}
