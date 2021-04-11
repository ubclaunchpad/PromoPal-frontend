import React, { ReactElement, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import DropdownMenu from '../components/DropdownMenu';
import MapContainer from '../components/MapContainer';
import PromotionList from '../components/PromotionList';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import { DispatchAction, usePromotionsList } from '../contexts/PromotionsListContext';
import { useRestaurantCard } from '../contexts/RestaurantCardContext';
import EnumService from '../services/EnumService';
import { Dropdown, DropdownType } from '../types/dropdown';
import { Sort } from '../types/promotion';

/**
 * Gets the page number from the URL query params. Defaults to 1 if there is no `page` query param.
 *
 * @param location - The location object from `useLocation`
 */
function getPageNum(location: { search: string }): number {
  return parseInt(new URLSearchParams(location.search).get('page') || '1');
}

export default function Home(): ReactElement {
  const history = useHistory();
  const location = useLocation();

  const [pageNum, setPageNum] = useState<number>(getPageNum(location));

  const { dispatch } = usePromotionsList();
  const { state: restaurantCardState } = useRestaurantCard();

  /**
   * Callback functions when dropdown option is selected
   */
  const actions = {
    cuisine: (cuisine: string) =>
      dispatch({
        type: DispatchAction.UPDATE_FILTERS,
        payload: { filter: { cuisine } },
      }),
    dayOfWeek: (dayOfWeek: string) =>
      dispatch({
        type: DispatchAction.UPDATE_FILTERS,
        payload: { filter: { dayOfWeek } },
      }),
    discountType: (discountType: string) =>
      dispatch({
        type: DispatchAction.UPDATE_FILTERS,
        payload: { filter: { discountType } },
      }),
    promotionType: (promotionType: string) =>
      dispatch({
        type: DispatchAction.UPDATE_FILTERS,
        payload: { filter: { promotionType } },
      }),
  };

  const dropdowns: Dropdown[] = [
    {
      text: 'Sort',
      type: DropdownType.Radio,
      defaultValue: 'Distance',
      options: [
        {
          action: () =>
            dispatch({
              type: DispatchAction.SORT,
              payload: { sort: Sort.Distance },
            }),
          text: 'Distance',
          description: 'Closest deals to you.',
        },
        {
          action: () =>
            dispatch({
              type: DispatchAction.SORT,
              payload: { sort: Sort.Popularity },
            }),
          text: 'Most Popular',
          description: 'Deals with the most number of saves from other users.',
        },
        {
          action: () =>
            dispatch({
              type: DispatchAction.SORT,
              payload: { sort: Sort.Recency },
            }),
          text: 'Most Recent',
          description: 'Newest uploaded deals will be shown first.',
        },
      ],
    },
    {
      text: 'Discount Type',
      type: DropdownType.Radio,
      options: EnumService.discountTypes.map((discountType) => ({
        action: actions.discountType,
        text: discountType === 'Other' ? 'Other' : `${discountType} Off`,
      })),
    },
    {
      text: 'Cuisine',
      type: DropdownType.MultiSelect,
      options: EnumService.cuisineTypes.map((cuisine) => ({
        action: actions.cuisine,
        text: cuisine,
      })),
    },
    {
      text: 'Day of the Week',
      type: DropdownType.MultiSelect,
      options: EnumService.daysOfWeek.map((dayOfWeek) => ({
        action: actions.dayOfWeek,
        text: dayOfWeek,
      })),
    },
    {
      text: 'Promotion Type',
      type: DropdownType.MultiSelect,
      options: EnumService.promotionTypes.map((promotionType) => ({
        action: actions.promotionType,
        text: promotionType,
      })),
    },
  ];

  /**
   * On page number change, update the query params to include the page number.
   */
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    query.set('page', `${pageNum}`);
    history.push({ search: query.toString() });
  }, [history, location.search, pageNum]);

  const { restaurant } = restaurantCardState;

  return (
    <>
      <DropdownMenu dropdowns={dropdowns} shadow={true} location="home" />
      <div
        id="content-container"
        style={{ display: 'inline-flex', height: '100%', overflow: 'hidden', position: 'relative' }}
      >
        {restaurantCardState.showCard && (
          <RestaurantCard
            formattedAddress={restaurant.formatted_address}
            formattedPhoneNumber={restaurant.formatted_phone_number}
            isNotFound={Object.keys(restaurant).length === 0}
            latitude={restaurant.lat}
            longitude={restaurant.lon}
            openingHours={restaurant.opening_hours}
            photos={restaurant.photos}
            priceLevel={restaurant.price_level}
            name={restaurant.name}
            rating={restaurant.rating}
            restaurantId={restaurant.id}
            website={restaurant.website}
          />
        )}
        <MapContainer />
        <PromotionList pageNum={pageNum} onPageChange={setPageNum} />
      </div>
    </>
  );
}
