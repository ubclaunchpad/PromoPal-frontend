import { User } from './user';

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
  isSavedByUser: boolean;
  lat: number;
  lon: number;
  name: string;
  promotionType: string;
  restaurant: Restaurant;
  schedules: Schedule[];
  user: User;
  boldDescription?: string;
  boldName?: string;
  rank?: number;
}

export interface PromotionDTO {
  cuisine?: Promotion['cuisine'] | Array<Promotion['cuisine']>;
  dayOfWeek?: Schedule['dayOfWeek'];
  discountType?: Discount['discountType'];
  discountValue?: Discount['discountValue'];
  expirationDate?: Promotion['expirationDate'];
  promotionType?: Promotion['promotionType'];
  searchQuery?: string;
}

export interface Discount {
  id: string;
  discountValue: number;
  discountType: string;
}

export interface PromotionImage {
  src: string;
}

export interface Schedule {
  id: string;
  dayOfWeek: Day;
  endTime: string;
  startTime: string;
  isRecurring: boolean;
}

export interface Restaurant {
  id: string;
  placeId: string;
  lat: number;
  lon: number;
}

export interface FilterOptions {
  cuisine: Array<Promotion['cuisine']>;
  dayOfWeek: Array<Schedule['dayOfWeek']>;
  discountType: Discount['discountType'];
  promotionType: Array<Promotion['promotionType']>;
}

const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
export type Day = typeof DAY[number];
