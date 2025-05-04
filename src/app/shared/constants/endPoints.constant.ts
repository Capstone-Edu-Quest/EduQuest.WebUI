export const endPoints = {
  signin: 'auth/sign-in',
  signInPassword: 'auth/sign-in/password',
  validateOtp: 'auth/validate-otp',
  refresh: 'auth/refresh',
  changePassword: 'auth/change-password',
  resetPassword: 'auth/reset-password',
  signout: 'auth/sign-out',
  signUp: 'auth/sign-up',
  optSignUp: 'auth/sign-up/validate',

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

  courseRevenue: 'revenue/courseRevenue',
  courseChartRevenue: 'revenue/chartRevenue',

  learnerOverview: 'course/learnerOverview',
  learnerDetails: 'course/learnerDetail',

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
  reEnrollLearningPath: 'learningPath/reEnroll',

  level: 'level',
  getLevel: 'level/filter',

  getAllUser: 'user/all',
  getMyInfo: 'user/me',
  switchRole: 'user/switch',
  user: 'user',
  getProfile: 'user/profile',
  getUserByRoleId: 'user/byRoleId',
  searchUser: 'user/search',
  updateStatus: 'user/status',

  userMetaStreak: 'userMeta/streak',
  userProgress: 'userMeta/userProgress',
  leaderboard: 'userMeta/leaderboard',

  tag: 'tag',
  searchTag: 'tag/filter',

  subscription: 'subcription',

  webUserStatistic: 'webStatistic/user',
  webOverallStatistic: 'webStatistic/overall',
  platformSettingStatistic: 'webStatistic/platform/setting',
  adminHome: 'webStatistic/admin/home',
  instructorHome: 'webStatistic/instructor/home',
  shopitem: 'shopItem',
  filterShopItem: 'shopItem/filter',
  equipItem: 'mascot/equip',
  purchaseItem: 'mascot/purchase',

  quest: 'quest',
  getQuestOfUser: 'quest/user',
  rewardQuest: 'quest/learner/claim',

  checkout: 'payment/checkout',
  refund: 'payment/refund',
  getConnectedPaymentAccount: 'payment/connectedAccount',
  createStripeAccount: 'payment/stripeExpress',

  instructorRevenueReport: 'revenue/revenueReport',

  submitQuiz: 'course/quiz/attemt',
  submitAssignment: 'course/assignment/attemt',
  getAssignment: 'course/assignment/attempt',
  getUnreviewAssignment: 'course/assignment/instructor/unreviewedAttempts',
  markAssigment: '/course/assignment/review',

  transactionDetails: 'transaction/transactionDetail',
  transactions: 'transaction/filter',

  applyInstructor: 'user/becomeInstructor',
  approveInstructor: 'user/approveInstructor',
  getUserByStatus: 'user/status',
  getMyInsApplicant: 'user/myInstructorApplication',
  cancelInstructorApplication: 'user/cancelInstructorApplication',
  assignInstructorToExpert: 'user/assignIntructorToExpert',
  instructorsListAssignedToMe: 'user/assignToExpert',
};
