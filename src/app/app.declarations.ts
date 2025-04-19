import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import {
  AccountBookFill,
  AimOutline,
  AlertFill,
  AlertOutline,
  BellOutline,
  BookOutline,
  CheckCircleFill,
  CheckOutline,
  ClockCircleOutline,
  CloseCircleFill,
  CloseOutline,
  CommentOutline,
  CreditCardOutline,
  EditOutline,
  EnterOutline,
  ExclamationCircleOutline,
  FieldTimeOutline,
  FileExclamationOutline,
  FireOutline,
  FormatPainterOutline,
  GiftOutline,
  GlobalOutline,
  HeartFill,
  HeartOutline,
  HomeOutline,
  HourglassOutline,
  LeftOutline,
  LoginOutline,
  MessageOutline,
  NotificationOutline,
  PlayCircleOutline,
  RightOutline,
  SafetyCertificateOutline,
  SearchOutline,
  ShoppingCartOutline,
  StarOutline,
  ThunderboltOutline,
  TrophyOutline,
  UserOutline,
  WarningFill,
} from '@ant-design/icons-angular/icons';
import { HomeComponent } from './pages/home/home.component';
import { HomeStatisticsComponent } from './pages/home/home-leaner/home-statistics/home-statistics.component';
import { HomeStudyingComponent } from './pages/home/home-leaner/home-studying/home-studying.component';
import { CoursesCardComponent } from './components/courses-components/coursesCard/coursesCard.component';
import { DropdownMenuComponent } from './components/dropdownMenu/dropdownMenu.component';
import { BadgeComponent } from './components/badge/badge.component';
import { CoursesListComponent } from './components/courses-components/coursesList/coursesList.component';
import { ButtonComponent } from './components/button/button.component';
import { HomeSuggestedComponent } from './pages/home/home-leaner/home-suggested/home-suggested.component';
import { HomeAchievementsComponent } from './pages/home/home-leaner/home-achievements/home-achievements.component';
import { AchievementCardComponent } from './components/achievements/achievement-card/achievement-card.component';
import { AchievementsListComponent } from './components/achievements/achievements-list/achievements-list.component';
import { ModalComponent } from './components/modal/modal.component';
import { LanguageChangerComponent } from './components/language-changer/language-changer.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CoursesSearchPannelComponent } from './pages/courses/courses-search-pannel/courses-search-pannel.component';
import { CourseSearchItemComponent } from './pages/courses/course-search-item/course-search-item.component';
import { CheckboxGroupComponent } from './components/checkboxGroup/checkboxGroup.component';
import { CartComponent } from './pages/cart/cart.component';
import { CartItemComponent } from './pages/cart/cart-item/cart-item.component';
import { NavbarCartComponent } from './components/navbar/navbar-cart/navbar-cart.component';
import { MessageComponent } from './components/message/message.component';
import { WishlistCartComponent } from './components/navbar/wishlist-cart/wishlist-cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NavbarProfileComponent } from './components/navbar/navbar-profile/navbar-profile.component';
import { AvatarByNameComponent } from './components/avatar-by-name/avatar-by-name.component';
import { InstructorProfileComponent } from './pages/profile/instructor-profile/instructor-profile.component';
import { LearnerProfileComponent } from './pages/profile/learner-profile/learner-profile.component';
import { LeanerProfileInfoComponent } from './pages/profile/learner-profile/leaner-profile-info/leaner-profile-info.component';
import { LeanerAchievementsComponent } from './pages/profile/learner-profile/leaner-achievements/leaner-achievements.component';
import { LearningHeatmapComponent } from './pages/profile/learner-profile/learning-heatmap/learning-heatmap.component';
import { LeanerCoursesComponent } from './pages/profile/learner-profile/leaner-courses/leaner-courses.component';
import { HomeHeroComponent } from './pages/home/home-landing-page/home-hero/home-hero.component';
import { HomeTrendingCoursesComponent } from './pages/home/home-landing-page/home-trending-courses/home-trending-courses.component';
import { HomeWebNumericComponent } from './pages/home/home-landing-page/home-web-numeric/home-web-numeric.component';
import { HomeShowOffComponent } from './pages/home/home-landing-page/home-show-off/home-show-off.component';
import { HomeWhyChooseUsComponent } from './pages/home/home-landing-page/home-why-choose-us/home-why-choose-us.component';
import { UserService } from './core/services/user.service';
import { MessageService } from './core/services/message.service';
import { ThemeService } from './core/services/theme.service';
import { PriceService } from './core/services/price.service';
import { ModalService } from './core/services/modal.service';
import { ChatService } from './core/services/chat.service';
import { CartService } from './core/services/cart.service';
import { WishlistService } from './core/services/wishlist.service';
import { NotificationService } from './core/services/notification.service';
import { CouponService } from './core/services/coupon.service';
import { AuthGuard } from './core/guards/auth.guards';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';
import { CoursesService } from './core/services/courses.service';
import { CourseSectionComponent } from './pages/course-details/course-section/course-section.component';
import { NavbarNotiComponent } from './components/navbar/navbar-noti/navbar-noti.component';
import { FirebaseService } from './core/services/firebase.service';
import { NavbarChatComponent } from './components/navbar/navbar-chat/navbar-chat.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ConversationMessageComponent } from './pages/chat/conversation-message/conversation-message.component';
import { ConversationsListComponent } from './pages/chat/conversations-list/conversations-list.component';
import { AboutComponent } from './pages/about/about.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { Fox3dComponent } from './components/fox-3d/fox-3d.component';
import { FoxService } from './core/services/fox.service';
import { FoxItemsComponent } from './pages/fox-items/fox-items.component';
import { CourseStageComponent } from './pages/course-stage/course-stage.component';
import { LeaningPathComponent } from './pages/leaning-path/leaning-path.component';
import { LoadingService } from './core/services/loading.service';
import { LoadingComponent } from './components/loading/loading.component';
import { HttpService } from './core/services/http.service';
import { PathItemComponent } from './pages/leaning-path/path-item/path-item.component';
import { LearningPathDetailsComponent } from './pages/learning-path-details/learning-path-details.component';
import { PathCourseItemComponent } from './pages/learning-path-details/path-course-item/path-course-item.component';
import { ShopItemsComponent } from './pages/shop-items/shop-items.component';
import { HomeInstructorSummaryComponent } from './pages/home/home-instructor/home-instructor-summary/home-instructor-summary.component';
import { HomeInsOthersComponent } from './pages/home/home-instructor/home-ins-others/home-ins-others.component';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';
import { MyCourseChartsComponent } from './pages/my-courses/my-course-charts/my-course-charts.component';
import { MyCourseListComponent } from './pages/my-courses/my-course-list/my-course-list.component';
import { MyCourseItemComponent } from './pages/my-courses/my-course-list/my-course-item/my-course-item.component';
import { MyCourseAddComponent } from './pages/my-course-add/my-course-add.component';
import { MyCourseDetailsComponent } from './pages/my-course-details/my-course-details.component';
import { ImageService } from './core/services/image.service';
import { ManageStagesComponent } from './pages/my-course-add/manage-stages/manage-stages.component';
import { MaterialsComponent } from './pages/materials/materials.component';
import { MaterialsQuizComponent } from './pages/materials-group/materials-quiz/materials-quiz.component';
import { MaterialsVideoComponent } from './pages/materials-group/materials-video/materials-video.component';
import { MaterialsDocumentComponent } from './pages/materials-group/materials-document/materials-document.component';
import { MaterialsAssignmentComponent } from './pages/materials-group/materials-assignment/materials-assignment.component';
import { MyRevenueComponent } from './pages/my-revenue/my-revenue.component';
import { MyRevenueInfosComponent } from './pages/my-revenue/my-revenue-infos/my-revenue-infos.component';
import { MyRevenueCoursesBreakDownComponent } from './pages/my-revenue/my-revenue-courses-break-down/my-revenue-courses-break-down.component';
import { TableComponent } from './components/table/table.component';
import { MyRevenueTrendsComponent } from './pages/my-revenue/MyRevenueTrends/MyRevenueTrends.component';
import { CurrencyExchangePipe } from './core/pipes/currency.pipe';
import { VideoService } from './core/services/video.service';
import { CreateVideoComponent } from './pages/materials-group/materials-video/create-video/create-video.component';
import { VideoComponent } from './components/video/video.component';
import { SliderComponent } from './components/fox-3d/slider/slider.component';
import { CreateDocumentComponent } from './pages/materials-group/materials-document/create-document/create-document.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { CreateAssignmentComponent } from './pages/materials-group/materials-assignment/create-assignment/create-assignment.component';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { CodeHighlightComponent } from './components/code-highlight/code-highlight.component';
import { CreateQuizComponent } from './pages/materials-group/materials-quiz/create-quiz/create-quiz.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { CoursesManageComponent } from './pages/courses-manage/courses-manage.component';
import { CoursesApprovalComponent } from './pages/courses-manage/courses-approval/courses-approval.component';
import { CoursesCategorizeComponent } from './pages/courses-manage/courses-categorize/courses-categorize.component';
import { LearningPathManageComponent } from './pages/learning-path-manage/learning-path-manage.component';
import { CoursesManageViewDetailsComponent } from './pages/courses-manage/courses-manage-view-details/courses-manage-view-details.component';
import { CourseManageExploreComponent } from './pages/courses-manage/course-manage-explore/course-manage-explore.component';
import { HomeOverviewComponent } from './pages/home/home-staff/home-overview/home-overview.component';
import { PieChartComponent } from './components/chart/pie-chart/pie-chart.component';
import { LineChartComponent } from './components/chart/line-chart/line-chart.component';
import { BarChartComponent } from './components/chart/bar-chart/bar-chart.component';
import { RadarChartComponent } from './components/chart/radar-chart/radar-chart.component';
import { HomeStaffUserComponent } from './pages/home/home-staff/home-staff-user/home-staff-user.component';
import { UserManageComponent } from './pages/user-manage/user-manage.component';
import { ViolationsManageComponent } from './pages/violations-manage/violations-manage.component';
import { PlatformSettingsComponent } from './pages/platform-settings/platform-settings.component';
import { CoursesStatisticsComponent } from './pages/courses-manage/courses-statistics/courses-statistics.component';
import { ViolationsStatisticsComponent } from './pages/violations-manage/violations-statistics/violations-statistics.component';
import { ViolationsListComponent } from './pages/violations-manage/violations-statistics/violations-list/violations-list.component';
import { ViolationsService } from './core/services/violations.service';
import { ViolationDetailsComponent } from './pages/violations-manage/violations-statistics/violations-list/violation-details/violation-details.component';
import { PlatformStatisticsComponent } from './pages/platform-settings/platform-statistics/platform-statistics.component';
import { LevelSettingsComponent } from './pages/platform-settings/level-settings/level-settings.component';
import { QuestsSettingsComponent } from './pages/platform-settings/quests-settings/quests-settings.component';
import { ShopSettingsComponent } from './pages/platform-settings/shop-settings/shop-settings.component';
import { CouponsSettingsComponent } from './pages/platform-settings/coupons-settings/coupons-settings.component';
import { QuestsService } from './core/services/quests.service';
import { CreateCouponComponent } from './pages/platform-settings/coupons-settings/create-coupon/create-coupon.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { LabelSwitchComponent } from './components/label-switch/label-switch.component';
import { AdvanceSettingsComponent } from './pages/platform-settings/advance-settings/advance-settings.component';
import { CreateNewQuestComponent } from './pages/platform-settings/quests-settings/create-new-quest/create-new-quest.component';
import { HomeAdminComponent } from './pages/home/home-admin/home-admin.component';
import { PlatformLogsComponent } from './pages/platform-logs/platform-logs.component';
import { OtpComponent } from './components/otp/otp.component';
import { SigninComponent } from './pages/auth/signin/signin.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { PersonalSettingsComponent } from './pages/personal-settings/personal-settings.component';
import { ManagePasswordComponent } from './pages/personal-settings/manage-password/manage-password.component';
import { LearningPathService } from './core/services/learning-path.service';
import { ViewCourseScreenComponent } from './pages/view-course-screen/view-course-screen.component';
import { ReviewsListComponent } from './components/reviews-list/reviews-list.component';
import { ReviewItemComponent } from './components/reviews-list/review-item/review-item.component';
import { PlatformService } from './core/services/platform.service';
import { PaymentService } from './core/services/payment.service';
import { StudyingMaterialComponent } from './pages/course-stage/studying-material/studying-material.component';
import { UploadProgressComponent } from './components/upload-progress/upload-progress.component';
import { CertificateComponent } from './components/certificate/certificate.component';
import { CertificatePageComponent } from './pages/certificate-page/certificate-page.component';
import { MinifyCourseInfoComponent } from './pages/course-stage/minify-course-info/minify-course-info.component';
import { MinifyCourseReviewComponent } from './pages/course-stage/minify-course-review/minify-course-review.component';
import { BecomeInstructorComponent } from './pages/become-instructor/become-instructor.component';
import { ApproveInstructorComponent } from './pages/approve-instructor/approve-instructor.component';
import { PersonalInfoComponent } from './pages/personal-settings/personal-info/personal-info.component';
export const AppDeclarations = [
  AppComponent,
  NavbarComponent,
  OtpComponent,
  FooterComponent,
  CoursesListComponent,
  CoursesCardComponent,
  DropdownMenuComponent,
  BadgeComponent,
  ButtonComponent,
  AchievementCardComponent,
  AchievementsListComponent,
  ModalComponent,
  LanguageChangerComponent,
  CheckboxGroupComponent,
  NavbarCartComponent,
  MessageComponent,
  WishlistCartComponent,
  NavbarProfileComponent,
  AvatarByNameComponent,
  LoadingComponent,
  TableComponent,
  VideoComponent,
  SliderComponent,
  TextEditorComponent,
  CodeEditorComponent,
  CodeHighlightComponent,
  PieChartComponent,
  LineChartComponent,
  BarChartComponent,
  RadarChartComponent,
  LabelSwitchComponent,
  ReviewsListComponent,
  ReviewItemComponent,
  UploadProgressComponent,
  CertificateComponent,
  // Home
  HomeComponent,
  HomeStatisticsComponent,
  HomeStudyingComponent,
  HomeSuggestedComponent,
  HomeAchievementsComponent,
  HomeHeroComponent,
  HomeTrendingCoursesComponent,
  HomeWebNumericComponent,
  HomeShowOffComponent,
  HomeWhyChooseUsComponent,
  HomeInstructorSummaryComponent,
  HomeInsOthersComponent,
  HomeStaffUserComponent,
  HomeOverviewComponent,
  HomeAdminComponent,
  // Courses
  CoursesComponent,
  CoursesSearchPannelComponent,
  CourseSearchItemComponent,
  CourseDetailsComponent,
  CourseSectionComponent,
  MyCoursesComponent,
  MyCourseChartsComponent,
  MyCourseListComponent,
  MyCourseItemComponent,
  MyCourseAddComponent,
  MyCourseDetailsComponent,
  ManageStagesComponent,
  CoursesManageComponent,
  CoursesApprovalComponent,
  CoursesCategorizeComponent,
  CoursesManageViewDetailsComponent,
  CourseManageExploreComponent,
  CoursesStatisticsComponent,
  ViewCourseScreenComponent,
  // Cart
  CartComponent,
  CartItemComponent,
  // Wishlist
  WishlistComponent,
  // Profile
  ProfileComponent,
  InstructorProfileComponent,
  LearnerProfileComponent,
  LeanerProfileInfoComponent,
  LeanerAchievementsComponent,
  LearningHeatmapComponent,
  LeanerCoursesComponent,
  // Noti
  NavbarNotiComponent,
  // Chat
  NavbarChatComponent,
  ChatComponent,
  ConversationMessageComponent,
  ConversationsListComponent,
  // About
  AboutComponent,
  // Terms
  TermsComponent,
  // privacy
  PrivacyComponent,
  Fox3dComponent,
  // Fox
  FoxItemsComponent,
  ShopItemsComponent,
  // Stages
  CourseStageComponent,
  // Path
  LeaningPathComponent,
  PathItemComponent,
  LearningPathDetailsComponent,
  PathCourseItemComponent,
  LearningPathManageComponent,
  // Materials
  MaterialsComponent,
  MaterialsQuizComponent,
  MaterialsVideoComponent,
  MaterialsDocumentComponent,
  MaterialsAssignmentComponent,
  CreateVideoComponent,
  CreateDocumentComponent,
  CreateAssignmentComponent,
  CreateQuizComponent,
  // Revenue
  MyRevenueComponent,
  MyRevenueInfosComponent,
  MyRevenueCoursesBreakDownComponent,
  MyRevenueTrendsComponent,
  // transactions
  TransactionsComponent,
  // User manage
  UserManageComponent,
  // violation
  ViolationsManageComponent,
  ViolationsStatisticsComponent,
  ViolationsListComponent,
  ViolationDetailsComponent,
  // Settings
  PlatformSettingsComponent,
  PlatformStatisticsComponent,
  LevelSettingsComponent,
  QuestsSettingsComponent,
  ShopSettingsComponent,
  AdvanceSettingsComponent,
  CouponsSettingsComponent,
  CreateCouponComponent,
  CreateNewQuestComponent,
  // Pricing
  PricingComponent,
  // Logs
  PlatformLogsComponent,
  // Auth
  SigninComponent,
  ForgotPasswordComponent,
  SignupComponent,
  // Settings
  PersonalSettingsComponent,
  ManagePasswordComponent,

  CertificatePageComponent,
  StudyingMaterialComponent,
  MinifyCourseInfoComponent,
  MinifyCourseReviewComponent,
  BecomeInstructorComponent,
  ApproveInstructorComponent,
  PersonalInfoComponent
];
export const NGIcons = [
  EnterOutline,
  FieldTimeOutline,
  BookOutline,
  CheckCircleFill,
  WarningFill,
  CloseCircleFill,
  GiftOutline,
  CreditCardOutline,
  SearchOutline,
  UserOutline,
  AccountBookFill,
  AlertFill,
  AlertOutline,
  HeartOutline,
  HomeOutline,
  ShoppingCartOutline,
  BellOutline,
  MessageOutline,
  ThunderboltOutline,
  FireOutline,
  HourglassOutline,
  NotificationOutline,
  ClockCircleOutline,
  TrophyOutline,
  CheckOutline,
  FileExclamationOutline,
  AimOutline,
  StarOutline,
  RightOutline,
  LeftOutline,
  HeartFill,
  TrophyOutline,
  GlobalOutline,
  CloseOutline,
  FormatPainterOutline,
  LoginOutline,
  EditOutline,
  SafetyCertificateOutline,
  ExclamationCircleOutline,
  CommentOutline,
  PlayCircleOutline
];

export const appServices = [
  UserService,
  MessageService,
  ThemeService,
  PriceService,
  ModalService,
  ChatService,
  CartService,
  WishlistService,
  NotificationService,
  CouponService,
  CoursesService,
  ChatService,
  FirebaseService,
  FoxService,
  LoadingService,
  HttpService,
  ImageService,
  CurrencyExchangePipe,
  VideoService,
  ViolationsService,
  QuestsService,
  LearningPathService,
  PlatformService,
  PaymentService
];

export const appGuards = [
  AuthGuard
]
