import { TranslateService } from '@ngx-translate/core';
import { BoosterEnum, RewardTypeEnum } from './../../shared/enums/others.enum';
import { Injectable } from '@angular/core';
import { RewardValueType } from '../../shared/interfaces/Platform.interface';
import { FoxItems } from '../../components/fox-3d/3d-setup/fox-3d.config';

@Injectable({
  providedIn: 'root',
})
export class QuestsService {
  constructor(private translate: TranslateService) {}

  getRewardTypeLabel(reward: RewardTypeEnum): string {
    switch (reward) {
      case RewardTypeEnum.GOLD:
        return 'LABEL.GOLD';
      case RewardTypeEnum.EXP:
        return 'LABEL.EXP';
      case RewardTypeEnum.ITEM:
        return 'LABEL.ITEM';
      case RewardTypeEnum.COUPON:
        return 'LABEL.COUPON';
      case RewardTypeEnum.BOOSTER:
        return 'LABEL.BOOSTER';
      default:
        return '';
    }
  }

  getBoosterLabel(booster: BoosterEnum) {
    switch (booster) {
      case BoosterEnum.EXP:
        return 'LABEL.EXP_BOOSTER';
      case BoosterEnum.GOLD:
        return 'LABEL.GOLD_BOOSTER';
      default:
        return '';
    }
  }

  getAllRewardsString(rewardType: RewardTypeEnum[], reward: RewardValueType) {
    let rewards: any[] = [];

    rewardType.forEach((type, i) => {
      switch (type) {
        case RewardTypeEnum.GOLD:
        case RewardTypeEnum.EXP:
          rewards.push(
            `${reward[i].toLocaleString()} ${this.translate.instant(
              this.getRewardTypeLabel(type)
            )}`
          );
          break;
        case RewardTypeEnum.ITEM:
          rewards.push(`${this.translate.instant(`SHOP_ITEMS.${(reward[i] as string).toUpperCase()}`)} x1`);
          break;
        case RewardTypeEnum.COUPON:
          rewards.push(
            `${this.translate.instant(this.getRewardTypeLabel(type))} x1`
          );
          break;
        case RewardTypeEnum.BOOSTER:
          rewards.push(
            `${this.translate.instant(
              this.getBoosterLabel(reward[i] as BoosterEnum)
            )} x1`
          );
          i++;
          break;
      }
    });

    return rewards.join(', ');
  }

  getRewardOptions(rewardType: RewardTypeEnum) {
    switch (rewardType) {
      case RewardTypeEnum.ITEM:
        return FoxItems.map((item) => ({ value: item.id, label: item.id }));
      case RewardTypeEnum.COUPON:
        return [];
      case RewardTypeEnum.BOOSTER:
        return Object.keys(BoosterEnum)
          .filter((key) => isNaN(Number(key)))
          .map((key) => ({
            label: this.getBoosterLabel(
              BoosterEnum[key as keyof typeof BoosterEnum]
            ),
            value: BoosterEnum[key as keyof typeof BoosterEnum],
          }));
      case RewardTypeEnum.GOLD:
      case RewardTypeEnum.EXP:
      default:
        return [];
    }
  }
}
