import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ICourseOverview } from '../../../shared/interfaces/course.interfaces';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../../core/services/user.service';
import { Subscription } from 'rxjs';
import {
  IProfile,
  IUser,
  IUserStat,
} from '../../../shared/interfaces/user.interfaces';
import { Router } from '@angular/router';
import { ChatService } from '../../../core/services/chat.service';
import { IParticipant } from '@/src/app/shared/interfaces/others.interfaces';
@Component({
  selector: 'app-instructor-profile',
  templateUrl: './instructor-profile.component.html',
  styleUrls: ['./instructor-profile.component.scss'],
})
export class InstructorProfileComponent implements OnInit, OnDestroy {
  @Input('user') user: IProfile | null = null;
  @Input('isStaffView') isStaffView: boolean = false;

  subscription$: Subscription = new Subscription();

  currentUser: IUser | null = null;

  sampleCourses: ICourseOverview[] = [];
  star = faStar;

  constructor(private chat: ChatService, private userService: UserService) {}

  ngOnInit() {
    this.listenToUser();
  }

  listenToUser() {
    this.subscription$.add(
      this.userService.user$.subscribe((u) => (this.currentUser = u))
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  onSendMessage() {
    if (!this.user || !this.userService.user$.value) return;

    const participants: IParticipant[] = [
      {
        id: this.user.id,
        name: this.user.username,
        avatar: this.user.avatarUrl,
      },
      {
        id: this.userService.user$.value.id,
        name: this.userService.user$.value.username,
        avatar: this.userService.user$.value.avatarUrl,
      },
    ];

    this.chat.handleSendMessage(participants[0], participants[1]);
  }
}
