import { Component, OnDestroy, ViewChild, type OnInit } from '@angular/core';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import { INotification } from '../../../../shared/interfaces/others.interfaces';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ThemeService } from '../../../../core/services/theme.service';
import { BaseChartDirective } from 'ng2-charts';
import { TranslateService } from '@ngx-translate/core';
import { IBarChartDataSet } from '../../../../shared/interfaces/chart.interface';

@Component({
  selector: 'app-home-ins-others',
  templateUrl: './home-ins-others.component.html',
  styleUrl: './home-ins-others.component.scss',
})
export class HomeInsOthersComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  subscription$: Subscription = new Subscription();
  notis: INotification[] = [];

  bellIcon = faBell;

  // Chart
  labels: string[] = [
    'ReactJS',
    'Typescript for beginner',
    'NodeJS',
    'C# .Net Fundamentals',
  ];

  chartDataSet: IBarChartDataSet[] = [
    {
      label: 'LABEL.LEARNERS',
      data: [50, 75, 110, 90, 130],
    },
  ];

  constructor(
    private notification: NotificationService,
    private theme: ThemeService,
    private translate: TranslateService
  ) {}
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
