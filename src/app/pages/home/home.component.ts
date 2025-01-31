import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';
import { UserService } from '../../core/services/user.service';
import { IUser } from '../../shared/interfaces/UserInterfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeInOutAnimation],
})
export class HomeComponent implements OnInit, OnDestroy {
  user: IUser | null = null;
  subscription$: Subscription = new Subscription();

  constructor(public UserService: UserService) {}

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
