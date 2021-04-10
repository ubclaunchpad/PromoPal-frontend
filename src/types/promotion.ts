import { User } from './user';

export enum Sort {
  Default = 'Distance',
  Distance = 'Distance',
  Popularity = 'Popularity',
  Recency = 'Recency',
}

export enum VoteState {
  INIT = 0,
  UP = 1,
  DOWN = -1,
}

export interface Promotion {
  id: string;
  category: string;
  cuisine: string;
  dateAdded: string;
  description: string;
  discount: Discount;
  distance: number;
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
  votes: number;
  voteState: VoteState;
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
  placeId: Restaurant['id'];
  name: Promotion['name'];
  promotionType: Promotion['promotionType'];
  address: string;
  schedules: Promotion['schedules'];
  startDate: string;
  userId: User['id'];
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
