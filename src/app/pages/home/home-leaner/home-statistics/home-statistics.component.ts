import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  faBoxOpen,
  faCertificate,
  faCoins,
  faPlus,
  faShop,
} from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '../../../../core/services/modal.service';

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

  levelIcon = faCertificate;
  coinIcon = faCoins;
  addIcon = faPlus;
  shopIcon = faShop;
  boxIcon = faBoxOpen;

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
  constructor(private modal: ModalService) {}

  ngOnInit() {}
}
