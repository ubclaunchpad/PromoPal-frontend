export enum Sort {
  Default = 'DEFAULT',
  Distance = 'DISTANCE',
  MostPopular = 'MOST_POPULAR',
  MostRecent = 'MOST_RECENT',
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
  lat: number;
  lon: number;
  liked: boolean;
  name: string;
  promotionType: string;
  restaurantName: string;
  schedules: Schedule[];
  user: User;
  votes: number;
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

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
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

export interface FilterOptions {
  cuisine: Array<Promotion['cuisine']>;
  dayOfWeek: Array<Schedule['dayOfWeek']>;
  discountType: Discount['discountType'];
  promotionType: Array<Promotion['promotionType']>;
}

type Day = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
