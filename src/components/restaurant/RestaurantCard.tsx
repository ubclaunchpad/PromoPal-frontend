import { Place } from '@googlemaps/google-maps-services-js';
import { Col } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

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

export default function RestaurantCard(restaurant: Place): ReactElement {
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
          // cuisine={
          //   'Italian'
          //   // todo: this should use a promotions cuisine https://promopal.atlassian.net/browse/PP-91
          //   // restaurant.cuisine
          // }
          // distance={
          //   1500
          //   // // todo: where is this coming from?
          //   // restaurant.distance
          // }
          price_level={restaurant.price_level}
          name={restaurant.name}
          rating={restaurant.rating}
          website={restaurant.website}
        />
        <Body
          formatted_address={restaurant.formatted_address}
          opening_hours={restaurant.opening_hours}
          formatted_phone_number={restaurant.formatted_phone_number}
        />
      </Col>
    </div>
  );
}
