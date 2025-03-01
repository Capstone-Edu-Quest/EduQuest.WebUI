import { Component, Input, OnDestroy, type OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ThemeService } from '../../../core/services/theme.service';
import { IBarChartDataSet } from '../../../shared/interfaces/chart.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent implements OnInit, OnDestroy {
  @Input() labels: string[] = [];
  @Input() dataSet: IBarChartDataSet[] = [];

  subscription$: Subscription = new Subscription();

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
    labels: [],
    datasets: [],
  };

  constructor(
    private translate: TranslateService,
    private theme: ThemeService
  ) {}

  ngOnInit(): void {
    this.listenToTheme();
    this.listenToTranslate();
    this.updateChartLanguageAndTheme();
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
      labels: this.labels,
      datasets: this.dataSet.map((_dataset: IBarChartDataSet) => ({
        label: this.translate.instant(_dataset.label),
        data: [..._dataset.data],
        backgroundColor: currentTheme.theme[_dataset.backgroundColor],
        hoverBackgroundColor: currentTheme.theme[_dataset.hoverBackgroundColor],
        borderColor: currentTheme.theme[_dataset.borderColor],
        hoverBorderColor: currentTheme.theme[_dataset.hoverBorderColor],
        borderWidth: 1,
      })),
    };
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
