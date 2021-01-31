import { Card } from 'antd';
import React, { CSSProperties, ReactElement, useCallback } from 'react';

import { DispatchAction, useRestaurantCard } from '../../contexts/RestaurantCardContext';
import { getRestaurant } from '../../services/PromotionService';
import { Promotion } from '../../types/promotion';
import { Restaurant } from '../../types/restaurant';
import PromotionDetails from '../promotion/PromotionDetails';
import PromotionImage from '../promotion/PromotionImage';

const styles: { [identifier: string]: CSSProperties } = {
  body: {
    display: 'inline-flex',
    textAlign: 'left',
    width: '100%',
    padding: 10,
  },
  card: {
    cursor: 'pointer',
    display: 'inline-block',
    marginBottom: 15,
    width: '100%',
  },
};

export default function PromotionCard(promotion: Promotion): ReactElement {
  const { state, dispatch } = useRestaurantCard();

  /**
   * Gets the restaurant associated with the clicked promotion and toggles visible state of restaurant details card.
   *
   * Shows the restaurant card if:
   * - card was previously closed
   * - clicked restaurant differs from restaurant currently being shown
   *
   * Hides the restaurant card if:
   * - card is currently open and we click the associated promotion
   * - matching restaurant results in an error
   */
  const onClickHandler = useCallback(async () => {
    return getRestaurant(promotion)
      .then((restaurant: Restaurant) => {
        const isOpeningRestaurantCard = !state.showCard;
        const isNewRestaurant = state.showCard && state.restaurant.id !== restaurant.id;
        if (isNewRestaurant || isOpeningRestaurantCard) {
          dispatch({ type: DispatchAction.SHOW_CARD, payload: { restaurant } });
        } else {
          dispatch({ type: DispatchAction.HIDE_CARD });
        }
      })
      .catch(() => dispatch({ type: DispatchAction.HIDE_CARD }));
  }, [state, dispatch, promotion]);

  return (
    <Card style={styles.card} bodyStyle={styles.body} onClick={onClickHandler}>
      <PromotionImage {...promotion.image} />
      <PromotionDetails {...promotion} />
    </Card>
  );
}
