import { UserService } from 'src/app/core/services/user.service';
import { FoxService } from './../../../../core/services/fox.service';
import { Subscription } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IProfile, IUser } from '../../../../shared/interfaces/user.interfaces';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/core/services/chat.service';
import { IParticipant } from '@/src/app/shared/interfaces/others.interfaces';
@Component({
  selector: 'app-leaner-profile-info',
  templateUrl: './leaner-profile-info.component.html',
  styleUrls: ['./leaner-profile-info.component.scss'],
})
export class LeanerProfileInfoComponent implements OnInit, OnDestroy {
  @Input('isStaffView') isStaffView: boolean = false;
  @Input('user') user: IProfile | null = null;

  subscription$: Subscription = new Subscription();

  isUseTempEquipment: boolean = false;
  isViewingSelf: boolean = false;

  statItems = [
    {
      icon: 'trophy',
      label: 'LABEL.RANK',
      value: `#${this.user?.statistic.rank}`,
    },
    {
      icon: 'fire',
      label: 'LABEL.HIGHEST_LEARNING_STREAK',
      value: `${this.user?.statistics.longestStreak} days`,
    },
    {
      icon: 'clock-circle',
      label: 'LABEL.TOTAL_LEARNING_TIME',
      value: `${Math.ceil(Number(this.user?.statistics.totalLearningTime))} minutes`,
    },
    {
      icon: 'book',
      label: 'LABEL.TOTAL_LEARNING_COURSES',
      value: `${this.user?.statistics.totalLearningCourses} courses`,
    },
    {
      icon: 'heart',
      label: 'LABEL.FAVOURITE_TOPICS',
      value: `${this.user?.statistics.favoriteTopics ?? ''}`,
    },
  ];

  constructor(
    private FoxService: FoxService,
    private route: ActivatedRoute,
    private UserService: UserService,
    private chat: ChatService
  ) {}

  ngOnInit() {
    this.listenToUser();
    this.onInitFoxByOtherProfile();
    this.initStats();
  }

  initStats() {
    this.statItems = [
      {
        icon: 'trophy',
        label: 'LABEL.RANK',
        value: `#${this.user?.statistics.rank}`,
      },
      {
        icon: 'fire',
        label: 'LABEL.HIGHEST_LEARNING_STREAK',
        value: `${this.user?.statistics.longestStreak} days`,
      },
      {
        icon: 'clock-circle',
        label: 'LABEL.TOTAL_LEARNING_TIME',
        value: `${Math.ceil(Number(this.user?.statistics.totalLearningTime))} minutes`,
      },
      {
        icon: 'book',
        label: 'LABEL.TOTAL_LEARNING_COURSES',
        value: `${this.user?.statistics.totalLearningCourses} courses`,
      },
      {
        icon: 'heart',
        label: 'LABEL.FAVOURITE_TOPICS',
        value: `${this.user?.statistics.favoriteTopics ?? '-'}`,
      },
    ];
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((user) => {
        this.isViewingSelf = user?.id === this.user?.id;
      })
    );
  }

  onInitFoxByOtherProfile() {
    const userId = this.route.snapshot.paramMap.get('userId');
    if (!userId) return;

    this.onUpdateFoxItems();
    this.isUseTempEquipment = true;
  }

  onUpdateFoxItems() {
    setTimeout(() => {
      if (!this.user) return;
      console.log(this.user.equippedItems)
      this.FoxService.tempEquipItem(this.user.equippedItems);
    }, 110);
  }

  onSendMessage() {
    if (!this.user || !this.UserService.user$.value) return;

    const participants: IParticipant[] = [
      {
        id: this.user.id,
        name: this.user.username,
        avatar: this.user.avatarUrl,
      },
      {
        id: this.UserService.user$.value.id,
        name: this.UserService.user$.value.username,
        avatar: this.UserService.user$.value.avatarUrl,
      },
    ];

    this.chat.handleSendMessage(participants[0], participants[1]);
  }

  ngOnDestroy(): void {
    this.isUseTempEquipment && this.FoxService.tempEquipItem(null);
    this.subscription$.unsubscribe();
  }
}
