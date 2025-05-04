import { WebRole } from '../enums/user.enum';
import { ICourseOverview, ITag } from './course.interfaces';
import { IQuestOfUser } from './quests.interface';

export interface ILoginRes {
  token: IToken;
  userData: IUser;
}

export interface IToken {
  accessToken: string;
  refreshToken: string;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  isPro: boolean;
  description: string | null;
  headline: string | null;
  avatarUrl: string;
  roleId: WebRole;
  status: string;
  statistic: IUserStatistics;
  lastActive?: string;
  mascotItem: string[];
  equippedItems: string[];
  isPremium: boolean;
  tags: {
    tagId: string;
    tagName: string;
  }[];
}

export interface IProfile extends IUser {
  totalLearners: number;
  totalReviews: Number;
  avarageReviews: number;
  courses: ICourseOverview[];
  completedQuest: IQuestOfUser[];
  level: number | null;
  recentCourses: ICourseOverview[];
  learningData: { date: string; count: number }[];
  totalMinutes: number;
  totalDays: number;
  statistics: {
    rank: number;
    longestStreak: number;
    totalLearningTime: number;
    totalLearningCourses: number;
    favoriteTopics: string | null;
  };
}

export interface IUserStatistics {
  userId: string;
  totalActiveDay: number;
  maxStudyStreakDay: number;
  lastLearningDay: string | null;
  completedCourses: number;
  gold: number;
  exp: number;
  level: number;
  studyTime: number;
  totalCompletedCourses: number;
  currentStreak: number;
  longestStreak: number;
  maxExpLevel: number;

  totalCourseCreated: number;
  totalLearner: number;
  totalReview: number;
  lastActive: string | null;

  rank: number;
  booster: {
    boostExp: number;
    boostGold: number;
  };
}

export interface IUserStat extends IUser {
  createdAt: string;
  updatedAt: string;
  jobTitle: string;
  description: string;
  statistics: [
    { label: 'LABEL.TOTAL_COURSES_STATS'; value: number },
    { label: 'LABEL.TOTAL_LEARNER_STATS'; value: number },
    { label: 'LABEL.TOTAL_REVIEWS_STATS'; value: number },
    { label: 'LABEL.AVERAGE_RATINGS_STATS'; value: number }
  ];
}

export interface IChangeInfoReq {
  id: string;
  username: string;
  phone: string;
  headline: string;
  description: string;
  tags: string[];
}

export interface ISignUpReq {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ISearchUserReq {
  Username?: string;
  Email?: string;
  Phone?: string;
}

export interface ISearchUserRes {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string;
  description: string;
  expertName: string | null;
  headline: string;
  roleId: string;
  status: string;
  totalCourses: number;
  totalLearners: number;
  totalReviews: number;
  tags: { tagId: string; tagName: string }[];
}

export interface IGetUserByRoleId {
  id: string;
  username: string;
  email: string;
  phone: string;
  status: string;
  headline: string | null;
  description: string | null;
  avatarUrl: string | null;
  roleId: WebRole;
  createdAt: string;
  updatedAt: string;
  tags: { tagId: string; tagName: string }[];
}
