import { Component, OnDestroy, type OnInit } from '@angular/core';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import { INotification } from '../../../../shared/interfaces/others.interfaces';

@Component({
  selector: 'app-home-ins-others',
  templateUrl: './home-ins-others.component.html',
  styleUrl: './home-ins-others.component.scss',
})
export class HomeInsOthersComponent implements OnInit, OnDestroy {

  subscription$: Subscription = new Subscription();
  notis: INotification[] = [];

  bellIcon = faBell;

  constructor(private notification: NotificationService) {}
  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
