import { UserService } from './../../core/services/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';
import { Subscription } from 'rxjs';
import { IUser, IUserStat } from '../../shared/interfaces/UserInterfaces';
import { WebRole } from '../../shared/enums/user.enum';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [fadeInOutAnimation],
})
export class ProfileComponent implements OnInit, OnDestroy {
  isInstructor: boolean = false;
  subscription$: Subscription = new Subscription();
  user: IUser | null = null;

  constructor(private UserService: UserService) {}

  ngOnInit() {
    this.listenToUser();
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((user) => {
        this.user = user;
        this.isInstructor = user?.roleId === WebRole.INSTRUCTOR;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
