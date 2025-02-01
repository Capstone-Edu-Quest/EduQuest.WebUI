import { WebRole } from '../enums/user.enum';

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: WebRole;
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
