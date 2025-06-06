import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { INotification } from '../../../shared/interfaces/others.interfaces';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar-noti',
  templateUrl: './navbar-noti.component.html',
  styleUrls: ['./navbar-noti.component.scss'],
})
export class NavbarNotiComponent implements OnInit, OnDestroy {
  notis: INotification[] = [];
  subscription$: Subscription = new Subscription();

  constructor(private notification: NotificationService, private router: Router) {}

  ngOnInit() {
    this.listenToNotification();
  }

  listenToNotification() {
    this.subscription$.add(
      this.notification.notification$.subscribe((noti) => {
        this.notis = noti;
      })
    );
  }

  calculateTimeAgo(time: string) {
    const now = new Date();
    const notiTime = new Date(time);

    const diffMs = Math.abs(
      new Date(now).getTime() - new Date(notiTime).getTime()
    );
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    return Math.floor(diffMinutes / 60);
  }

  onNavigate(url: string) {
    this.router.navigate([url]);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
