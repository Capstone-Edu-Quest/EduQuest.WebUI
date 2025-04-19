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
  assignCourseToExpert: 'course/assign',
  approveCourse: 'course/approve',
  getCourseByStatus: 'course/status',
  submitCourse: 'course/submitCourse',

  material: 'material',
  getMaterialDetails: 'material/materialById',
  uploadVideo: 'material/uploadVideo',
  uploadImage: 'material/uploadImage',

  coupon: 'coupon',
  couponLearner: 'coupon/learner',

  searchCertificate: 'certificate/filter',
  certificate: 'certificate',

  favoriteList: 'favoriteList',

  review: 'feedback',

  learningPath: 'learningPath',
  myLearningPath: 'learningPath/my',
  duplicateLearningPath: 'learningPath/dup',
  learningPathDetails: 'learningPath/detail',
  publicLearningPath: 'learningPath/public',
  enrollLearningPath: 'learningPath/enroll',

  level: 'level',
  getLevel: 'level/filter',

  getAllUser: 'user/all',
  getMyInfo: 'user/me',
  switchRole: 'user/switch',
  user: 'user',
  getProfile: 'user/profile',
  getUserByRoleId: 'user/byRoleId',

  userMetaStreak: 'userMeta/streak',
  userProgress: 'userMeta/userProgress',

  tag: 'tag',
  searchTag: 'tag/filter',

  subscription: 'subcription',

  webUserStatistic: 'webStatistic/user',
  webOverallStatistic: 'webStatistic/overall',
  platformSettingStatistic: 'webStatistic/platform/setting',
  adminHome: 'webStatistic/admin/home',

  shopitem: 'shopItem',
  filterShopItem: 'shopItem/filter',
  equipItem: 'mascot/equip',
  purchaseItem: 'mascot/purchase',

  quest: 'quest',
  getQuestOfUser: 'quest/user',
  rewardQuest: 'quest/learner/claim',

  checkout: 'payment/checkout',
  refund: 'payment/refund',

  submitQuiz: 'course/quiz/attemt',
  submitAssignment: 'course/assignment/attemt',
  getAssignment: 'course/assignment/attempt',

  transactionDetails: 'transaction/transactionDetail',
  transactions: 'transaction/filter',

  applyInstructor: 'user/becomeInstructor',
  approveInstructor: 'user/approveInstructor',
  getUserByStatus: 'user/status'
};
