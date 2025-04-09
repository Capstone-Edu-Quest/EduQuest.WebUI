import {
  CourseSortEnum,
  InstructorCourseStatus,
  MaterialTypeEnum,
  MissionStatus,
} from '../enums/course.enum';
import { AssignmentLanguageEnum } from '../enums/materials.enum';

export interface ITableMaterialData {
  lesson: number;
  name: string;
  description: string;
  time: number;
  type: materialType;
}

export interface ICourseOverview {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  status: InstructorCourseStatus;
  photoUrl: string;
  author: string;
  createdBy: string;
  price: number;
  discountPrice: number | null;
  rating: number;
  totalLesson: number;
  totalTime: number;
  totalReview: number;
  progressPercentage: number | null;
}

export interface ICourse {
  id: string;
  title: string;
  description: string;
  photoUrl: string;
  requirementList: string[];
  feature: string;
  lastUpdated: string | null;
  price: number;
  discountPrice: number | null;
  author: {
    id: string;
    username: string;
    headline: string;
    description: string;
    totalCourseCreated: number;
    totalLearner: number;
    rating: number | null;
    totalReview: number;
  };
  listLesson: ILessonOverview[];
  listTag: ITag[];
  totalLearner: number;
  rating: number;
  totalReview: number;
  progress: number | null;
  totalTime: number;
  isPublic: boolean;
}

export interface ICourseInstructor extends ICourse {
  status: InstructorCourseStatus;
  totalLesson: number;
  totalInCart: number;
  totalInWishList: number;
  courseEnrollOverTime: { time: string; count: string }[];
  courseRatingOverTime: { time: string; count: string }[];
}

export interface ICourseApproval extends ICourse {
  expert: {
    id: string;
    name: string;
  } | null;
}

export interface ICourseCreate {
  courseId?: string;
  title: string;
  description: string;
  photoUrl: string;
  price: number;
  requirementList: string[];
  lessonCourse: ICourseCreateLesson[];
}

