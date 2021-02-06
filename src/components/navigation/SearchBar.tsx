import React, { CSSProperties, ReactElement, useCallback } from 'react';
import { Input } from 'antd';
import { DispatchAction, usePromotionsList } from '../../contexts/PromotionsListContext';

const { Search } = Input;

const styles: { [identifier: string]: CSSProperties } = {
  search: {
    width: '40%',
    marginLeft: 'auto',
    marginRight: '1%',
  },
};

export default function SearchBar(): ReactElement {
  const { dispatch } = usePromotionsList();

  const onSearch = useCallback(
    (searchQuery: string) => {
      dispatch({
        type: DispatchAction.SEARCH_QUERY,
        payload: { searchQuery },
      });
    },
    [dispatch]
  );

  return <Search placeholder="Search..." onSearch={onSearch} style={styles.search} />;
}
