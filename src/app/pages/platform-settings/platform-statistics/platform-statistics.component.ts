import { Component, type OnInit } from '@angular/core';
import {
  faBarsProgress,
  faBoxOpen,
  faBoxesStacked,
  faCoins,
  faDolly,
  faGauge,
  faPaperPlane,
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

@Component({
  selector: 'app-platform-statistics',
  templateUrl: './platform-statistics.component.html',
  styleUrl: './platform-statistics.component.scss',
})
export class PlatformStatisticsComponent implements OnInit {
  levelExpBarChartDataSet: IBarChartDataSet[] = [
    {
      label: 'LABEL.USERS',
      data: [50, 75, 77, 53, 12, 50, 75, 77, 53, 12, 50, 75, 77, 53, 12],
    },
  ];

  questsLineChartDataSet: ILineChartDataSet[] = [
    {
      label: 'LABEL.COURSES_COMPLETION',
      data: [50, 75, 77, 53, 12, 60],
    },
  ];

  shopItemsPieChartDataSet: IPieChartDataSet[] = [
    {
      label: `LABEL.PURCHASED`,
      data: [553, 75, 99, 123, 75, 12],
    },
  ];

  sections = [
    {
      id: 'LEVEL_EXP',
      stats: [
        {
          id: 'TOTAL_EARNED_EXP',
          icon: faVials,
          value: (8392).toLocaleString(),
        },
        {
          id: 'AVERAGE_EARNED_EXP_DAY',
          icon: faVial,
          value: (222).toLocaleString(),
        },
        {
          id: 'TOTAL_EARNED_LEVELS',
          icon: faBarsProgress,
          value: (223).toLocaleString(),
        },
        {
          id: 'AVERAGE_LEVEL',
          icon: faGauge,
          value: (12).toLocaleString(),
        },
      ],
      graph: {
        title: 'LABEL.USERS_LEVEL',
        type: 'bar',
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        dataSets: this.levelExpBarChartDataSet,
      },
    },
    {
      id: 'QUESTS',
      stats: [
        {
          id: 'TOTAL_CREATED_QUESTS',
          icon: faScroll,
          value: (24).toLocaleString(),
        },
        {
          id: 'TOTAL_COMPLETED_QUESTS',
          icon: faStapler,
          value: (222).toLocaleString(),
        },
        {
          id: 'AVERAGE_COMPLETED_QUESTS_PER_USER',
          icon: faPaperPlane,
          value: (223).toLocaleString(),
        },
      ],
      graph: {
        title: 'LABEL.QUESTS_COMPLETION',
        type: 'line',
        labels: [
          'Oct 2024',
          'Nov 2024',
          'Dec 2024',
          'Jan 2025',
          'Feb 2025',
          'Mar 2025',
        ],
        dataSets: this.questsLineChartDataSet,
      },
    },
    {
      id: 'SHOP_ITEMS',
      stats: [
        {
          id: 'TOTAL_ITEMS_SOLD',
          icon: faBoxesStacked,
          value: (555).toLocaleString(),
        },
        {
          id: 'AVERAGE_ITEM_PER_USER',
          icon: faBoxOpen,
          value: (4).toLocaleString(),
        },
        {
          id: 'MOST_PURCHASED_ITEM',
          icon: faDolly,
          value: 'wings',
        },
        {
          id: 'TOTAL_GOLD_FROM_SALES',
          icon: faCoins,
          value: (2294).toLocaleString(),
        },
      ],
      graph: {
        title: 'LABEL.BEST_SALE_ITEMS',
        type: 'pie',
        labels: [
          'wings',
          'katana',
          'samurai hat',
          'apollos-shield',
          'gold-belt',
          '...',
        ],
        dataSets: this.shopItemsPieChartDataSet,
      },
    },
  ];

  ngOnInit(): void {}
}
