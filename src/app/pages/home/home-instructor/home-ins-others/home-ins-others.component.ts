import { Component, OnDestroy, ViewChild, type OnInit } from '@angular/core';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import { INotification } from '../../../../shared/interfaces/others.interfaces';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ThemeService } from '../../../../core/services/theme.service';
import { BaseChartDirective } from 'ng2-charts';
import { TranslateService } from '@ngx-translate/core';

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
  chartType: ChartType = 'bar';

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  chartData: ChartData<'bar'> = {
    labels: [
      'ReactJS',
      'Typescript for beginner',
      'NodeJS',
      'C# .Net Fundamentals',
    ],
    datasets: [
      {
        label: '',
        data: [50, 75, 110, 90, 130],
        borderWidth: 1,
      },
    ],
  };
  // -----

  constructor(
    private notification: NotificationService,
    private theme: ThemeService,
    private translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.listenToNotification();
    this.listenToTheme();
    this.listenToTranslate();
  }

  listenToNotification() {
    this.subscription$.add(
      this.notification.notification$.subscribe((noti) => {
        this.notis = noti;
      })
    );
  }

  listenToTheme() {
    this.subscription$.add(
      this.theme.currentTheme$.subscribe(() => {
        this.updateChartLanguageAndTheme();
      })
    );
  }

  listenToTranslate() {
    this.subscription$.add(
      this.translate.onLangChange.subscribe(() => {
        this.updateChartLanguageAndTheme();
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

  updateChartLanguageAndTheme() {
    const currentTheme = this.theme.getCurrentTheme();
    if (!currentTheme) return;

    const dataCfg = this.chartData.datasets[0];

    const gridColor = {
      grid: {
        color: currentTheme.theme['--quaternary-text'],
      },
      ticks: {
        color: currentTheme.theme['--secondary-text'],
      },
    };

    this.chartOptions = {
      ...this.chartOptions,
      plugins: {
        ...this.chartOptions?.plugins,
        legend: {
          ...this.chartOptions?.plugins?.legend,
          labels: { color: currentTheme.theme['--secondary-text'] },
        },
      },
      scales: {
        x: gridColor,
        y: gridColor,
      },
    };

    this.chartData = {
      ...this.chartData,
      datasets: [
        {
          ...dataCfg,
          label: this.translate.instant('LABEL.LEARNERS'),
          backgroundColor: currentTheme?.theme['--brand'],
          hoverBackgroundColor: currentTheme?.theme['--brand-hover'],
          borderColor: currentTheme?.theme['--brand-02'],
          hoverBorderColor: currentTheme?.theme['--brand-01'],
        },
      ],
    };
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
