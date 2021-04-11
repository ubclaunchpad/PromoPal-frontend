import './SearchBar.less';

import { Input } from 'antd';
import React, { ReactElement, useCallback } from 'react';

import { useDropdown } from '../../contexts/DropdownContext';
import { DispatchAction, usePromotionsList } from '../../contexts/PromotionsListContext';

const { Search } = Input;

export default function SearchBar(): ReactElement {
  const { state: dropdownState } = useDropdown();
  const { dispatch: promotionsDispatch } = usePromotionsList();

  const onSearch = useCallback(
    (searchQuery: string) => {
      // Reset filters: user cannot be filtering and using a search query simultaneously
      promotionsDispatch({ type: DispatchAction.RESET_FILTERS });
      dropdownState.resetCallbacks.forEach((resetDropdown) => resetDropdown());

      // Send search query
      promotionsDispatch({
        type: DispatchAction.SEARCH_QUERY,
        payload: { searchQuery },
      });
    },
    [dropdownState.resetCallbacks, promotionsDispatch]
  );

  return (
    <Search
      placeholder="Search by dish, cuisine, or location..."
      onSearch={onSearch}
      className="search-bar"
    />
  );
}
