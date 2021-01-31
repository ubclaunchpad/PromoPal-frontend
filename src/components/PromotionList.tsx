import React, { CSSProperties, ReactElement, useEffect, useState } from 'react';

import PromotionCard from '../components/promotion/PromotionCard';
import { DispatchAction, usePromotionsList } from '../contexts/PromotionsListContext';
import { filterPromotions, sortPromotions } from '../services/PromotionService';
import { Promotion } from '../types/promotion';

const styles: { [identifier: string]: CSSProperties } = {
  container: {
    padding: 15,
    paddingBottom: 0,
    overflow: 'auto',
  },
};

export default function PromotionList({
  dimensions,
}: {
  dimensions: { width: string; height: string };
}): ReactElement {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const { state: promotionListState, dispatch } = usePromotionsList();

  const containerStyles = {
    marginLeft: `calc(100vw - ${dimensions.width})`,
    ...dimensions,
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
        setPromotions(sortedPromotions);
      })
      .catch(() => {
        dispatch({ type: DispatchAction.DATA_FAILURE });
        setPromotions([]);
      });
  }, [promotionListState.filter, promotionListState.sort, dispatch]);

  return (
    <div style={containerStyles}>
      {promotions.map((promotion: Promotion) => (
        <PromotionCard key={promotion.id} {...promotion} />
      ))}
    </div>
  );
}
