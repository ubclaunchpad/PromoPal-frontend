export default {
  DISCOUNTS: '/discounts',
  ENUMS: {
    CUISINE_TYPES: '/enums/CuisineType',
    DAYS_OF_WEEK: '/enums/Day',
    DISCOUNT_TYPES: '/enums/DiscountType',
    PROMOTION_TYPES: 'enums/PromotionType',
  },
  PROMOTIONS: '/promotions',
  SAVED_PROMOTIONS: 'saved_promotions',
  SCHEDULES: 'schedules',
  USERS: {
    GET: (userId: string): string => `/users/${userId}`,
    UPDATE: (userId: string): string => `/users/${userId}`,
    UPLOADED_PROMOTIONS: (userId: string): string => `/users/${userId}/uploadedPromotions`,
  },
};
