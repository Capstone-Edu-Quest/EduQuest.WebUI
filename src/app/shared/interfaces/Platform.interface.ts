import { BoosterEnum, RewardTypeEnum } from '../enums/others.enum';
import { PackageTypeEnum } from '../enums/platform.enum';
import { WebRole } from '../enums/user.enum';

export interface ILevel {
  id?: string;
  level: number;
  exp: number; // reach to level up
  rewardType: RewardTypeEnum[];
  rewardValue: RewardValueType;
}

export type RewardValueType = (number | BoosterEnum | string)[];

export interface IPackageSettings {
  id: string;
  packageId: string;
  packageType: PackageTypeEnum;
  role: WebRole;

}
