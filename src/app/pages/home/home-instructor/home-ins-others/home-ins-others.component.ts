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
import { PlatformService } from '@/src/app/core/services/platform.service';

@Component({
  selector: 'app-home-ins-others',
  templateUrl: './home-ins-others.component.html',
  styleUrl: './home-ins-others.component.scss',
})
export class HomeInsOthersComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  subscription$: Subscription = new Subscription();
  notis: INotification[] = [];

  isChartReady: boolean = false;

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
    private platform: PlatformService
  ) {}
  ngOnInit(): void {
    this.listenToNotification();
    this.initChart();
  }

  initChart() {
    this.labels = [];
    this.chartDataSet[0].data = [];
    this.isChartReady = false;

    this.platform.getInstructorHomeStatistics().subscribe((res) => {
      if (!res?.payload) return;
      const stat = res.payload as any;

      (stat.topCourses ?? []).forEach((_c: any) => {
        this.labels.push(_c.title);
        this.chartDataSet[0].data.push(_c.learnerCount);
      });

      this.isChartReady = true;
    });
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
