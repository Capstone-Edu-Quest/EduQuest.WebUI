import { UserService } from './../../core/services/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';
import { Subscription } from 'rxjs';
import { IUser, IUserStat } from '../../shared/interfaces/user.interfaces';
import { WebRole } from '../../shared/enums/user.enum';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [fadeInOutAnimation],
})
export class ProfileComponent implements OnInit, OnDestroy {
  isInstructor: boolean = false;
  subscription$: Subscription = new Subscription();

  isStaffView: boolean = false;
  user: IUser | null = null;
  currentViewProfile: IUser | null = null

  constructor(private UserService: UserService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.listenToUser();
    this.initProfileByRoute();
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((user) => {
        this.user = user;
        this.isStaffView = user?.roleId === WebRole.STAFF;
      })
    );
  }

  initProfileByRoute() {
    const userId = this.route.snapshot.paramMap.get('userId');
    if(!userId) {
      this.currentViewProfile = this.user;
      this.isInstructor = this.user?.roleId === WebRole.INSTRUCTOR;
      return;
    }

    this.currentViewProfile = this.UserService.getUserById(userId);
    this.isInstructor = this.currentViewProfile?.roleId === WebRole.INSTRUCTOR;
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
