import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-web-numeric',
  templateUrl: './home-web-numeric.component.html',
  styleUrls: ['./home-web-numeric.component.scss'],
})
export class HomeWebNumericComponent implements OnInit {
  items = [
    {
      title: 'LABEL.WEB_STATISTICS_ACTIVE_LEARNERS',
      value: (4512).toLocaleString(),
      unit: 'LABEL.WEB_STATISTICS_ACTIVE_LEARNERS_UNIT'
    },
    {
      title: 'LABEL.WEB_STATISTICS_DAILY_CHALLENGES',
      value: (99246).toLocaleString(),
      unit: 'LABEL.WEB_STATISTICS_ACTIVE_LEARNERS_UNIT'
    },
    {
      title: 'LABEL.WEB_STATISTICS_LEARNING_STREAK',
      value: (12).toLocaleString(),
      unit: 'LABEL.WEB_STATISTICS_LEARNING_STREAK_UNIT'
    },
    {
      title: 'LABEL.WEB_STATISTICS_COURSE_COMPLETION',
      value: (728).toLocaleString(),
      unit: 'LABEL.WEB_STATISTICS_COURSE_COMPLETION_UNIT'
    },
  ];
  constructor() {}

  ngOnInit() {}
}
