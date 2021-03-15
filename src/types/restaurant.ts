export type Restaurant = {
  cuisine: string;
  distance: number;
} & RestaurantDetails;

export interface RestaurantDetails {
  address: string;
  business_status: string;
  lat: number;
  lon: number;
  mapUrl: string;
  name: string;
  openingHours: Record<string, unknown>;
  phoneNumber: string;
  photos: Record<string, unknown>[];
  priceLevel: string;
  rating: number;
  reviews: Record<string, unknown>[];
  totalRating: number;
  website: string;
}
