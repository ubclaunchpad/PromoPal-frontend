import axios, { AxiosError, AxiosResponse } from 'axios';

import { RestaurantDetails } from '../types/RestaurantDetails';
import { RestaurantInfo } from '../types/RestaurantInfo';

/* eslint-disable  @typescript-eslint/no-explicit-any */
class GooglePlacesService {
  // maintains a mapping of restaurant placeIDs with associated restaurant details (see types)
  private currRestaurants: Map<string, RestaurantDetails>;

  constructor() {
    this.currRestaurants = new Map();
  }

  // gets the placeID, lat and lon associated with restaurant
  // for restaurants with multiple locations, verified with string "includes" with user-inputted location
  public getRestaurantInfo(
    restaurantName: string,
    restaurantLocation: string
  ): Promise<RestaurantInfo> {
    const dataURI: string = encodeURIComponent(restaurantName);
    let responseData: any[];

    return axios
      .get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?', {
        params: {
          input: dataURI,
          inputtype: 'textquery',
          fields: 'place_id,formatted_address,geometry',
          key: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
        },
      })
      .then((response: AxiosResponse) => {
        responseData = response.data?.candidates;
        let matchingRestaurant;

        if (responseData.length === 1) {
          matchingRestaurant = responseData[0];
        } else {
          // handles situation where there are multiple restaurants with given restaurant name
          // todo: incorporate autocomplete feature - https://github.com/ubclaunchpad/foodies/issues/96
          for (const currPlace of responseData) {
            if (currPlace.formatted_address.includes(restaurantLocation)) {
              matchingRestaurant = currPlace;
              break;
            }
          }
        }

        if (matchingRestaurant) {
          const restaurant: RestaurantInfo = {
            placeID: matchingRestaurant.place_id,
            lat: matchingRestaurant.geometry?.location?.lat,
            lon: matchingRestaurant.geometry?.location?.lng,
          };
          return Promise.resolve(restaurant);
        }

        return Promise.reject('No restaurant location matched search');
      })
      .catch((err: AxiosError) => {
        return Promise.reject(err);
      });
  }

  // gets all restaurant details for certain placeID
  public getRestaurantDetails(
    placeID: string,
    handleNotFoundError?: (invalidPlaceID: string) => Promise<RestaurantDetails>
  ): Promise<RestaurantDetails> {
    // if mapping already contains this placeID, return value
    if (this.currRestaurants.has(placeID)) {
      const restaurantDetails = this.currRestaurants.get(placeID) as RestaurantDetails;
      return Promise.resolve(restaurantDetails);
    }

    return axios
      .get('https://maps.googleapis.com/maps/api/place/details/json?', {
        params: {
          place_id: placeID,
          fields:
            'url,formatted_phone_number,opening_hours,website,review,photos,business_status,' +
            'formatted_address,geometry,name,price_level,rating,user_ratings_total',
          key: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
        },
      })
      .then((response: AxiosResponse) => {
        const restaurantData = response?.data;
        const restaurantResults = restaurantData?.result;

        // check if placeID is valid
        if (restaurantData.status && restaurantData.status === 'NOT_FOUND') {
          return handleNotFoundError
            ? handleNotFoundError(placeID)
            : this.refreshPlaceIDAndGetDetails(placeID);
        }

        const restaurant = {
          name: restaurantResults.name,
          price_level: restaurantResults.price_level,
          rating: restaurantResults.rating,
          total_rating: restaurantResults.user_ratings_total,
          map_url: restaurantResults.url,
          phone_number: restaurantResults.formatted_phone_number,
          opening_hours: restaurantResults.opening_hours,
          website: restaurantResults.website,
          reviews: restaurantResults.reviews,
          photos: restaurantResults.photos,
          business_status: restaurantResults.business_status,
          address: restaurantResults.formatted_address,
          lat: restaurantResults.geometry?.location?.lat,
          lon: restaurantResults.geometry?.location?.lng,
        };

        this.currRestaurants.set(placeID, restaurant);
        return Promise.resolve(restaurant);
      })
      .catch((err: AxiosError) => {
        return Promise.reject(err);
      });
  }

  // refreshes the invalid placeID, may also result in NOT_FOUND error
  private refreshPlaceID(placeID: string): Promise<string> {
    return axios
      .get('https://maps.googleapis.com/maps/api/place/details/json?', {
        params: {
          place_id: placeID,
          fields: 'place_id',
          key: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
        },
      })
      .then((response: AxiosResponse) => {
        const data = response?.data;

        if (data.status && data.status === 'NOT_FOUND') {
          return Promise.reject(new Error('NOT_FOUND ERROR FOR ' + placeID));
        }

        const newPlaceID = data.result?.place_id;
        return Promise.resolve(newPlaceID);
      })
      .catch((err: AxiosError) => {
        return Promise.reject(err);
      });
  }

  // gets photos for certain placeID
  public getRestaurantPhoto(photoReference: string): Promise<HTMLImageElement> {
    return axios
      .get('https://maps.googleapis.com/maps/api/place/photo?', {
        params: {
          photoreference: photoReference,
          maxheight: 500, //todo: may need to adjust based on FE and restrictions
          key: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
        },
      })
      .then((response: AxiosResponse) => {
        const result: HTMLImageElement = response.data;
        return Promise.resolve(result);
      })
      .catch((err: AxiosError) => {
        return Promise.reject(err);
      });
  }

  // helper function used to refresh placeID and call getRestaurantDetails again for NOT_FOUND error
  private refreshPlaceIDAndGetDetails(placeID: string): Promise<RestaurantDetails> {
    return this.refreshPlaceID(placeID)
      .then((newPlaceID: string) => {
        const handleNotFoundError = (invalidPlaceID: string) => {
          return Promise.reject(new Error('NOT_FOUND ERROR FOR ' + invalidPlaceID));
        };
        return this.getRestaurantDetails(newPlaceID, handleNotFoundError);
      })
      .catch((err: AxiosError) => {
        return Promise.reject(err);
      });
  }
}

export { GooglePlacesService };
