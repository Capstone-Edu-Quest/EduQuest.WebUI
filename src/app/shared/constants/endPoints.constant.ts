export const endPoints = {
  signin: 'auth/sign-in',
  signInPassword: 'auth/sign-in/password',
  validateOtp: 'auth/validate-otp',
  refresh: 'auth/refresh',
  changePassword: 'auth/change-password',
  resetPassword: 'auth/reset-password',
  signout: 'auth/sign-out',

  cart: 'cart',
  addToCart: 'cart/add-cartItem',

  course: 'course',
  searchCourse: 'course/searchCourse',
  getRecommendedCourse: 'course/recommendedCourse',
  getCourseById: 'course/byCourseId',
  getMyCourse: 'course/createdByMe',
  getStudyingCourse: 'course/studying',
  courseStatsOverview: 'course/courseStatisticOverview',
  courseDetaialsForInstructor: 'course/courseDetailForInstructor',

  material: 'material',

  coupon: 'coupon',

  searchCertificate: 'certiciate/filter',
  certificate: 'certificate',

  favoriteList: 'favoriteList',

  review: 'feedback',

  learningPath: 'learningPath',
  myLearningPath: 'learningPath/my',
  duplicateLearningPath: 'learningPath/dup',
  learningPathDetails: 'learningPath/detail',
  publicLearningPath: 'learningPath/public',

  level: 'level',
  getLevel: 'level/filter',

  getAllUser: 'user/all',
  getMyInfo: 'user/me',
  switchRole: 'user/switch',
  user: 'user',

  userMetaStreak: 'userMeta/streak',
  userMetaProgress: 'userMeta/userProgress',

  tag: 'tag',
  searchTag: 'tag/filter',

  subscription: 'subscription',

  webUserStatistic: 'webStatistic/user',
  webOverallStatistic: 'webStatistic/overall',

  shopitem: 'shopItem',
  equipItem: 'mascot/equip',
  purchaseItem: 'mascot/purchase',

  quest: 'quest',
  getQuestOfUser: 'quest/user',

  checkout: 'payment/checkout',
  refund: 'payment/refund',
};
