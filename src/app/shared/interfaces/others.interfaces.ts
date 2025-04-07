import { TemplateRef } from '@angular/core';
import { SubscribtionNameEnum } from '../enums/others.enum';

export interface IMessage {
  id?: string;
  type: MessageType;
  message: string;
}

export type MessageType = 'success' | 'error' | 'warn';

export interface INotification {
  id?: string;
  receiverId: string;
  url: string;
  time: string;
  content: string; // MESSAGE CODE
  value?: any[];
}

export interface IChatMessage {
  id?: string;
  senderId: string;
  time: string;
  content: string;
}

export interface IChatConversation {
  createdAt: string;
  id?: string;
  isMeSeen?: boolean;
  participants: {
    [userId: string]: {
      id: string;
      name: string;
      avatar: string;
      lastSeen: string;
    };
  };
  lastMessage: IChatMessage | null;
}

export interface IParticipant {
  id: string;
  name: string;
  avatar: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any) => string | number | (number | string)[] | object;
  translateLabel?: string | ((value: any) => string);
  isMoney?: boolean;
  style?: (data: any) => Object | Object;
  icon?: any;
  onClick?: (val: any) => void;
  elementRef?: TemplateRef<any>;
  customClass?: (val: any) => string | string;
  isSwitchData?: boolean;
}

export interface IChunkFile {
  fileId: string;
  chunks: Blob[];
}

export interface IUploadingChunk {
  totalChunks: number;
  chunkIndex: number;
  fileId: string;
  chunk: Blob;
}

export interface IPackageConfig {
  name: SubscribtionNameEnum;
  data: {
    Instructor?: InstructorPackageData;
    Learner?: LearnerPackageData;
  };
}

interface InstructorPackageData {
  monthly?: number;
  yearly?: number;
  free?: {
    CommissionFee: number;
  };
  pro?: {
    CommissionFee: number;
    MarketingEmailPerMonth: number;
  };
}

interface LearnerPackageData {
  monthly?: number;
  yearly?: number;
  free?: Record<string, never>; // empty object
  pro?: {
    CouponPerMonth: number;
    CouponDiscountUpto: number;
    ExtraGoldAndExp: number;
    TrialCoursePercentage: number;
    CourseTrialPerMonth: number;
  };
}
