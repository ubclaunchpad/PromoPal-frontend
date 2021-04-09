import { LoadingOutlined } from '@ant-design/icons';
import { Place } from '@googlemaps/google-maps-services-js';
import { Pagination, Spin } from 'antd';
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
import * as PromotionService from '../services/PromotionService';
import UserService from '../services/UserService';
import { Promotion, Restaurant } from '../types/promotion';

const PAGE_SIZE = 10;

const styles: { [identifier: string]: CSSProperties } = {
  container: {
    backgroundColor: '#FFEDDC',
    padding: 15,
    overflow: 'auto',
    scrollBehavior: 'smooth',
    textAlign: 'center',
  },
  spinner: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  spinnerIcon: {
    fontSize: '4em',
  },
};

/**
 * Selects the promotions that should be displayed on the current page.
 *
 * @param promotions - All promotions
 * @param page - The current page
 */
function getPage(promotions: Promotion[], page: number): Promotion[] {
  const start = (page - 1) * PAGE_SIZE;
  const end = Math.min(page * PAGE_SIZE, promotions.length);
  return promotions.slice(start, end);
}

interface Props {
  dimensions: { width: string; height: string };
  pageNum: number;
  onPageChange: (pageNum: number) => void;
}

export default function PromotionList(props: Props): ReactElement {
  const container = useRef<HTMLDivElement>(null);

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promotionsToDisplay, setPromotionsToDisplay] = useState<Promotion[]>([]);

  const { state: promotionsState, dispatch: promotionsDispatch } = usePromotionsList();
  const { dispatch: restaurantDispatch } = useRestaurantCard();

  const containerStyles = {
    height: props.dimensions.height,
    width: props.dimensions.width,
    ...styles.container,
  };

  /**
   * This hook is run everytime the promotionsListState changes. This function sorts and filters the promotions
   * On click, retrieves the associated restaurant details and shows the restaurant card.
   */
  const onClickHandler = useCallback(
    (promoRestaurant: Restaurant) => {
      restaurantDispatch({ type: RestaurantDispatch.DATA_LOADING });

      PromotionService.getRestaurant(promoRestaurant.id)
        .then((restaurant: Place) => {
          restaurantDispatch({
            type: RestaurantDispatch.TOGGLE_CARD,
            payload: {
              restaurant: {
                ...restaurant,
                ...promoRestaurant,
              },
            },
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
   * When the page is changed, updates the currently displayed promotions.
   *
   * @param page - The current page number
   */
  const onPageChange = (page: number): void => {
    if (container?.current) {
      container.current.scrollTop = 0;
    }

    props.onPageChange(page);

    // Timeout to allow scrolling to complete
    setTimeout(() => {
      const promotionsToDisplay = getPage(promotions, page);
      setPromotionsToDisplay(promotionsToDisplay);
    }, 250);
  };

  /**
   * On initial render, display promotions for current page.
   */
  useEffect(() => {
    const promotionsToDisplay = getPage(promotions, props.pageNum);
    setPromotionsToDisplay(promotionsToDisplay);
  }, [promotions, props.pageNum]);

  /**
   * This hook is run everytime the promotionsState changes. This function sorts and filters the promotions
   * according to the `filter` and `sort` keys so that this component is displaying the appropriate list.
   */
  useEffect(() => {
    promotionsDispatch({ type: PromotionsDispatch.DATA_LOADING });

    PromotionService.queryPromotions(promotionsState.filter, promotionsState.sort)
      .then((promotions: Promotion[]) => {
        promotionsDispatch({ type: PromotionsDispatch.DATA_SUCCESS });

        // If search bar contains keyword, reset it. This is only minimal behaviour and a temporary workaround, needs work with PP-68
        promotionsDispatch({ type: PromotionsDispatch.RESET_SEARCH_QUERY });

        setPromotions(promotions);
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
    promotionsDispatch({ type: PromotionsDispatch.DATA_LOADING });
    PromotionService.getPromotions({
      searchQuery: promotionsState.searchQuery ? promotionsState.searchQuery : undefined,
    }).then((promotions) => {
      promotionsDispatch({ type: PromotionsDispatch.DATA_SUCCESS });
      setPromotions(promotions);
    });
  }, [promotionsDispatch, promotionsState.searchQuery]);

  const indicator = <LoadingOutlined style={styles.spinnerIcon} spin />;

  return (
    <div style={containerStyles} ref={container}>
      {promotionsState.isLoading && !promotionsState.hasError && (
        <Spin indicator={indicator} style={styles.spinner} />
      )}
      {!promotionsState.isLoading &&
        !promotionsState.hasError &&
        promotionsToDisplay.map((promotion) => (
          <PromotionCard
            key={promotion.id}
            id={promotion.id}
            boldDescription={promotion.boldDescription}
            boldName={promotion.boldName}
            dateAdded={promotion.dateAdded}
            expirationDate={promotion.expirationDate}
            description={promotion.description}
            image={promotion.image}
            isSavedByUser={promotion.isSavedByUser}
            name={promotion.name}
            placeId={promotion.restaurant.id}
            // TODO: https://promopal.atlassian.net/browse/PP-96
            restaurantName=""
            schedules={promotion.schedules}
            onSaveButtonClick={() => onSaveButtonClick(promotion.id)}
            onCardClick={() => onClickHandler(promotion.restaurant)}
          />
        ))}
      {!promotionsState.isLoading && !promotionsState.hasError && (
        <Pagination
          size="small"
          defaultCurrent={1}
          current={props.pageNum}
          onChange={onPageChange}
          total={promotions.length}
        />
      )}
    </div>
  );
}
