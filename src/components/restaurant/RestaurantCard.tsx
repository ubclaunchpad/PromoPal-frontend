import { Col } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

import { Restaurant } from '../../types/restaurant';
import Body from './card/Body';
import Header from './card/Header';

const styles: { [identifier: string]: CSSProperties } = {
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    boxShadow: '0 4px 4px 0 #40333333',
    padding: 0,
    position: 'absolute',
    width: 350,
    zIndex: 10,
  },
  container: {
    height: '100%',
    marginTop: 60,
    position: 'absolute',
    width: '100%',
  },
};

export default function RestaurantCard(restaurant: Restaurant): ReactElement {
  return (
    <div style={styles.container}>
      <Col
        style={{
          ...styles.card,
          left: `calc(70% - 15px - ${styles.card.width}px)`,
        }}
      >
        <Header {...restaurant} />
        <Body {...restaurant} />
      </Col>
    </div>
  );
}
