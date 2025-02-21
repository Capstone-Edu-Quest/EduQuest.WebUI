import { Component, type OnInit } from '@angular/core';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowRight,
  faCaretDown,
  faCaretUp,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { getNumberOfDatesInMonth } from '../../../core/utils/time.utils';

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

  datas = [
    {
      label: 'LABEL.TOTAL_REVENUE',
      compareToLabel: 'LABEL.TOTAL_REVENUE_LAST_YEAR',
      value: 1254,
      lastValue: null,
      // Formula (total this year/passed dates) / (total last year/last year dates)
    },
    {
      label: 'LABEL.REVENUE_THIS_MONTH',
      compareToLabel: 'LABEL.REVENUE_LAST_MONTH',
      value: 221,
      lastValue: 199,
      // Formula (total this month/passed dates) / (total last month/last month dates)
    },
    {
      label: 'LABEL.REVENUE_7_DAYS',
      compareToLabel: 'LABEL.REVENUE_LAST_7_DAYS',
      value: 25,
      lastValue: 26,
      // Formula (total this month/passed dates) / (total last month/last month dates)
    },
  ];

  percentagesValue: any = {};

  ngOnInit(): void {
    this.onInitPercentages();
  }

  onInitPercentages() {
    this.datas.forEach((data) => {
      this.percentagesValue[data.label] = this.calculatePercentages(
        data.value,
        data.lastValue,
        data.label
      ).toFixed(2);
    });
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
