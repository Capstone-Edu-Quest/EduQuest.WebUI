import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-statistics',
  templateUrl: './home-statistics.component.html',
  styleUrls: ['./home-statistics.component.scss'],
})
export class HomeStatisticsComponent implements OnInit {
  currentStreak = 15; // days
  numTest = 1;

  dailyQuests = [
    {
      quest: 'Study 30 minutes',
      current: 18,
      max: 30,
    },
    {
      quest: 'Do 2 quizzes',
      current: 0,
      max: 2,
    },
  ];

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
      value: '#1',
    },
    {
      label: 'LABEL.BOOSTER',
      icon: 'thunderbolt',
      value: `0% exp | 0% gold`,
    },
  ];
  constructor() {}

  ngOnInit() {
  
  }

}
