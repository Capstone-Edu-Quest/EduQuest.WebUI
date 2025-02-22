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

export interface IMaterial<T> {
  id: string;
  name: string;
  description: string;
  type: materialType;
  data: T;
}
export interface IMaterialCreate<T> extends Omit<IMaterial<T>, 'id'> {}

export interface IVideo {
  url: string;
  duration: number;
}
export interface IDocument {
  content: string; // html
}

// ----
export interface IQuiz {
  timeLimit: number;
  passingPercentages: number;
  questions: IQuizQuestion[];
}

export interface IQuizQuestion {
  id: string;
  question: string;
  answers: IQuizOption[];
  correctAnswers: string; // id
  // explanation: string;
}

export interface IQuizOption {
  id: string;
  content: string;
}
// ----

export interface IAssignment {
  timeLimit: number; // minutes
  question: string;
  answerLanguage: 'javascript' | 'python' | 'typescript' | 'text'; //...
  expectedAnswer: any; // Expected answer from code, can be null
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
