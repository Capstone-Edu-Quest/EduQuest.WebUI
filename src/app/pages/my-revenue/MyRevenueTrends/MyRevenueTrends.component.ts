import { CurrencyExchangePipe } from './../../../core/pipes/currency.pipe';
import { Component, OnDestroy, type OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { darkTheme } from '../../../shared/themes/darkTheme';

@Component({
  selector: 'app-my-revenue-trends',
  templateUrl: './MyRevenueTrends.component.html',
  styleUrl: './MyRevenueTrends.component.scss',
})
export class MyRevenueTrendsComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  lineChartConfig: ChartConfiguration['options'] = {
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

  totalCourseLeanerChartData: ChartData<'line'> = {
    labels: ['Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025'],
    datasets: [
      {
        label: this.translate.instant('LABEL.REVENUE'),
        data: [1, 2, 3, 4, 5, 6],
        borderWidth: 1,
        borderColor: darkTheme['--brand-05'],
        pointBackgroundColor: darkTheme['--brand-hover'],
        pointBorderColor: darkTheme['--brand-light'],
        backgroundColor: darkTheme['--brand-05'],
      },
      {
        label: this.translate.instant('LABEL.TOTAL_SALES'),
        data: [1, 2, 3, 4, 5, 6],
        borderWidth: 1,
        borderColor: darkTheme['--brand-05'],
        pointBackgroundColor: darkTheme['--brand-hover'],
        pointBorderColor: darkTheme['--brand-light'],
        backgroundColor: darkTheme['--brand-05'],
      },
      {
        label: this.translate.instant('LABEL.TOTAL_REFUNDS'),
        data: [1, 2, 3, 4, 5, 6],
        borderWidth: 1,
        borderColor: darkTheme['--brand-05'],
        pointBackgroundColor: darkTheme['--brand-hover'],
        pointBorderColor: darkTheme['--brand-light'],
        backgroundColor: darkTheme['--brand-05'],
      },
    ],
  };

  sales = [170, 65, 780, 232, 522];
  refunds = [8, 5, 120, 24, 44];
  revenues = this.sales.map((val, index) => val - this.refunds[index]);

  constructor(
    private theme: ThemeService,
    private translate: TranslateService,
    private currency: CurrencyExchangePipe
  ) {}

  ngOnInit(): void {
    this.listenToTheme();
    this.listenToTranslate();
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

  updateChartLanguageAndTheme() {
    const currentTheme = this.theme.getCurrentTheme();
    if (!currentTheme) return;

    const gridColor = {
      grid: {
        color: currentTheme.theme['--quaternary-text'],
      },
      ticks: {
        color: currentTheme.theme['--secondary-text'],
      },
    };

    this.lineChartConfig = {
      ...this.lineChartConfig,
      plugins: {
        ...this.lineChartConfig?.plugins,
        legend: {
          ...this.lineChartConfig?.plugins?.legend,
          labels: { color: currentTheme.theme['--secondary-text'] },
        },
      },
      scales: {
        x: gridColor,
        y: { ...gridColor, beginAtZero: true },
      },
    };

    this.totalCourseLeanerChartData = {
      ...this.totalCourseLeanerChartData,
      datasets: [
        {
          ...this.totalCourseLeanerChartData.datasets[0],
          data: this.revenues.map((val: number) =>
            parseFloat(String(this.currency.transform(val)))
          ),
          label: this.translate.instant('LABEL.REVENUE_IN_UNIT', {
            unit: this.translate.instant('SIGNATURE.MONEY_VALUE', {
              value: '',
            }),
          }),
          backgroundColor: currentTheme?.theme['--brand'],
          hoverBackgroundColor: currentTheme?.theme['--brand-hover'],
          borderColor: currentTheme?.theme['--brand'],
          hoverBorderColor: currentTheme?.theme['--brand-01'],
        },
        {
          ...this.totalCourseLeanerChartData.datasets[0],
          data: this.sales.map((val: number) =>
            parseFloat(String(this.currency.transform(val)))
          ),
          label: this.translate.instant('LABEL.SALES_IN_UNIT', {
            unit: this.translate.instant('SIGNATURE.MONEY_VALUE', {
              value: '',
            }),
          }),
          backgroundColor: currentTheme?.theme['--stage-surface-done'],
          hoverBackgroundColor: currentTheme?.theme['--stage-body-done'],
          borderColor: currentTheme?.theme['--stage-surface-done'],
          hoverBorderColor: currentTheme?.theme['--stage-body-done'],
        },
        {
          ...this.totalCourseLeanerChartData.datasets[0],
          data: this.refunds.map((val: number) =>
            parseFloat(String(this.currency.transform(val)))
          ),
          label: this.translate.instant('LABEL.REFUNDS_IN_UNIT', {
            unit: this.translate.instant('SIGNATURE.MONEY_VALUE', {
              value: '',
            }),
          }),
          backgroundColor: currentTheme?.theme['--alert'],
          hoverBackgroundColor: currentTheme?.theme['--error'],
          borderColor: currentTheme?.theme['--alert'],
          hoverBorderColor: currentTheme?.theme['--error'],
        },
      ],
    };
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
