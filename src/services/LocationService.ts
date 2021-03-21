// Types taken from the w3c Geolocation API: https://w3c.github.io/geolocation-api/#geolocation_interface

export interface GeolocationCoordinates {
  accuracy?: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  latitude: number;
  longitude: number;
  speed?: number | null;
}

export interface GeolocationPosition {
  coords: GeolocationCoordinates;
  timestamp: number;
}

// Reference for code values: https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError/code
export interface GeolocationPositionError {
  code: number;
  message: string;
}

export type LatLng = google.maps.LatLng;

abstract class LocationService<LocationType> {
  /**
   * Default coordinates is in downtown Vancouver
   */
  public defaultCoordinates = { latitude: 49.282, longitude: -123.1171 };

  /**
   * Should return the default location as the proper type.
   */
  public abstract get defaultLocation(): LocationType;

  /**
   * Should return the user's current location or time out after 3s.
   */
  public abstract getCurrentLocation(): Promise<LocationType>;
}

class GeolocationPositionService extends LocationService<GeolocationPosition> {
  /**
   * Returns the default location as a GeolocationPosition.
   */
  public get defaultLocation(): GeolocationPosition {
    return {
      coords: this.defaultCoordinates,
      timestamp: Date.now(),
    };
  }

  /**
   * Retrieves the user's current location using navigator.geolocation.
   * Times out and calls the error callback after 3s.
   */
  public async getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        const onSuccess = (position: GeolocationPosition) => resolve(position);
        const onError = (error: GeolocationPositionError) => reject(error);
        navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 3000 });
      } else {
        resolve(this.defaultLocation);
      }
    });
  }
}

class LatLngService extends LocationService<LatLng> {
  /**
   * Returns the default location as a google.maps.LatLng object.
   */
  public get defaultLocation(): LatLng {
    const { latitude, longitude } = this.defaultCoordinates;
    return new google.maps.LatLng(latitude, longitude);
  }

  /**
   * Computes the geographical distance between the origin and the destination parameters in metres.
   *
   * @param origin - The starting point
   * @param destination - The ending point
   */
  public computeDistanceBetween(origin: LatLng, destination: LatLng): number {
    return google.maps.geometry.spherical.computeDistanceBetween(origin, destination);
  }

  /**
   * Retrieves the user's current location using navigator.geolocation.
   * Times out and calls the error callback after 3s.
   */
  public async getCurrentLocation(): Promise<LatLng> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        const onSuccess = (position: GeolocationPosition) => {
          const {
            coords: { latitude, longitude },
          } = position;
          return resolve(new google.maps.LatLng(latitude, longitude));
        };
        const onError = (error: GeolocationPositionError) => reject(error);
        navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 3000 });
      } else {
        resolve(this.defaultLocation);
      }
    });
  }
}

export default {
  GeolocationPosition: new GeolocationPositionService(),
  LatLng: new LatLngService(),
};
