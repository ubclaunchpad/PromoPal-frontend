export default {
  DISCOUNTS: '/discounts',
  ENUMS: {
    CUISINE_TYPES: '/enums/CuisineType',
    DAYS_OF_WEEK: '/enums/Day',
    DISCOUNT_TYPES: '/enums/DiscountType',
    PROMOTION_TYPES: '/enums/PromotionType',
  },
  PROMOTIONS: '/promotions',
  SAVED_PROMOTIONS: '/saved_promotions',
  SCHEDULES: '/schedules',
  USERS: {
    UPLOADED_PROMOTIONS: (id: string): string => `/users/${id}/uploadedPromotions`,
  },
};
