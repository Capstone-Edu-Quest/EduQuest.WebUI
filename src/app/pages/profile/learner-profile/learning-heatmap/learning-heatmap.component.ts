import { Component, OnInit } from '@angular/core';
import {
  getDayByDates,
  getNumberOfDatesInMonth,
  onGetLabelByMonth,
} from '../../../../core/utils/time.utils';

@Component({
  selector: 'app-learning-heatmap',
  templateUrl: './learning-heatmap.component.html',
  styleUrls: ['./learning-heatmap.component.scss'],
})
export class LearningHeatmapComponent implements OnInit {
  heatmapDates: any[] = [];
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
        const fullDate = `${i}/${month + 1}/${currentYear}`;
        days[currentDateDay].push(fullDate);
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

      _months[month] = days
    }

    this.heatmapDates = _months;
  }

  getMonthLabel(month: number) {
    return onGetLabelByMonth(month, true);
  }
}
