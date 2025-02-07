import { LearningPathModeEnum } from '../enums/learning-path.enum';
import { IPathTab } from '../interfaces/learning-path.interfaces';

export const defaultLearningPathMode = LearningPathModeEnum.PUBLIC;
export const defaultSortOrder = 'newest';
export const learningPathModeTabs: IPathTab[] = [
  {
    label: 'LABEL.PUBLIC_PATH',
    value: LearningPathModeEnum.PUBLIC,
  },
  {
    label: 'LABEL.PRIVATE_PATH',
    value: LearningPathModeEnum.PRIVATE,
  },
  {
    label: 'LABEL.ENROLLED_PATH',
    value: 'enrolled',
  }
];

export const learningPathSortValue = [
  {
    value: 'newest',
    label: 'LABEL.NEWEST',
  },
  {
    value: 'oldest',
    label: 'LABEL.OLDEST',
  },
];
