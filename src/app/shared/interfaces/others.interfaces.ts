import { TemplateRef } from '@angular/core';
import { SubscribtionNameEnum, TransactionStatusEnum, TransactionTypeEnum } from '../enums/others.enum';
import { ICourseOverview } from './course.interfaces';
import { IUser } from './user.interfaces';

export interface IMessage {
  id?: string;
  type: MessageType;
  message: string;
}

export type MessageType = 'success' | 'error' | 'warn';

export interface INotification {
  id?: string;
  receiverId: string;
  url: string;
  timestamp: string;
  content: string; // MESSAGE CODE
  value?: any[];
}

export interface IChatMessage {
  id?: string;
  senderId: string;
  time: string;
  content: string;
}

export interface IChatConversation {
  createdAt: string;
  id?: string;
  isMeSeen?: boolean;
  participants: {
    [userId: string]: {
      id: string;
      name: string;
      avatar: string;
      lastSeen: string;
    };
  };
  lastMessage: IChatMessage | null;
}

export interface IParticipant {
  id: string;
  name: string;
  avatar: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any) => string | number | (number | string)[] | object;
  translateLabel?: string | ((value: any) => string);
  isMoney?: boolean;
  style?: (data: any) => Object | Object;
  icon?: any;
  onClick?: (val: any) => void;
  elementRef?: TemplateRef<any>;
  customClass?: (val: any) => string | string;
  isSwitchData?: boolean;
}

export interface IChunkFile {
  fileId: string;
  chunks: Blob[];
}

export interface IUploadingChunk {
  totalChunks: number;
  chunkIndex: number;
  fileId: string;
  chunk: Blob;
}

export interface IPackageConfig {
  name: SubscribtionNameEnum;
  data: {
    Instructor?: InstructorPackageData;
    Learner?: LearnerPackageData;
  };
}

interface InstructorPackageData {
  monthly?: number;
  yearly?: number;
  free?: {
    CommissionFee: number;
  };
  pro?: {
    CommissionFee: number;
    MarketingEmailPerMonth: number;
  };
}

interface LearnerPackageData {
  monthly?: number;
  yearly?: number;
  free?: Record<string, never>; // empty object
  pro?: {
    CouponPerMonth: number;
    CouponDiscountUpto: number;
    ExtraGoldAndExp: number;
    TrialCoursePercentage: number;
    CourseTrialPerMonth: number;
  };
}

export interface AdminDashboardResponse {
  adminDasboardUsers: AdminDashboardUsers;
  adminDashboardCourses: AdminDashboardCourses;
  pendingViolations: number;
}

export interface AdminDashboardUsers {
  totalUsers: number;
  graphData: UserGraphData[];
  monthlyActiveUsers: number;
  thisMonthNewUsers: number;
}

export interface UserGraphData {
  totalActiveUser: number;
  totalProUser: number;
  totalUser: number;
  date: string; // e.g., "Mar 2025"
}

export interface AdminDashboardCourses {
  totalCourses: number;
  newCoursesThisMonth: number;
  mostPopularCategory: string; // or you can replace with a union type if there are fixed categories
}

export interface IPlatformSettingsStats {
  levelExp: LevelExpStats;
  quests: QuestStats;
  shopItems: ShopItemStats;
  pricing: PricingStats;
  coupons: CouponStats;
}

export interface LevelExpStats {
  totalEarnedExp: number;
  avarageExpPerDay: number;
  totalEarnedLevel: number;
  averageLevel: number;
  userLevels: UserLevel[];
}

export interface UserLevel {
  level: number;
  count: number;
}

export interface QuestStats {
  totalCreatedQuests: number;
  totalCompletedQuests: number;
  averageCompletedQuestsPerUser: number;
  questCompletion: QuestCompletion[];
}

export interface QuestCompletion {
  date: string; // ISO timestamp string
  count: number;
}

export interface ShopItemStats {
  totalItemSold: number;
  averageItemsPerUser: number;
  mostPurchasedItem: string;
  totalGoldFromSales: number;
  bestSaleItems: BestSaleItem[];
}

export interface BestSaleItem {
  name: string;
  count: number;
}

export interface PricingStats {
  instructorProSold: number | null;
  learnerProSold: number | null;
  renewRate: number | null;
  subscription: SubscriptionData[];
}

export interface SubscriptionData {
  date: string; // e.g., "2025-04-09"
  count: number;
}

export interface CouponStats {
  createdCoupons: number;
  expiredCoupons: number;
  redeemedTimes: number;
  graphData: CouponGraphData[];
}

export interface CouponGraphData {
  redeemTimes: number;
  newCoupons: number;
  expiredCoupons: number;
  date: string; // e.g., "Oct 2024"
}

export interface IUpdateShopItem {
  items: {
    name: string;
    price: number;
  }[];
}

export interface ICertificateReq {
  Id?: string;
  UserId?: string;
  CourseId?: string;
}

export interface ICertificateRes {
  course: {
    id: string;
    title: string;
    description: string;
    isPublic: boolean;
    photoUrl: string;
    createdBy: string;
    price?: number;
    rating?: number;
    totalLesson?: number;
    totalTime?: number;
    totalReview?: number;
  };
  user: IUser;
  id: string;
  createdAt: string
}

export interface IBecomeInstructorReq {
  UserId: string;
  Headline: string;
  Description: string;
  Phone: string;
  CertificateFiles: File[]
}

export interface IInstructorApplyRes {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string;
  headline: string;
  description: string;
  roleId: string;
  averageReviews: number;
  totalReviews: number;
  totalLearners: number;
  courses: ICourseOverview[];
  instructorCertificate: {
    id: string;
    certificateUrl: string;
  }[];
}

