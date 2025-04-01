import { WebRole } from '../enums/user.enum';

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
  avatarUrl: string;
  roleId: WebRole;
  status: string;
  statistic: IUserStatistics;
  lastActive?: string;
  mascotItem: string[];
  equippedItems: string[];
  isPremium: boolean;
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
