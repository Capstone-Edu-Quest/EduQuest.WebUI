import { Component, type OnInit } from '@angular/core';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowRight,
  faCaretDown,
  faCaretUp,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { getNumberOfDatesInMonth } from '../../../core/utils/time.utils';
import { PlatformService } from '@/src/app/core/services/platform.service';

@Component({
  selector: 'app-my-revenue-infos',
  templateUrl: './my-revenue-infos.component.html',
  styleUrl: './my-revenue-infos.component.scss',
})
export class MyRevenueInfosComponent implements OnInit {
  downIcon = faCaretDown;
  upIcon = faCaretUp;
  clockIcon = faClock;
  walletIcon = faWallet;
  arrowRightIcon = faArrowRight;

  datas: any[] = [];

  percentagesValue: any = {};

  pendingAmount: number = 0;
  availableAmount: number = 0;

  constructor(private platform: PlatformService) {}

  ngOnInit(): void {
    this.initRevenueInfo();
    // this.onInitPercentages();
  }

  initRevenueInfo() {
    this.datas = [
      {
        label: 'LABEL.TOTAL_REVENUE',
        compareToLabel: 'LABEL.TOTAL_REVENUE_LAST_YEAR',
        value: 0,
        changedPercent: 0,
        // Formula (total this year/passed dates) / (total last year/last year dates)
      },
      {
        label: 'LABEL.REVENUE_THIS_MONTH',
        compareToLabel: 'LABEL.REVENUE_LAST_MONTH',
        value: 0,
        changedPercent: 0,
        // Formula (total this month/passed dates) / (total last month/last month dates)
      },
      {
        label: 'LABEL.REVENUE_7_DAYS',
        compareToLabel: 'LABEL.REVENUE_LAST_7_DAYS',
        value: 0,
        changedPercent: 0,
        // Formula (total this month/passed dates) / (total last month/last month dates)
      },
    ];
    this.platform.getInstructorRevenueReport().subscribe((res) => {
      if (!res?.payload) return;
      const stat = res.payload as any;

      this.datas[0].value = stat?.totalRevenue;
      this.datas[0].changedPercent = stat?.totalRevenueChangePercent;

      this.datas[1].value = stat?.revenueThisMonth;
      this.datas[1].changedPercent = stat?.revenueThisMonthChangePercent;

      this.datas[2].value = stat?.revenue7Days;
      this.datas[2].changedPercent = stat?.revenue7DaysChangePercent;

      this.pendingAmount = Math.max(stat?.pendingBalance, 0);
      this.availableAmount = Math.max(stat?.availableBalance, 0);
    });
  }

  onInitPercentages() {
    // this.datas.forEach((data) => {
    //   this.percentagesValue[data.label] = this.calculatePercentages(
    //     data.value,
    //     data.lastValue,
    //     data.label
    //   ).toFixed(2);
    // });
  }

  calculatePercentages(
    thisTime: number | null,
    lastTime: number | null,
    unit: string
  ): number {
    if (!thisTime || !lastTime) return 0;

    const thisYear = new Date().getFullYear();
    const currentDate = new Date().getDate();
    const lastMonth = new Date().getMonth(); // thisMonth - 1

    let thisVal = thisTime,
      lastVal = lastTime;

    switch (unit.replace('LABEL.', '')) {
      case 'TOTAL_REVENUE':
        const lastYear = thisYear - 1;
        const lastYearDates = lastYear % 4 === 0 ? 366 : 365;
        const datesOfThisYear = getNumberOfDatesInMonth(thisYear);

        let totalDates = 0;
        for (let i = 1; i < lastMonth + 1; i++) {
          totalDates += datesOfThisYear[i];
        }
        totalDates += currentDate - 1;

        thisVal = thisTime / lastYearDates;
        lastVal = lastTime / totalDates;
        break;

      case 'REVENUE_THIS_MONTH':
        const datesInYear = getNumberOfDatesInMonth(thisYear);
        const lastMonthDate = datesInYear[lastMonth || 12];

        thisVal = thisTime / currentDate;
        lastVal = lastTime / lastMonthDate;
        break;

      case 'REVENUE_7_DAYS':
        break;
      default:
        return 0;
    }

    return ((thisVal - lastVal) / lastVal) * 100;
  }
}
