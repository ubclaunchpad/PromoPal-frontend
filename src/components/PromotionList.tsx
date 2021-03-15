import React, { CSSProperties, ReactElement, useCallback, useEffect, useState } from 'react';

import PromotionCard from '../components/promotion/PromotionCard';
import {
  DispatchAction as PromotionsDispatch,
  usePromotionsList,
} from '../contexts/PromotionsListContext';
import {
  DispatchAction as RestaurantDispatch,
  useRestaurantCard,
} from '../contexts/RestaurantCardContext';
import {
  filterPromotions,
  getPromotions,
  getRestaurant,
  sortPromotions,
} from '../services/PromotionService';
import UserService from '../services/UserService';
import { Promotion } from '../types/promotion';
import { Restaurant } from '../types/restaurant';

const styles: { [identifier: string]: CSSProperties } = {
  container: {
    backgroundColor: '#FFEDDC',
    padding: 15,
    paddingBottom: 0,
    overflow: 'auto',
  },
};

export default function PromotionList({
  dimensions: { width, height },
}: {
  dimensions: { width: string; height: string };
}): ReactElement {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const { state: promotionsState, dispatch: promotionsDispatch } = usePromotionsList();
  const { dispatch: restaurantDispatch } = useRestaurantCard();

  const containerStyles = {
    height,
    width,
    ...styles.container,
  };

  /**
   * This hook is run everytime the promotionsListState changes. This function sorts and filters the promotions
   * On click, retrieves the associated restaurant details and shows the restaurant card.
   */
  const onClickHandler = useCallback(
    (placeId: string) => {
      getRestaurant(placeId)
        .then((restaurant: Restaurant) => {
          restaurantDispatch({
            type: RestaurantDispatch.TOGGLE_CARD,
            payload: { placeId, restaurant },
          });
        })
        .catch(() => restaurantDispatch({ type: RestaurantDispatch.HIDE_CARD }));
    },
    [restaurantDispatch]
  );

  /**
   * If the user has not saved the promotion, save the promotion. Otherwise, delete it from their saved promotions.
   */
  const onSaveButtonClick = useCallback(
    (promotionId: string) => {
      const promos = [...promotions];
      const promotion = promos.find(({ id }) => id === promotionId);
      if (promotion) {
        if (promotion.isSavedByUser) {
          promotion.isSavedByUser = false;
          return UserService.unsavePromotion(promotionId)
            .then(() => setPromotions(promos))
            .catch(() => null);
        }
        promotion.isSavedByUser = true;
        return UserService.savePromotion(promotionId)
          .then(() => setPromotions(promos))
          .catch(() => null);
      }
    },
    [promotions, setPromotions]
  );

  /**
   * This hook is run everytime the promotionsState changes. This function sorts and filters the promotions
   * according to the `filter` and `sort` keys so that this component is displaying the appropriate list.
   */
  useEffect(() => {
    promotionsDispatch({ type: PromotionsDispatch.DATA_LOADING });
    filterPromotions(promotionsState.filter)
      .then((filteredPromotions: Promotion[]) =>
        sortPromotions(filteredPromotions, promotionsState.sort)
      )
      .then((sortedPromotions: Promotion[]) => {
        promotionsDispatch({ type: PromotionsDispatch.DATA_SUCCESS });

        // If search bar contains keyword, reset it. This is only minimal behaviour and a temporary workaround, needs work with PP-68
        promotionsDispatch({ type: PromotionsDispatch.RESET_SEARCH_QUERY });

        setPromotions(sortedPromotions);
      })
      .catch(() => {
        promotionsDispatch({ type: PromotionsDispatch.DATA_FAILURE });
        setPromotions([]);
      });
  }, [promotionsState.filter, promotionsState.sort, promotionsDispatch]);

  /**
   * When a search query is set, fetches promotions that satisfy the query.
   */
  useEffect(() => {
    if (promotionsState.searchQuery) {
      promotionsDispatch({ type: PromotionsDispatch.DATA_LOADING });
      getPromotions([{ searchQuery: promotionsState.searchQuery }]).then((promotions) => {
        promotionsDispatch({ type: PromotionsDispatch.DATA_SUCCESS });
        setPromotions(promotions);
      });
    }
  }, [promotionsDispatch, promotionsState.searchQuery]);

  return (
    <div style={containerStyles}>
      {promotions.map((promotion: Promotion) => (
        <PromotionCard
          key={promotion.id}
          id={promotion.id}
          boldDescription={promotion.boldDescription}
          boldName={promotion.boldName}
          dateAdded={promotion.dateAdded}
          expirationDate={promotion.expirationDate}
          description={promotion.description}
          image={promotion.image}
          name={promotion.name}
          placeId={promotion.placeId}
          restaurantName={promotion.restaurantName}
          savedByUser={promotion.isSavedByUser}
          schedules={promotion.schedules}
          onSaveButtonClick={() => onSaveButtonClick(promotion.id)}
          onCardClick={() => onClickHandler(promotion.placeId)}
        />
      ))}
    </div>
  );
}
