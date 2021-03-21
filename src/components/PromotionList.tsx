import { Pagination } from 'antd';
import React, {
  CSSProperties,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

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
import { Promotion } from '../types/promotion';
import { Restaurant } from '../types/restaurant';

const PAGE_SIZE = 10;

const styles: { [identifier: string]: CSSProperties } = {
  container: {
    backgroundColor: '#FFEDDC',
    padding: 15,
    overflow: 'auto',
    scrollBehavior: 'smooth',
    textAlign: 'center',
  },
};

export default function PromotionList({
  dimensions: { width, height },
}: {
  dimensions: { width: string; height: string };
}): ReactElement {
  const container = useRef<HTMLDivElement>(null);

  const [pageNum, setPageNum] = useState<number>(1);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promotionsToDisplay, setPromotionsToDisplay] = useState<Promotion[]>([]);

  const { state: promotionsState, dispatch: promotionsDispatch } = usePromotionsList();
  const { dispatch: restaurantDispatch } = useRestaurantCard();

  const containerStyles = {
    height,
    width,
    ...styles.container,
  };

  /**
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
   * When the page is changed, updates the currently displayed promotions.
   *
   * @param page - The current page number
   */
  const onPageChange = (page: number) => {
    if (container?.current) {
      container.current.scrollTop = 0;
    }

    // Timeout to allow scrolling time to execute
    setTimeout(() => {
      const start = (page - 1) * PAGE_SIZE;
      const end = Math.min(page * PAGE_SIZE, promotions.length);
      setPromotionsToDisplay(promotions.slice(start, end));
      setPageNum(page);
    }, 250);
  };

  /**
   * On initial render, display the first page of promotions.
   */
  useEffect(() => {
    setPromotionsToDisplay(promotions.slice(0, PAGE_SIZE));
  }, [promotions]);

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
    <div style={containerStyles} ref={container}>
      {promotionsToDisplay.map((promotion) => (
        <PromotionCard
          key={promotion.id}
          promotion={promotion}
          onClick={() => onClickHandler(promotion.placeId)}
        />
      ))}
      <Pagination
        size="small"
        defaultCurrent={1}
        current={pageNum}
        onChange={onPageChange}
        total={promotions.length}
      />
    </div>
  );
}
