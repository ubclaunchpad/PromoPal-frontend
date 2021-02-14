import React, { CSSProperties, ReactElement, useEffect, useState } from 'react';

import PromotionCard from '../components/promotion/PromotionCard';
import { DispatchAction, usePromotionsList } from '../contexts/PromotionsListContext';
import { filterPromotions, getPromotions, sortPromotions } from '../services/PromotionService';
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
    marginLeft: `calc(100vw - ${width})`,
    ...styles.container,
  };

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

        // If search bar contains keyword, reset it. This is only minimal behaviour, needs work with PP-68
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
        <PromotionCard key={promotion.id} {...promotion} />
      ))}
    </div>
  );
}
