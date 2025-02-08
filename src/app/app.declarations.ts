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

export const AppDeclarations = [
  AppComponent,
  NavbarComponent,
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
  // Courses
  CoursesComponent,
  CoursesSearchPannelComponent,
  CourseSearchItemComponent,
  CourseDetailsComponent,
  CourseSectionComponent,
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
  // Stages
  CourseStageComponent,
  // Path
  LeaningPathComponent,
  PathItemComponent,
  LearningPathDetailsComponent,
  PathCourseItemComponent
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
  HttpService
];

export const appGuards = [
  AuthGuard
]
