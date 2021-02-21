import React, { ReactElement, useEffect, useRef } from 'react';

import { usePromotionsList } from '../contexts/PromotionsListContext';
import GooglePlacesApiLoaderService from '../services/GoogleMapsApiLoaderService';
import LocationService, { GeolocationPosition } from '../services/LocationService';

function MapContainer({
  dimensions,
}: {
  dimensions: { width: string; height: string };
}): ReactElement {
  const mapElement = useRef<HTMLDivElement | null>(null);

  const { state } = usePromotionsList();

  /**
   * On initial render:
   * - Creates the map instance centered at the user's location or downtown Vancouver (49.282, -123.1171)
   *   if the user's location cannot be found by the browser
   * - Creates and displays the markers for all promotions listed
   */
  useEffect(() => {
    function createMap(userLocation: google.maps.LatLngLiteral) {
      const options = { center: userLocation, zoom: 15 };
      const map = GooglePlacesApiLoaderService.initializeMap(mapElement.current, options);
      if (map) {
        const markerPositions = state.data.map(({ lat, lon: lng }) => ({ lat, lng }));
        markerPositions.map((position) => new google.maps.Marker({ position, map }));
      }
    }

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
  }, [state.data]);

  return <div id="map-container" style={dimensions} ref={mapElement}></div>;
}

export default MapContainer;
