import { WebRole } from '../enums/user.enum';

export interface IUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string;
  roleId: WebRole;
  status: string;
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
