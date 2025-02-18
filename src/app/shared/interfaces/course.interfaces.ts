import { MissionStatus } from '../enums/course.enum';
import { IUserStat } from './user.interfaces';

export interface ICourse {
  id: string;
  name: string;
  author: IUserStat | any; // TODO: User interface
  description: string;
  duration: number;
  stageCount?: number;
  image: string;
  price: number;
  createdDate: string;
  lastUpdated: string;
  rating: number;
  numberOfRating: number;
  isCompleted: boolean;
  progress: number; // %
  tags: ITag[];
}

export interface ICourseCreate {
  name: string;
  description: string;
  image: string;
  price: number;
  requirements: string[];
}

export interface ICourseUpdate extends ICourseCreate {
  id: string;
  stages: IModifyStage[];
}

export interface IModifyStage {
  name: string;
  description: string;
  materialsId: string[];
}

export interface ICourseDetails extends ICourse {
  stages: IStage[];
  requirements: string[];
  leanerCount: number;
  totalTime: number; // hours
}

export interface ICourseManage extends ICourse {
  isPublic: boolean;
}

export type materialType = 'video' | 'document' | 'quiz' | 'assignment';
export interface IMaterialCreate {
  id: string;
  name: string;
  description: string;
  type: materialType;
  data:
    | { type: 'video'; data: IVideo }
    | { type: 'document'; data: IDocument }
    | { type: 'quiz'; data: IQuiz }
    | { type: 'assignment'; data: IAssignment };
}

export interface IVideo {
  url: string;
  duration: number;
  thumbnail: string;
}
export interface IDocument {
  content: string; // html
}
export interface IQuiz {}

export interface IAssignment {
  questions: IAssignmentQuestion[];
  timeLimit: number; // minutes
}

export interface IAssignmentQuestion {
  question: string;
  answerLanguage: 'javascript' | 'python' | 'typescript' | 'text'; //...
}

export interface ICourseManageDetails extends Omit<ICourseDetails, 'author'> {
  isPublic: boolean;
  totalInWhislist: number;
  totalInCart: number;
  courseEnrollOverTime: { time: string; count: number }[];
  courseRatingOverTime: { time: string; count: number }[];
  totalEnrolled: number;
}
export interface ITag {
  id: string;
  name: string;
  description?: string;
}

export interface ICourseCart {
  courses: ICourse[];
  total: number;
}

export interface ICoupon {
  id: string;
  code: string;
  discount: number; // %
  description: string;
  expireDate: string | null;
}

export interface IReview {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  courseId: string;
  rating: number;
  content: string;
  createdDate: string;
  lastUpdated: string;
}

// Remove later
export interface IStage {
  id: string;
  title: string;
  time: number; // hour
  mission: IStageMission[];
}

export interface IStageMission {
  id: string;
  title: string;
  type: materialType;
  status?: MissionStatus;
  mission: string;
  time: number; // minutes
}