export interface ICourseCreateLesson {
  index: number;
  id: string;
  name: string;
  description: string;
  materialIds: string[];
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

export interface ICourseTagData {
  id: string;
  name: string;
  description: string;
  tags: ITag[];
}

export interface ICourseManage extends ICourse {
  isPublic: boolean;
}

export type materialType = 'Video' | 'Document' | 'Quiz' | 'Assignment';

export interface IMaterialResponse {
  videos: {
    total: number;
    items: {
      id: string;
      title: string;
      description: string;
      duration: number;
    }[];
  };
  document: {
    total: number;
    items: { id: string; title: string; description: string }[];
  };
  quiz: {
    total: number;
    items: {
      id: string;
      title: string;
      description: string;
      questionCount: number;
      timeLimit: number;
      passingPercentage: number;
    }[];
  };
  assignment: {
    total: number;
    items: {
      id: string;
      title: string;
      description: string;
      timeLimit: number;
      answerLanguage: string;
      language: string;
    }[];
  };
}

export interface IMaterial<T> {
  id: string;
  title: string;
  description: string;
  type: materialType;
  data: T;
}
export interface IMaterialCreate<T> extends Omit<IMaterial<T>, 'id'> {}

export interface IVideo {
  url: string;
  duration: number; // seconds
  questions: IVideoQuestion[];
}

export interface IVideoQuestion {
  question: string;
  answers: {
    answer: string;
    isCorrect: boolean;
  }[];
}
export interface IDocument {
  content: string; // html
}

// ----
export interface IQuiz {
  timeLimit: number; // minutes
  passingPercentages: number;
  questions: IQuizQuestion[];
}

export interface IQuizQuestion {
  id?: string;
  question: string;
  answers: IQuizOption[];
  // explanation: string;
}

export interface IQuizOption {
  id?: string;
  content: string;
  isCorrect: boolean;
}
// ----

export interface IAssignment {
  question: string;
  inputArguments: any[]; // Input arguments for code
  answerLanguage: AssignmentLanguageEnum; //...
  expectedAnswer: any; // Expected answer from code, can be null
}

export interface ICourseManageDetails extends Omit<ICourse, 'author'> {
  isPublic: boolean;
  totalInWhislist: number;
  totalInCart: number;
  courseEnrollOverTime: { time: string; count: number }[];
  courseRatingOverTime: { time: string; count: number }[];
  totalEnrolled: number;
}

export interface ICourseFullMetarialsView extends ICourse {
  stages: {
    id: string;
    title: string;
    description: string;
    materials: IMaterial<IVideo | IDocument | IQuiz | IAssignment>[];
  }[];
  requirements: string[];
}

export interface ITag {
  id: string;
  name: string;
  courses?: number;
}

export interface ITagCount extends ITag {
  numberOfCourses: number;
}

export interface ICourseCart {
  courses: ICourseOverview[];
  total: number;
  numOfCourse: number;
  id: string;
}

export interface ICoupon extends ICouponCreate {
  code: string;
  usages: number; // number of time used
  createdAt: string;
  createdBy: string;
}

export interface ICouponCreate {
  code: string | null; // unique
  description: string;
  discount: number; // %
  limit: number; // -1 = unlimited
  startTime: string;
  expireTime: string | null; // null = not expire
  allowedUsePerUser: number; // number of times a user can use coupon -1 = unlimited
  // whitelistUserIds: string[] | null; // Users can use coupon, null = all users
  // whitelistCourseIds: string[] | null; // Courses can apply coupon, null = all courses
}

export interface ICouponUpdate extends Omit<ICouponCreate, 'code'> {
  code: string;
}

export interface ICouponCreateState
  extends Omit<ICouponCreate, 'startTime' | 'expireTime'> {
  startTime: string;
  expireTime: string | null;
}

export interface ISearchCouponParams {
  code?: string;
  discount?: number;
  startTime?: string;
  expireTime?: string;
  pageNo?: number;
  eachPage?: number;
}

// Remove later
export interface IStage {
  id: string;
  title: string;
  time: number; // hour
  mission: IStageMission[];
}

export interface ILessonOverview {
  id: string;
  index: number;
  name: string;
  totalTime: number;
  materials: IMaterialOverview[];
}

export interface IMaterialOverview {
  id: string;
  type: materialType;
  title: string;
  description: string;
  duration: number;
  version: number;
  originalMaterialId: string | null;
  status?: MissionStatus;
}

export interface IStageMission {
  id: string;
  title: string;
  type: materialType;
  status?: MissionStatus;
  mission: string;
  time: number; // minutes
}

export interface ITrendingCourse {
  id: string;
  name: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  enrollments: number;
  tags: ITag[];
}

export interface IFilterCourseOption {
  sort: CourseSortEnum | null;
  ratingOpt: string;
  selectedTags: string[];
}

export interface ISearchCourseParams {
  KeywordName?: string;
  isPublic?: boolean;
  DateTo?: string;
  DateFrom?: string;
  TagListId?: string[];
  Author?: string;
  Rating?: number;
  Sort?: CourseSortEnum;
  pageNo?: number;
  eachPage?: number;
}

export interface IReviewQuery {
  courseId: string;
  rating?: number;
  comment?: string;
  pageNo?: number;
  eachPage?: number;
}

export interface IReview {
  id: string;
  courseId: string;
  rating: number;
  comment: string;
  createdBy: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  createdAt: string;
}

export interface IMyCourseChartsStats {
  coursesEnroll: { time: string; count: string }[];
  coursesReview: { time: string; count: string }[];
  learnerStatus: { status: string; count: string }[];
  topCourseInfo: { ttile: string; ratingCount: number; learnerCount: number }[];
}

export interface ILearningMaterial {
  id?: string;
  type: MaterialTypeEnum;
  title: string;
  description: string;
  video?: video;
  content?: string;
  quiz?: quiz;
  assignment?: assignment;
}

interface video {
  urlMaterial: string;
  duration?: number;
  thumbnail?: string;
}

interface quiz {
  id?: string;
  timeLimit: number;
  passingPercentage: number;
  questions: questions[];
}

interface questions {
  id?: string;
  questionTitle: string;
  multipleAnswers: boolean;
  answers: answers[];
}

interface answers {
  answerContent: string;
  isCorrect: boolean;
  id?: string;
}

interface assignment {
  timeLimit?: number;
  question?: string;
  answerLanguage?: string;
  expectedAnswer?: string;
}

export interface ISubmitQuizReq {
  quizId: string;
  totalTime: number;
  answers: { questionId: string; answerId: string }[];
}
