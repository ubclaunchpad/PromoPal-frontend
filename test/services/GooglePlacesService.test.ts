import { AxiosError } from 'axios';
import * as dotenv from 'dotenv';

import { GooglePlacesService } from '../../src/services/GooglePlacesService';
import { RestaurantDetails } from '../../src/types/RestaurantDetails';
import { RestaurantInfo } from '../../src/types/RestaurantInfo';

/* eslint-disable  @typescript-eslint/no-unused-vars */
describe('Unit tests for GooglePlacesService', function () {
  const googlePlacesAPI = new GooglePlacesService();
  const invalidPlaceID = 'ChIJ2fF6zviX9YgRflKEZNrpLrQ';
  const validPlaceID = 'ChIJb0n5cWl3hlQRIbVGYLiTEgE';

  dotenv.config();

  test('Search for a place using restaurant name and location, should be successful', () => {
    return googlePlacesAPI
      .getRestaurantInfo('Jinya', 'Robson St')
      .then((result: RestaurantInfo) => {
        expect(result).toEqual({
          placeID: 'ChIJ4dRcUH5xhlQREcvYYxzhqv0',
          lat: 49.2803152,
          lon: -123.1179336,
        });
      })
      .catch((error: AxiosError) => {
        fail('Did not expect to fail: ' + error.message);
      });
  });

  test('Search for a restaurant franchises/similar restaurants using name and location, should be successful', () => {
    return googlePlacesAPI
      .getRestaurantInfo('SURA', 'Robson St')
      .then((result: RestaurantInfo) => {
        expect(result).toEqual({
          placeID: 'ChIJcw7-mYdxhlQRxq9ZD4tvuH0',
          lat: 49.288871,
          lon: -123.131738,
        });
      })
      .catch((error: AxiosError) => {
        fail('Did not expect to fail: ' + error.message);
      });
  });

  test('Get details for a place using valid placeID, should be successful', () => {
    // placeID can only be retrieved from getRestaurantInfo
    return googlePlacesAPI
      .getRestaurantDetails(validPlaceID)
      .then((result: RestaurantDetails) => {
        expect(result).toHaveProperty('business_status');
        expect(result).toHaveProperty('address');
        expect(result).toHaveProperty('phone_number');
        expect(result).toHaveProperty('lat');
        expect(result).toHaveProperty('lon');
        expect(result).toHaveProperty('name', 'RIB & CHICKEN');
        expect(result).toHaveProperty('opening_hours');
        expect(result).toHaveProperty('photos');
        expect(result).toHaveProperty('rating');
        expect(result).toHaveProperty('reviews');
        expect(result).toHaveProperty('map_url', 'https://maps.google.com/?cid=77286563717231905');
        expect(result).toHaveProperty('website', 'https://www.ribandchicken.ca/');
      })
      .catch((error: AxiosError) => {
        fail('Did not expect to fail: ' + error.message);
      });
  });

  test('Get details for a place using invalid placeID, should be unsuccessful', () => {
    return googlePlacesAPI
      .getRestaurantDetails(invalidPlaceID)
      .then((result: RestaurantDetails) => {
        fail('Did not expect to pass: ' + result);
      })
      .catch((error: AxiosError) => {
        expect(error.message).toEqual('NOT_FOUND ERROR FOR ' + invalidPlaceID);
      });
  });

  test('Get photo for a place using photoReference, should be successful', () => {
    // photoReference can only be retrieved from getGooglePlacesDetails or getGooglePlacesSearch
    const photoReference =
      'CmRaAAAAG0iboUiJEm5FgUDCJcrSzqQ7NIqks4WRG-fOqExf1Wy8BvNf57uOfoJttukezQH8Fo' +
      'Fp6xBo4HT07PqyBZGaSnv-zRakWaRpmm97BFKjlfigEHAOyXoHAKVharhRbkdKEhBt04bdMwjdPIABAINFpDuuGhQdc1q' +
      'P733fSMvzjtPByT9ETO-71Q';
    return googlePlacesAPI
      .getRestaurantPhoto(photoReference)
      .then((result: HTMLImageElement) => {
        // todo: need some assertions
      })
      .catch((error: AxiosError) => {
        fail('Did not expect to fail: ' + error.message);
      });
  });
});
