import { DispatchAction, DispatchParams, State } from '../contexts/RestaurantCardContext';
import { Restaurant } from '../types/restaurant';

/**
 * @function restaurantCardReducer Reducer for managing state of restaurant card.
 *
 * If card is currently visible, hide the card. Otherwise, card is currently hidden and we set the restaurant
 * to the given restaurant (if not given, use the current restaurant in state).
 */
export function restaurantCardReducer(state: State, { type, payload }: DispatchParams): State {
  let nextState = state;

  switch (type) {
    case DispatchAction.SHOW_CARD: {
      const { restaurant } = payload as { restaurant: Restaurant };
      nextState = {
        ...nextState,
        restaurant: restaurant ?? state.restaurant,
        showCard: true,
      };
      break;
    }
    case DispatchAction.HIDE_CARD:
      nextState = {
        ...nextState,
        restaurant: {} as Restaurant,
        showCard: false,
      };
      break;
    default:
      break;
  }
  return nextState;
}
