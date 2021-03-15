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
    width: 350,
    zIndex: 10,
  },
  container: {
    display: 'flex',
    flexFlow: 'column',
    marginTop: 60,
    position: 'fixed',
    width: '100%',
    zIndex: 10,
  },
};

export default function RestaurantCard(restaurant: Restaurant): ReactElement {
  const containerPadding = '15px';

  return (
    <div style={styles.container}>
      <Col
        style={{
          ...styles.card,
          left: `calc(65% - ${containerPadding} - ${styles.card.width}px)`,
        }}
      >
        <Header
          cuisine={restaurant.cuisine}
          distance={restaurant.distance}
          priceLevel={restaurant.priceLevel}
          name={restaurant.name}
          rating={restaurant.rating}
          website={restaurant.website}
        />
        <Body
          address={restaurant.address}
          openingHours={restaurant.openingHours}
          phoneNumber={restaurant.phoneNumber}
        />
      </Col>
    </div>
  );
}
