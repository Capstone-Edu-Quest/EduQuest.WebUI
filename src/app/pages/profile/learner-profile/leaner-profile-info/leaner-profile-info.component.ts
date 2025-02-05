import { Subscription } from 'rxjs';
import { UserService } from './../../../../core/services/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IUser, IUserStat } from '../../../../shared/interfaces/UserInterfaces';

@Component({
  selector: 'app-leaner-profile-info',
  templateUrl: './leaner-profile-info.component.html',
  styleUrls: ['./leaner-profile-info.component.scss'],
})
export class LeanerProfileInfoComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();
  user: IUser | null = null;

  statItems = [
    {
      icon: 'trophy',
      label: 'LABEL.RANK',
      value: '#1',
    },
    {
      icon: 'fire',
      label: 'LABEL.HIGHEST_LEARNING_STREAK',
      value: '15 days',
    },
    {
      icon: 'clock-circle',
      label: 'LABEL.TOTAL_LEARNING_TIME',
      value: '232 minutes',
    },
    {
      icon: 'book',
      label: 'LABEL.TOTAL_LEARNING_COURSES',
      value: '3 courses',
    },
    {
      icon: 'heart',
      label: 'LABEL.FAVOURITE_TOPICS',
      value: 'Reacts, Angular, Vue',
    },
  ];

  constructor(private UserService: UserService) {}

  ngOnInit() {
    this.listenToUser();
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((user) => {
        this.user = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
