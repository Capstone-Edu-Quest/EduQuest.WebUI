import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  faBoxOpen,
  faCertificate,
  faCoins,
  faPlus,
  faShop,
} from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '../../../../core/services/modal.service';
import { Subscription } from 'rxjs';
import { IUser } from '../../../../shared/interfaces/user.interfaces';
import { UserService } from '../../../../core/services/user.service';
@Component({
  selector: 'app-home-statistics',
  templateUrl: './home-statistics.component.html',
  styleUrls: ['./home-statistics.component.scss'],
})
export class HomeStatisticsComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  user: IUser | null = null;

  currentStreak = 15; // days
  numTest = 1;

  dailyQuests = [
    {
      quest: '--no-api-response',
      current: -1,
      max: -1,
    },
    {
      quest: '--no-api-response',
      current: -1,
      max: -1,
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
      value: '--no-api-response',
    },
    {
      label: 'LABEL.BOOSTER',
      icon: 'thunderbolt',
      value: '--no-api-response',
    },
  ];
  constructor(private modal: ModalService, private userService: UserService) {}

  ngOnInit() {
    this.listenToUser();
  }

  listenToUser() {
    this.subscription$.add(
      this.userService.user$.subscribe((user) => {
        this.user = user;
      })
    );
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
