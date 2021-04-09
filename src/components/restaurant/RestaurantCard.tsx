import './RestaurantCard.css';

import { CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { OpeningHours, PlacePhoto } from '@googlemaps/google-maps-services-js';
import { Col, Row, Spin } from 'antd';
import React, { CSSProperties, ReactElement, useEffect, useState } from 'react';

import { DispatchAction, useRestaurantCard } from '../../contexts/RestaurantCardContext';
import LocationService, { LatLng } from '../../services/LocationService';
import Body from './card/Body';
import Header from './card/Header';

interface Props {
  formattedAddress: string | undefined;
  formattedPhoneNumber: string | undefined;
  isNotFound: boolean;
  latitude: number;
  longitude: number;
  openingHours: OpeningHours | undefined;
  photos: PlacePhoto[] | undefined;
  priceLevel: number | undefined;
  name: string | undefined;
  rating: number | undefined;
  restaurantId: string;
  website: string | undefined;
}

const styles: { [identifier: string]: CSSProperties } = {
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

export default function RestaurantCard(props: Props): ReactElement {
  const [distance, setDistance] = useState<number>(0);

  const { state: restaurantCardState, dispatch } = useRestaurantCard();

  const containerPadding = '15px';

  /**
   * Calculates the distance of the restaurant from the user's current location.
   */
  useEffect(() => {
    getRestaurantDistance(props.latitude, props.longitude)
      .then((distance) => setDistance(distance))
      .catch(() => setDistance(0));
  }, [props.latitude, props.longitude]);

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

  const restaurantNotFoundCard = (): ReactElement => {
    return (
      <Row className="restaurant-card-header-component">
        <Col span={22}>
          <h2 className="restaurant-card-title restaurant-card-title-empty">
            Sorry, this restaurant could not be found!
          </h2>
        </Col>
        <Col span={2}>
          <CloseCircleOutlined
            className="close-card"
            onClick={() => dispatch({ type: DispatchAction.HIDE_CARD })}
          />
        </Col>
      </Row>
    );
  };

  const restaurantCard = (): ReactElement => {
    return (
      <>
        <Row className="restaurant-card-header-component">
          <Col span={22}>
            <h2 className="restaurant-card-title">{props.name}</h2>
          </Col>
          <Col span={2}>
            <CloseCircleOutlined
              className="close-card"
              onClick={() => dispatch({ type: DispatchAction.HIDE_CARD })}
            />
          </Col>
        </Row>
        <Header
          // cuisine={
          //   'Italian'
          //   // todo: this should use a promotions cuisine https://promopal.atlassian.net/browse/PP-91
          //   // restaurant.cuisine
          // }
          distance={distance}
          priceLevel={props.priceLevel}
          name={props.name}
          rating={props.rating}
          website={props.website}
        />
        <Body
          formattedAddress={props.formattedAddress}
          openingHours={props.openingHours}
          restaurantId={props.restaurantId}
          formattedPhoneNumber={props.formattedPhoneNumber}
          photos={props.photos}
        />
      </>
    );
  };

  const indicator = <LoadingOutlined style={styles.spinnerIcon} spin />;

  return (
    <div className="restaurant-card-container">
      <Col className="restaurant-card" style={{ left: `calc(65% - ${containerPadding} - 350px)` }}>
        {restaurantCardState.isLoading && <Spin indicator={indicator} style={styles.spinner} />}
        {!restaurantCardState.isLoading &&
          (props.isNotFound ? restaurantNotFoundCard() : restaurantCard())}
      </Col>
    </div>
  );
}
