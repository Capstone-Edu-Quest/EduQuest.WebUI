import { Component, Input, OnInit } from '@angular/core';
import {
  getDayByDates,
  getNumberOfDatesInMonth,
  handleCastDateString,
  onAddZeroToTime,
  onGetLabelByMonth,
} from '../../../../core/utils/time.utils';
import { IProfile, IUser } from '../../../../shared/interfaces/user.interfaces';

@Component({
  selector: 'app-learning-heatmap',
  templateUrl: './learning-heatmap.component.html',
  styleUrls: ['./learning-heatmap.component.scss'],
})
export class LearningHeatmapComponent implements OnInit {
  @Input('user') user: IProfile | null = null;

  heatmapDates: any[] = [];
  learningData: { date: string; count: number }[] = [];
  constructor() {}

  ngOnInit() {
    this.initFormattedValues();
    this.initHeatmap();
  }

  initFormattedValues() {
    this.learningData = [];
    this.user?.learningData.forEach((data) => {
      const date = new Date(data.date);
      const formattedDate = `${String(date.getDate()).padStart(
        2,
        '0'
      )}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

      this.learningData.push({ date: formattedDate, count: data.count });
    });
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
        const fullDate = `${onAddZeroToTime(i)}/${onAddZeroToTime(
          month + 1
        )}/${currentYear}`;
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
    if (minute < 15) return {};

    // 30 - 59
    if (minute < 30) {
      return { background: 'var(--brand-02)' };
    }

    if (minute < 50) {
      return { background: 'var(--brand-05)' };
    }

    if (minute < 70) {
      return { background: 'var(--brand)' };
    }

    // >= 120
    return { background: 'var(--brand-focused)' };
  }

  getDateNumber(fullDate: string) {
    return handleCastDateString(fullDate);
  }
}
