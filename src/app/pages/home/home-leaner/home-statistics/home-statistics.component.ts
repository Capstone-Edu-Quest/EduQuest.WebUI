import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  faBoxOpen,
  faCertificate,
  faCoins,
  faExchangeAlt,
  faPlus,
  faPuzzlePiece,
  faShop,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { IUser } from '../../../../shared/interfaces/user.interfaces';
import { UserService } from '../../../../core/services/user.service';
import { QuestsService } from '../../../../core/services/quests.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '@/src/app/core/services/message.service';
import { IRewardedQuestRes } from '@/src/app/shared/interfaces/quests.interface';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home-statistics',
  templateUrl: './home-statistics.component.html',
  styleUrls: ['./home-statistics.component.scss'],
})
export class HomeStatisticsComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  user: IUser | null = null;
  shardsList: [string, number][] = [];

  currentStreak = 15; // days
  numTest = 1;

  dailyQuests: any[] = [];

  levelIcon = faCertificate;
  coinIcon = faCoins;
  addIcon = faPlus;
  shopIcon = faShop;
  boxIcon = faBoxOpen;
  starIcon = faStar;
  exchangeIcon = faPuzzlePiece;

  statistics = [
    // {
    //   label: 'LABEL.TOTAL_MINUTES_LEARNED',
    //   icon: 'clock-circle',
    //   value: '232 minutes'
    // },
    // {
    //   label: 'LABEL.COURSES_COMPLETED',
    //   icon: 'check',
    //   value: 3
    // },
    {
      label: 'LABEL.CURRENT_RANK',
      icon: 'trophy',
      value: 'loading...',
    },
    // {
    //   label: 'LABEL.BOOSTER',
    //   icon: 'thunderbolt',
    //   value: 'loading...',
    // },
  ];
  constructor(
    private translate: TranslateService,
    private message: MessageService,
    private userService: UserService,
    private quests: QuestsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.listenToUser();
    this.listenToQuests();
  }

  listenToUser() {
    this.subscription$.add(
      this.userService.user$.subscribe((user) => {
        this.user = user;
        this.shardsList = Object.entries(user?.itemShards ?? {});

        if (!user) return;
        this.statistics = [
          {
            label: 'LABEL.CURRENT_RANK',
            icon: 'trophy',
            value: `#${user.statistic.rank}`,
          },
          // {
          //   label: 'LABEL.BOOSTER',
          //   icon: 'thunderbolt',
          //   value: `${Math.max(
          //     user.statistic.booster.boostGold,
          //     user.statistic.booster.boostExp
          //   )}%`,
          // },
        ];
      })
    );
  }

  onUpdateLevel(value: number) {
    if (!this.user) return;

    this.userService.updateUser({
      ...this.user,
      statistic: {
        ...this.user?.statistic,
        level: this.user?.statistic.level + value,
      },
    });
  }

  listenToQuests() {
    this.subscription$.add(
      this.quests.userQuests$.subscribe((quests) => {
        this.dailyQuests = [];
        quests.forEach((quest) => {
          if (!quest.isRewardClaimed) {
            let questValue = {};
            quest.questValue.forEach((q, idx) => {
              questValue = { ...questValue, [`${idx}`]: q };
            });
            this.dailyQuests.push({
              id: quest.id,
              quest: this.quests.getMissionLabel(quest.questType),
              questValue,
              current: quest.currentPoint,
              max: quest.pointToComplete,
              isCompleted: quest.isCompleted,
              isRewardClaimed: quest.isRewardClaimed,
            });
          }
        });
      })
    );
  }

  parseQuestReward(r: IRewardedQuestRes): string {
    return [
      r.expAdded > 0 && `${r.expAdded} exp`,
      r.goldAdded > 0 && `${r.goldAdded} gold`,
      // r.coupon && `Coupon: ${r.coupon}`,
      r.boosterAdded && `Booster: ${r.boosterAdded}`,
    ]
      .filter(Boolean)
      .join(', ');
  }

  onHandleStatOnClick(statLabel: string) {
    switch (statLabel) {
      case 'LABEL.CURRENT_RANK':
        this.router.navigate(['/leaderboard']);
        break;
    }
  }

  onClaimReward(id: string) {
    this.quests.onClaimQuest(id).subscribe((res) => {
      if (!res?.payload) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.FAILED_REWARD_QUEST')
        );
        return;
      }

      this.dailyQuests = this.dailyQuests.filter((q) => q.id !== id);
      this.message.addMessage(
        'success',
        this.translate.instant('MESSAGE.SUCCESS_REWARD_QUEST', {
          value: this.parseQuestReward(res.payload),
        })
      );

      if (this.user) {
        this.userService.updateUser({
          ...this.user,
          statistic: res.payload.statistic,
          mascotItem: res.payload.mascotItem,
        });
      }

      this.quests.updateQuestsList(
        this.quests.userQuests$.value.map((q) => {
          if (q.id === id) {
            return {
              ...q,
              isRewardClaimed: true,
            };
          }
          return q;
        })
      );
    });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
