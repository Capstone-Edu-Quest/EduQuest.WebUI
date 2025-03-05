import { FoxService } from './../../../../core/services/fox.service';
import { Subscription } from 'rxjs';
import { UserService } from './../../../../core/services/user.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IUser, IUserStat } from '../../../../shared/interfaces/user.interfaces';

@Component({
  selector: 'app-leaner-profile-info',
  templateUrl: './leaner-profile-info.component.html',
  styleUrls: ['./leaner-profile-info.component.scss'],
})
export class LeanerProfileInfoComponent implements OnInit, OnDestroy {
  @Input('isStaffView') isStaffView: boolean = false;
  @Input('user') user: IUser | null = null;
  
  subscription$: Subscription = new Subscription();

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

  constructor(private FoxService: FoxService) {}

  ngOnInit() {
    this.onUpdateFoxItems();
  }

  onUpdateFoxItems() {
    setTimeout(() => {
      console.log('init')
      if(!this.user) return;
      this.FoxService.tempEquipItem(this.user.mascotItem);
    }, 110);
  }

  ngOnDestroy(): void {
    this.FoxService.tempEquipItem(null);
    this.subscription$.unsubscribe();
  }
}
