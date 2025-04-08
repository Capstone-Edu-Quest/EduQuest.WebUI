import { map } from 'rxjs/operators';
import { Component, type OnInit } from '@angular/core';
import {
  faBarsProgress,
  faBoxOpen,
  faBoxesStacked,
  faCheckDouble,
  faCoins,
  faDolly,
  faGauge,
  faGift,
  faGraduationCap,
  faPaperPlane,
  faRotate,
  faSackXmark,
  faSchool,
  faScroll,
  faStapler,
  faVial,
  faVials,
} from '@fortawesome/free-solid-svg-icons';
import {
  IBarChartDataSet,
  ILineChartDataSet,
  IPieChartDataSet,
} from '../../../shared/interfaces/chart.interface';
import { PlatformService } from '@/src/app/core/services/platform.service';

@Component({
  selector: 'app-platform-statistics',
  templateUrl: './platform-statistics.component.html',
  styleUrl: './platform-statistics.component.scss',
})
export class PlatformStatisticsComponent implements OnInit {
  isLoaded: boolean = false;

  questsLineChartDataSet: ILineChartDataSet[] = [];

  shopItemsPieChartDataSet: IPieChartDataSet[] = [];

  subscriptionsLineChartDataSet: ILineChartDataSet[] = [];

  couponsBarChartDataSet: IBarChartDataSet[] = [];

  sections: any[] = [];

  constructor(private platform: PlatformService) {}

  ngOnInit(): void {
    this.listenToPlatformStats();
  }

  listenToPlatformStats() {
    this.platform.platformStats$.subscribe((data) => {
      if (!data) return;

      this.sections = [
        {
          id: 'LEVEL_EXP',
          stats: [
            {
              id: 'TOTAL_EARNED_EXP',
              icon: faVials,
              value: data.levelExp.totalEarnedExp.toLocaleString(),
            },
            {
              id: 'AVERAGE_EARNED_EXP_DAY',
              icon: faVial,
              value: data.levelExp.avarageExpPerDay.toLocaleString(),
            },
            {
              id: 'TOTAL_EARNED_LEVELS',
              icon: faBarsProgress,
              value: data.levelExp.totalEarnedLevel.toLocaleString(),
            },
            {
              id: 'AVERAGE_LEVEL',
              icon: faGauge,
              value: data.levelExp.averageLevel.toLocaleString(),
            },
          ],
          graph: {
            title: 'LABEL.USERS_LEVEL',
            type: 'bar',
            labels: data.levelExp.userLevels.map((l) => l.level),
            dataSets: [
              {
                label: 'LABEL.USERS',
                data: data.levelExp.userLevels.map((l) => l.count),
              },
            ],
          },
        },
        {
          id: 'QUESTS',
          stats: [
            {
              id: 'TOTAL_CREATED_QUESTS',
              icon: faScroll,
              value: data.quests.totalCreatedQuests.toLocaleString(),
            },
            {
              id: 'TOTAL_COMPLETED_QUESTS',
              icon: faStapler,
              value: data.quests.totalCompletedQuests.toLocaleString(),
            },
            {
              id: 'AVERAGE_COMPLETED_QUESTS_PER_USER',
              icon: faPaperPlane,
              value: data.quests.averageCompletedQuestsPerUser.toLocaleString(),
            },
          ],
          graph: {
            title: 'LABEL.QUESTS_COMPLETION',
            type: 'line',
            labels: data.quests.questCompletion.map((q) => q.date),
            dataSets: [
              {
                label: 'LABEL.QUESTS_COMPLETION',
                data: data.quests.questCompletion.map((q) => q.count),
              },
            ],
          },
        },
        {
          id: 'SHOP_ITEMS',
          stats: [
            {
              id: 'TOTAL_ITEMS_SOLD',
              icon: faBoxesStacked,
              value: data.shopItems.totalItemSold.toLocaleString(),
            },
            {
              id: 'AVERAGE_ITEM_PER_USER',
              icon: faBoxOpen,
              value: data.shopItems.averageItemsPerUser.toLocaleString(),
            },
            {
              id: 'MOST_PURCHASED_ITEM',
              icon: faDolly,
              value: data.shopItems.mostPurchasedItem,
            },
            {
              id: 'TOTAL_GOLD_FROM_SALES',
              icon: faCoins,
              value: data.shopItems.totalGoldFromSales.toLocaleString(),
            },
          ],
          graph: {
            title: 'LABEL.BEST_SALE_ITEMS',
            type: 'pie',
            labels: data.shopItems.bestSaleItems.map((i) => i.name),
            dataSets: [
              {
                label: `LABEL.PURCHASED`,
                data: data.shopItems.bestSaleItems.map((i) => i.count),
              },
            ],
          },
        },
        {
          id: 'PRICING',
          stats: [
            {
              id: 'INSTRUCTOR_PREMIUM_SOLD',
              icon: faGraduationCap,
              value: (data.pricing.instructorProSold ?? 0).toLocaleString(),
            },
            {
              id: 'LEARNER_PREMIUM_SOLD',
              icon: faSchool,
              value: (data.pricing.learnerProSold ?? 0).toLocaleString(),
            },
            {
              id: 'RENEW_RATE',
              icon: faRotate,
              value: (data.pricing.renewRate ?? 0) + '%',
            },
          ],
          graph: {
            title: 'LABEL.SUBSCRIPTIONS',
            type: 'line',
            labels: data.pricing.subscription.map((s) => s.date),
            dataSets: [
              {
                label: 'LABEL.SUBSCRIPTIONS',
                data: data.pricing.subscription.map((s) => s.count),
              },
            ],
          },
        },
        {
          id: 'COUPONS',
          stats: [
            {
              id: 'CREATED_COUPONS',
              icon: faGift,
              value: data.coupons.createdCoupons.toLocaleString(),
            },
            {
              id: 'EXPIRED_COUPONS',
              icon: faSackXmark,
              value: data.coupons.expiredCoupons.toLocaleString(),
            },
            {
              id: 'REDEEMED_COUPONS',
              icon: faCheckDouble,
              value: data.coupons.redeemedTimes.toLocaleString(),
            },
          ],
          graph: {
            title: '',
            type: 'bar',
            labels: data.coupons.graphData.map((c) => c.date),
            dataSets: [
              {
                label: 'LABEL.REDEEMED_COUPONS',
                data: data.coupons.graphData.map((c) => c.redeemTimes),
              },
              {
                label: 'LABEL.NEW_COUPONS',
                data: data.coupons.graphData.map((c) => c.newCoupons),
              },
              {
                label: 'LABEL.EXPIRED_COUPONS',
                data: data.coupons.graphData.map((c) => c.expiredCoupons),
              },
            ],
          },
        },
      ];

      this.isLoaded = true;
    });
  }
}
