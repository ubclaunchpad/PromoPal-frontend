import { Place } from '@googlemaps/google-maps-services-js';
import { Dispatch } from 'react';

import { Restaurant } from '../../types/promotion';

export enum DispatchAction {
  // Hide restaurant card
  HIDE_CARD,
  // Show restaurant card
  SHOW_CARD,
  // Toggles restaurant card based on current state + given restaurant
  TOGGLE_CARD,
  // Data is being fetched from the API
  DATA_LOADING,
}

/**
 * @type Context
 * The context to be provided through the component tree.
 *
 * @property state - The current state
 * @property dispatch - The function used to update the state
 */
export type Context = {
  state: State;
  dispatch: Dispatch<DispatchParams>;
};

/**
 * @type Payload
 * The type of the payload parameter in the dispatch call.
 *
 * @property restaurant - An object with properties of the restaurant
 */
export type Payload = {
  restaurant: Place & Restaurant;
};

/**
 * @type DispatchParams
 * The parameters and their types for the dispatch call (for updating state).
 *
 * @property type - The type of action performed
 * @property payload? - Any data needed to update the state
 */
export type DispatchParams = {
  type: DispatchAction;
  payload?: Payload;
};

/**
 * @type State
 * The single source of truth for state related to the restaurant card.
 *
 * @property showCard - Whether or not the card is currently being shown
 * @property restaurant - The last selected restaurant
 */
export type State = {
  showCard: boolean;
  isLoading: boolean;
  restaurant: Place & Restaurant;
};
