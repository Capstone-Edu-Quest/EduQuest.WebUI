import { Component, Input, OnInit } from '@angular/core';
import {
  getDayByDates,
  getNumberOfDatesInMonth,
  handleCastDateString,
  onAddZeroToTime,
  onGetLabelByMonth,
} from '../../../../core/utils/time.utils';
import { IUser } from '../../../../shared/interfaces/user.interfaces';

@Component({
  selector: 'app-learning-heatmap',
  templateUrl: './learning-heatmap.component.html',
  styleUrls: ['./learning-heatmap.component.scss'],
})
export class LearningHeatmapComponent implements OnInit {
  @Input('user') user: IUser | null = null;

  heatmapDates: any[] = [];
  learningData = [
    { date: '10/02/2025', count: 95 },
    { date: '15/04/2025', count: 42 },
    { date: '23/03/2025', count: 19 },
    { date: '01/06/2025', count: 27 },
    { date: '19/05/2025', count: 33 },
    { date: '07/09/2025', count: 21 },
    { date: '18/11/2025', count: 66 },
    { date: '04/07/2025', count: 30 },
    { date: '26/12/2025', count: 46 },
    { date: '12/01/2025', count: 123 },
    { date: '28/03/2025', count: 35 },
    { date: '06/02/2025', count: 23 },
    { date: '16/08/2025', count: 41 },
    { date: '22/10/2025', count: 38 },
    { date: '03/11/2025', count: 29 },
    { date: '20/05/2025', count: 221 },
    { date: '14/09/2025', count: 34 },
    { date: '08/12/2025', count: 19 },
    { date: '11/04/2025', count: 31 },
    { date: '25/06/2025', count: 43 },
    { date: '02/10/2025', count: 40 },
    { date: '17/07/2025', count: 28 },
  ];
  constructor() {}

  ngOnInit() {
    this.initHeatmap();
  }

  initHeatmap() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const datesOfMonths = getNumberOfDatesInMonth(currentYear);

    // Array to hold weeks (0 = Jan)
    const _months: any[] = JSON.parse(JSON.stringify(Array(12).fill([])));

    for (let month = 0; month < 12; month++) {
      const days: any[] = JSON.parse(JSON.stringify(Array(7).fill([])));

      // Init days (null) before date 1
      const dateOneDay = getDayByDates(1, month, currentYear);
      const datesNeeded = 7 - (7 - dateOneDay);
      for (let i = 0; i < datesNeeded; i++) {
        days[i].push(null);
      }

      // Init days (1 - end)
      for (let i = 1; i <= datesOfMonths[month]; i++) {
        const currentDateDay = getDayByDates(i, month, currentYear);
        const fullDate = `${onAddZeroToTime(i)}/${onAddZeroToTime(month + 1)}/${currentYear}`;
        const learningTime = this.learningData.find(
          (ld) => ld.date === fullDate
        );
        const data = {
          fullDate,
          time: learningTime ? learningTime.count : 0, // minutes
        };

        days[currentDateDay].push(data);
      }

      // Init days (null) after last date
      const lastDateDay = getDayByDates(
        datesOfMonths[month],
        month,
        currentYear
      );
      for (let i = days.length - 1; i > lastDateDay; i--) {
        days[i].push(null);
      }

      _months[month] = days;
    }

    this.heatmapDates = _months;
  }

  getMonthLabel(month: number) {
    return onGetLabelByMonth(month, true);
  }

  onGetColorByTime(minute: number) {
    // 0 - 30
    if (minute < 30) return {};

    // 30 - 59
    if (minute < 60) {
      return { background: 'var(--brand-02)' };
    }

    if (minute < 90) {
      return { background: 'var(--brand-05)' };
    }

    if (minute < 120) {
      return { background: 'var(--brand)' };
    }

    // >= 120
    return { background: 'var(--brand-focused)' };
  }

  getDateNumber(fullDate: string) {
    return handleCastDateString(fullDate)
  }
}
