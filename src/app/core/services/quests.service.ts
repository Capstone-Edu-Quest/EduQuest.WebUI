import { TranslateService } from '@ngx-translate/core';
import {
  BoosterEnum,
  QuestMissionEnum,
  QuestTypeEnum,
  RewardTypeEnum,
} from './../../shared/enums/others.enum';
import { Injectable } from '@angular/core';
import { RewardValueType } from '../../shared/interfaces/Platform.interface';
import { FoxItems } from '../../components/fox-3d/3d-setup/fox-3d.config';
import { HttpService } from './http.service';
import { endPoints } from '../../shared/constants/endPoints.constant';
import {
  IQuest,
  IQuestOfUser,
  IQuestOfUserQuery,
} from '../../shared/interfaces/quests.interface';
import { UserService } from './user.service';
import { WebRole } from '../../shared/enums/user.enum';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class QuestsService {
  constructor(
    private translate: TranslateService,
    private http: HttpService,
    private user: UserService
  ) {}

  userQuests$: BehaviorSubject<IQuestOfUser[]> = new BehaviorSubject<
    IQuestOfUser[]
  >([]);

  getQuestsForManage() {
    return this.http.get<IQuest[]>(endPoints.quest + '?pageNo=1&eachPage=100')
  }

  initUserQuest() {
    // Call API
    if (this.user.user$.value?.roleId !== WebRole.LEARNER) return;
    const api$ = this.getQuestOfUser({});
    api$.subscribe((res) => {
      if (!res?.payload) return;
      this.userQuests$.next(res.payload);
    });
  }

  getQuestOfUser(query: IQuestOfUserQuery) {
    const params: string[] = [];
    Object.keys(query).forEach((key) => {
      if (query[key as keyof IQuestOfUserQuery]) {
        params.push(`${key}=${query[key as keyof IQuestOfUserQuery]}`);
      }
    });
    return this.http.get<IQuestOfUser[]>(
      endPoints.getQuestOfUser + '?' + params.join('&')
    );
  }

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
        return 'LABEL.NOT_FOUND';
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
          rewards.push(
            `${this.translate.instant(
              `SHOP_ITEMS.${`${reward[i] as string}`.toUpperCase()}`
            )} x1`
          );
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

  getQuestTypeLabel(type: QuestTypeEnum) {
    switch (type) {
      case QuestTypeEnum.DAILY:
        return 'LABEL.DAILY';
      case QuestTypeEnum.ONE_TIME:
        return 'LABEL.ONE_TIME';
      default:
        return '';
    }
  }

  getMissionLabel(mission: QuestMissionEnum) {
    const label = 'MISSION.' + QuestMissionEnum[mission];

    return label;
  }

  createNewQuest(newQuest: IQuest) {
    return this.http.post(endPoints.quest, newQuest)
  }
}
