import { Card } from 'antd';
import React, { CSSProperties, ReactElement, useCallback } from 'react';

import { DispatchAction, useRestaurantCard } from '../../contexts/RestaurantCardContext';
import * as PromotionService from '../../services/PromotionService';
import { PromotionImage as PromotionImageType, Schedule } from '../../types/promotion';
import { Restaurant } from '../../types/restaurant';
import PromotionDetails from '../promotion/PromotionDetails';
import PromotionImage from '../promotion/PromotionImage';

const styles: { [identifier: string]: CSSProperties } = {
  body: {
    display: 'inline-flex',
    padding: 10,
    textAlign: 'left',
    width: '100%',
  },
  card: {
    borderRadius: 15,
    borderWidth: 0,
    boxShadow: '2px 2px 4px 0px #40333333',
    cursor: 'pointer',
    display: 'inline-block',
    marginBottom: 15,
    width: '100%',
  },
};

interface Props {
  dateAdded: string;
  description: string;
  expirationDate: string;
  id: string;
  image: PromotionImageType;
  liked: boolean;
  name: string;
  placeId: string;
  restaurantName: string;
  schedules: Schedule[];

  onDeleteButtonClick?: () => void;
  onLikeButtonClick: () => void;

  boldName?: string;
  boldDescription?: string;
}

export default function PromotionCard(props: Props): ReactElement {
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
    return PromotionService.getRestaurant(props.placeId)
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
  }, [state, dispatch, props.placeId]);

  return (
    <Card style={styles.card} bodyStyle={styles.body} onClick={onClickHandler}>
      <PromotionImage src={props.image?.src} />
      <PromotionDetails
        boldName={props.boldName}
        boldDescription={props.boldDescription}
        dateAdded={props.dateAdded}
        description={props.description}
        expirationDate={props.expirationDate}
        id={props.id}
        liked={props.liked}
        name={props.name}
        restaurantName={props.restaurantName}
        schedules={props.schedules}
        onDeleteButtonClick={props.onDeleteButtonClick}
        onLikeButtonClick={props.onLikeButtonClick}
      />
    </Card>
  );
}
