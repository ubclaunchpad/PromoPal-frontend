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

class LocationService {
  /**
   * Default location is downtown Vancouver
   */
  public get defaultLocation(): GeolocationPosition {
    return {
      coords: { latitude: 49.282, longitude: -123.1171 },
      timestamp: Date.now(),
    };
  }

  /**
   * Retrieves the user's current location using navigator.geolocation.
   * Times out and calls the error callback after 3s.
   */
  public getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        const onSuccess = (position: GeolocationPosition) => resolve(position);
        const onError = (error: GeolocationPositionError) => reject(error);
        const options = { timeout: 3000 };
        navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
      } else {
        resolve(this.defaultLocation);
      }
    });
  }
}

export default new LocationService();
