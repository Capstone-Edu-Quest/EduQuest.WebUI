import { MissionStatus } from "../enums/course.enum";
import { IUserStat } from "./user.interfaces";

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

export interface ICourseDetails extends ICourse {
  stages: IStage[];
  requirements: string[];
  leanerCount: number;
  totalTime: number; // hours
}

export interface IStage {
  id: string;
  title: string;
  time: number; // hour
  mission: IStageMission[];
}

export type stageMissionType = 'video' | 'document' | 'quiz'

export interface IStageMission {
  id: string;
  title: string;
  type: stageMissionType;
  status?: MissionStatus;
  mission: string;
  time: number; // minutes
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