import { Place } from '@googlemaps/google-maps-services-js';

import { DispatchAction, DispatchParams, State } from '../contexts/RestaurantCardContext';

/**
 * @function restaurantCardReducer Reducer for managing state of restaurant card.
 *
 * If card is currently visible, hide the card. Otherwise, card is currently hidden and we set the restaurant
 * to the given restaurant (if not given, use the current restaurant in state).
 */
export function restaurantCardReducer(state: State, { type, payload }: DispatchParams): State {
  let nextState = state;

  switch (type) {
    /**
     * Shows the restaurant card.
     */
    case DispatchAction.SHOW_CARD: {
      const { restaurantId, restaurant } = payload as { restaurantId: string; restaurant: Place };
      nextState = {
        ...nextState,
        restaurantId: restaurantId,
        restaurant: restaurant ?? state.restaurant,
        showCard: true,
      };
      break;
    }
    /**
     * Hides the restaurant card.
     */
    case DispatchAction.HIDE_CARD:
      nextState = {
        ...nextState,
        restaurant: {} as Place,
        showCard: false,
      };
      break;
    /**
     * Updates whether the restaurant card should be visible or not.
     *
     * Shows the restaurant card if:
     * - card was previously closed
     * - clicked restaurant differs from restaurant currently being shown
     *
     * Hides the restaurant card if:
     * - card is currently open and we click the associated promotion
     * - matching restaurant results in an error
     */
    case DispatchAction.TOGGLE_CARD: {
      const { restaurantId } = payload as { restaurantId: string; restaurant: Place };
      const isOpeningRestaurantCard = !state.showCard;
      const isNewRestaurant = state.showCard && state.restaurantId !== restaurantId;

      let dispatchParams: DispatchParams;
      if (isNewRestaurant || isOpeningRestaurantCard) {
        dispatchParams = { type: DispatchAction.SHOW_CARD, payload };
      } else {
        dispatchParams = { type: DispatchAction.HIDE_CARD };
      }
      nextState = restaurantCardReducer(state, dispatchParams);
      break;
    }
    default:
      break;
  }
  return nextState;
}
