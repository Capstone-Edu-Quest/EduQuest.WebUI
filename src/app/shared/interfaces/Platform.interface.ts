import { BoosterEnum, RewardTypeEnum } from '../enums/others.enum';

export interface ILevel {
  id: number;
  exp: number; // reach to level up
  rewardType: RewardTypeEnum[];
  rewardValue: RewardValueType;
}

export type RewardValueType = (number | BoosterEnum | string)[];
