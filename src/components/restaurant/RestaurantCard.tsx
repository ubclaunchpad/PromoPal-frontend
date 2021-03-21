import { OpeningHours } from '@googlemaps/google-maps-services-js';
import { Col } from 'antd';
import React, { CSSProperties, ReactElement, useEffect, useState } from 'react';

import LocationService, { LatLng } from '../../services/LocationService';
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

interface Props {
  latitude: number;
  longitude: number;

  formattedAddress?: string;
  formattedPhoneNumber?: string;
  openingHours?: OpeningHours;
  priceLevel?: number;
  name?: string;
  rating?: number;
  website?: string;
}

export default function RestaurantCard(props: Props): ReactElement {
  const [distance, setDistance] = useState<number>(0);

  const containerPadding = '15px';

  /**
   * On initial render, calculates the distance of the restaurant from the user's current location.
   */
  useEffect(() => {
    getRestaurantDistance(props.latitude, props.longitude)
      .then((distance) => setDistance(distance))
      .catch(() => setDistance(0));
  }, []);

  /**
   * Calculates the distance between the user's current location and the restaurant.
   */
  const getRestaurantDistance = async (latitude: number, longitude: number): Promise<number> => {
    return LocationService.LatLng.getCurrentLocation()
      .then((userLocation: LatLng) => {
        const restaurantLocation = new google.maps.LatLng(latitude, longitude);
        return LocationService.LatLng.computeDistanceBetween(userLocation, restaurantLocation);
      })
      .catch(() => {
        return 0;
      });
  };

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
          //   // todo: this should use a promotions cuisine, google place details doesn't have this
          //   // restaurant.cuisine
          // }
          distance={distance}
          priceLevel={props.priceLevel}
          name={props.name}
          rating={props.rating}
          website={props.website}
        />
        <Body
          formatted_address={props.formattedAddress}
          opening_hours={props.openingHours}
          formatted_phone_number={props.formattedPhoneNumber}
        />
      </Col>
    </div>
  );
}
