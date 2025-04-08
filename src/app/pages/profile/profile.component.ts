import { UserService } from './../../core/services/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';
import { Subscription } from 'rxjs';
import { IProfile, IUser, IUserStat } from '../../shared/interfaces/user.interfaces';
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
  currentViewProfile: IProfile | null = null;

  constructor(
    private UserService: UserService,
    private route: ActivatedRoute
  ) {}

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
    const userId = this.route.snapshot.paramMap.get('userId') ?? this.user?.id;
    if (!userId) return;

    this.UserService.getUserProfile(userId).subscribe((res) => {
      if (!res?.payload) return;

      this.currentViewProfile = res.payload;
      this.isInstructor = Number(res.payload.roleId) === WebRole.INSTRUCTOR;
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
