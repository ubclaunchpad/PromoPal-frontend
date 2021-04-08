export default {
  DISCOUNTS: '/discounts',
  ENUMS: {
    CUISINE_TYPES: '/enums/CuisineType',
    DAYS_OF_WEEK: '/enums/Day',
    DISCOUNT_TYPES: '/enums/DiscountType',
    PROMOTION_TYPES: '/enums/PromotionType',
  },
  PROMOTIONS: {
    GET: (userId?: string): string => {
      if (userId) return `/promotions/?userId=${userId}`;
      return '/promotions';
    },
    DELETE: (promotionId: string): string => `/promotions/${promotionId}`,
    POST: '/promotions',
  },
  SAVED_PROMOTIONS: 'saved_promotions',
  SCHEDULES: '/schedules',
  USERS: {
    GET_BY_FIREBASE_ID: (firebaseId: string): string => `/users/firebase/${firebaseId}`,
    SAVE_PROMOTION: (userId: string, promotionId: string): string =>
      `/users/${userId}/savedPromotions/${promotionId}`,
    UNSAVE_PROMOTION: (userId: string, promotionId: string): string =>
      `/users/${userId}/savedPromotions/${promotionId}`,
    UPDATE: (userId: string): string => `/users/${userId}`,
    UPLOADED_PROMOTIONS: (userId: string): string => `/users/${userId}/uploadedPromotions`,
    POST: '/users',
  },
  RESTAURANTS: {
    RESTAURANT_DETAILS: (id: string): string => `/restaurants/${id}/restaurantDetails`,
    RESTAURANT_PROMOTIONS: (id: string): string => `/restaurants/${id}/promotions`,
  },
};
