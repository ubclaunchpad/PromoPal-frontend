import React, { ReactElement, useEffect } from 'react';

import GooglePlacesApiLoaderService from '../services/GoogleMapsApiLoaderService';

const locations: google.maps.LatLngLiteral[] = [
  { lat: 49.246213, lng: -123.1691 },
  { lat: 49.25114, lng: -123.17152 },
  { lat: 49.263234, lng: -123.1619 },
  { lat: 49.25813, lng: -123.17712 },
  { lat: 49.255212, lng: -123.18212 },
];

function mapCenter(locations: google.maps.LatLngLiteral[]) {
  const avg = (arr: number[]) => arr.reduce((acc, num) => acc + num, 0) / arr.length;
  return {
    lat: avg(locations.map(({ lat }) => lat)),
    lng: avg(locations.map(({ lng }) => lng)),
  };
}

function MapContainer({
  dimensions,
}: {
  dimensions: { width: string; height: string };
}): ReactElement {
  /**
   * Loads the map and markers on initial render.
   */
  useEffect(() => {
    const options = {
      center: mapCenter(locations),
      zoom: 15,
    };
    const map = GooglePlacesApiLoaderService.initializeMap(options);
    locations.map((position) => new google.maps.Marker({ position, map }));
  }, []);

  return <div id="map-container" style={dimensions}></div>;
}

export default MapContainer;
