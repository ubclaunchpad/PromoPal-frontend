import React, { ReactElement, useEffect, useState } from 'react';

import DropdownMenu from '../components/DropdownMenu';
import MapContainer from '../components/MapContainer';
import PromotionList from '../components/PromotionList';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import { DispatchAction, usePromotionsList } from '../contexts/PromotionsListContext';
import { useRestaurantCard } from '../contexts/RestaurantCardContext';
import EnumService from '../services/EnumService';
import { Dropdown, DropdownType } from '../types/dropdown';
import { Sort } from '../types/promotion';

const mapWidth = 65;

export default function Home(): ReactElement {
  const [height, setHeight] = useState<string>('');

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
              payload: { sort: Sort.MostPopular },
            }),
          text: 'Most Popular',
          description: 'Deals with the most number of saves from other users.',
        },
        {
          action: () =>
            dispatch({
              type: DispatchAction.SORT,
              payload: { sort: Sort.Rating },
            }),
          text: 'Rating',
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
      text: 'Day of Week',
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

  useEffect(() => {
    // Note: the following is not considered best practice, but it is used to calculate the height
    // of the header + dropdown so that we can use it as an offset
    const headerHeight = document.getElementById('navigation-header')?.offsetHeight;
    const dropdownMenuHeight = document.getElementById('dropdown-menu')?.offsetHeight;
    setHeight(`calc(100vh - ${headerHeight}px - ${dropdownMenuHeight}px)`);
  }, []);

  return (
    <>
      <DropdownMenu dropdowns={dropdowns} shadow />
      <div id="content-container" style={{ display: 'inline-flex', height, position: 'relative' }}>
        {restaurantCardState.showCard && <RestaurantCard {...restaurantCardState.restaurant} />}
        <MapContainer dimensions={{ width: `${mapWidth}vw`, height }} />
        <PromotionList dimensions={{ width: `${100 - mapWidth}vw`, height }} />
      </div>
    </>
  );
}
