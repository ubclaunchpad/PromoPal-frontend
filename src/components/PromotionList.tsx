import React, { CSSProperties, ReactElement, useCallback, useEffect, useState } from 'react';

import PromotionCard from '../components/promotion/PromotionCard';
import { DispatchAction, usePromotionsList } from '../contexts/PromotionsListContext';
import { filterPromotions, getPromotions, sortPromotions } from '../services/PromotionService';
import UserService from '../services/UserService';
import { Promotion } from '../types/promotion';

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

  const { state: promotionListState, dispatch } = usePromotionsList();

  const containerStyles = {
    height,
    width,
    ...styles.container,
  };

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
   * This hook is run everytime the promotionsListState changes. This function sorts and filters the promotions
   * according to the `filter` and `sort` keys so that this component is displaying the appropriate list.
   */
  useEffect(() => {
    dispatch({ type: DispatchAction.DATA_LOADING });

    filterPromotions(promotionListState.filter)
      .then((filteredPromotions: Promotion[]) =>
        sortPromotions(filteredPromotions, promotionListState.sort)
      )
      .then((sortedPromotions: Promotion[]) => {
        dispatch({ type: DispatchAction.DATA_SUCCESS });

        // If search bar contains keyword, reset it. This is only minimal behaviour and a temporary workaround, needs work with PP-68
        dispatch({ type: DispatchAction.RESET_SEARCH_QUERY });

        setPromotions(sortedPromotions);
      })
      .catch(() => {
        dispatch({ type: DispatchAction.DATA_FAILURE });
        setPromotions([]);
      });
  }, [promotionListState.filter, promotionListState.sort, dispatch]);

  /**
   * When a search query is set, fetches promotions that satisfy the query.
   */
  useEffect(() => {
    if (promotionListState.searchQuery) {
      dispatch({ type: DispatchAction.DATA_LOADING });
      getPromotions([{ searchQuery: promotionListState.searchQuery }]).then((promotions) => {
        dispatch({ type: DispatchAction.DATA_SUCCESS });
        setPromotions(promotions);
      });
    }
  }, [dispatch, promotionListState.searchQuery]);

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
        />
      ))}
    </div>
  );
}
