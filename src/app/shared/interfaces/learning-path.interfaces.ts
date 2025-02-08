import { LearningPathModeEnum } from '../enums/learning-path.enum';
import { ICourse } from './course.interfaces';

export interface ILearningPath {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  totalTime: number;
  totalCourses: number;
  createdBy: {
    id: string;
    name: string;
    avatar: string;
  };
  isEnrolled: boolean;
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
