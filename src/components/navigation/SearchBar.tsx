import { Input } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

const { Search } = Input;

const styles: { [identifier: string]: CSSProperties } = {
  search: {
    width: '40%',
  },
};

export default function SearchBar(): ReactElement {
  const onSearch = (value: string) => alert(value);

  return <Search placeholder="Search..." onSearch={onSearch} style={styles.search} />;
}
