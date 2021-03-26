import { RestaurantDetails } from './restaurant';

export enum Sort {
  Default = 'DEFAULT',
  Distance = 'DISTANCE',
  MostPopular = 'MOST_POPULAR',
  Rating = 'RATING',
}

export interface Promotion {
  id: string;
  category: string;
  cuisine: string;
  dateAdded: string;
  description: string;
  discount: Discount;
  expirationDate: string;
  image: PromotionImage;
  lat: number;
  lon: number;
  liked: boolean;
  name: string;
  placeId: string;
  promotionType: string;
  restaurant: RestaurantDetails;
  restaurantName: string;
  schedules: Schedule[];
  user: User;
  boldDescription?: string;
  boldName?: string;
  rank?: number;
}

export interface GetPromotionDTO {
  cuisine?: Promotion['cuisine'] | Array<Promotion['cuisine']>;
  dayOfWeek?: Schedule['dayOfWeek'];
  discountType?: Discount['discountType'];
  discountValue?: Discount['discountValue'];
  expirationDate?: Promotion['expirationDate'];
  promotionType?: Promotion['promotionType'];
  searchQuery?: string;
}

export interface PostPromotionDTO {
  cuisine: Promotion['cuisine'];
  description: Promotion['description'];
  discount: Promotion['discount'];
  expirationDate: Promotion['expirationDate'];
  placeId: Promotion['placeId'];
  name: Promotion['name'];
  promotionType: Promotion['promotionType'];
  restaurantAddress: RestaurantDetails['address'];
  schedules: Promotion['schedules'];
  startDate: string;
  userId: User['id'];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
}

export interface Discount {
  discountValue: number;
  discountType: string;
}

export interface PromotionImage {
  src: string;
}

export interface Schedule {
  dayOfWeek: Day;
  endTime: string;
  startTime: string;
  isRecurring: boolean;
}

export interface FilterOptions {
  cuisine: Array<Promotion['cuisine']>;
  dayOfWeek: Array<Schedule['dayOfWeek']>;
  discountType: Discount['discountType'];
  promotionType: Array<Promotion['promotionType']>;
}

const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
export type Day = typeof DAY[number];
