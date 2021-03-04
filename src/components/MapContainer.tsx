import React, { ReactElement, useCallback, useEffect, useRef } from 'react';

import { usePromotionsList } from '../contexts/PromotionsListContext';
import {
  DispatchAction as RestaurantDispatch,
  useRestaurantCard,
} from '../contexts/RestaurantCardContext';
import GooglePlacesApiLoaderService from '../services/GoogleMapsApiLoaderService';
import LocationService, { GeolocationPosition } from '../services/LocationService';
import { getRestaurant } from '../services/PromotionService';
import { Restaurant } from '../types/restaurant';

function MapContainer({
  dimensions,
}: {
  dimensions: { width: string; height: string };
}): ReactElement {
  const mapElement = useRef<HTMLDivElement | null>(null);

  const { state: promotionsState } = usePromotionsList();
  const { dispatch: restaurantDispatch } = useRestaurantCard();

  /**
   * If the given map is initialized, displays a marker on the map for each promotion in the promotions list.
   */
  const initializeMarkers = useCallback(
    (map: google.maps.Map | null) => {
      const onClickHandler = (placeId: string) => {
        getRestaurant(placeId)
          .then((restaurant: Restaurant) => {
            restaurantDispatch({
              type: RestaurantDispatch.TOGGLE_CARD,
              payload: { placeId, restaurant },
            });
          })
          .catch(() => restaurantDispatch({ type: RestaurantDispatch.HIDE_CARD }));
      };

      if (map) {
        promotionsState.data.forEach(({ lat, lon, placeId }) => {
          const position = { lat, lng: lon };
          const marker = new google.maps.Marker({ position, map });
          marker.addListener('click', () => onClickHandler(placeId));
        });
      }
    },
    [promotionsState.data, restaurantDispatch]
  );

  /**
   * Creates the map and initializes the markers.
   */
  const createMap = useCallback(
    (userLocation: google.maps.LatLngLiteral) => {
      const options = { center: userLocation, zoom: 15 };
      const map = GooglePlacesApiLoaderService.initializeMap(mapElement.current, options);
      initializeMarkers(map);
    },
    [initializeMarkers]
  );

  /**
   * On initial render:
   * - Creates the map instance centered at the user's location or downtown Vancouver (49.282, -123.1171)
   *   if the user's location cannot be found by the browser
   * - Creates and displays the markers for all promotions listed
   */
  useEffect(() => {
    LocationService.getCurrentLocation()
      .then(({ coords: { latitude, longitude } }: GeolocationPosition) => {
        createMap({ lat: latitude, lng: longitude });
      })
      .catch(() => {
        const {
          defaultLocation: {
            coords: { latitude, longitude },
          },
        } = LocationService;
        createMap({ lat: latitude, lng: longitude });
      });
  }, [createMap]);

  return <div id="map-container" style={dimensions} ref={mapElement}></div>;
}

export default MapContainer;
