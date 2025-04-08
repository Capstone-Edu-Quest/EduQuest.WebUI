import { WebRole } from '../enums/user.enum';
import { ICourseOverview } from './course.interfaces';
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
  avatarUrl: string;
  roleId: WebRole;
  status: string;
  statistic: IUserStatistics;
  lastActive?: string;
  mascotItem: string[];
  equippedItems: string[];
  isPremium: boolean;
}

export interface IProfile extends IUser {
  headline: string | null;
  totalLearners: number;
  totalReviews: Number;
  avarageReviews: number;
  description: string | null;
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
