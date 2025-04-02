import { LearningPathModeEnum } from '../enums/learning-path.enum';
import { ICourse, ITag } from './course.interfaces';

export interface ILearningPath {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  totalTime: number;
  totalCourses: number;
  createdByExpert: boolean;
  createdBy: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  isEnrolled: boolean;
  tags: ITag[]
}

export interface IPathTab {
  label: string;
  value: string | LearningPathModeEnum;
}

export interface ILearningPathDetails extends ILearningPath {
  courses: ILCourseObject[];
}

export interface ILCourseObject {
  order: number;
  course: ICourse;
}

export interface IModifyLearningPath {
  name?: string;
  description?: string;
  isPublic?: boolean;
  courses?: IModifyLearningPathCourse[]
}

export interface IModifyLearningPathCourse {
  courseId: string;
  courseOrder?: number;
  action?: 'add' | 'delete'
}