import { Component, Input, OnDestroy, type OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ILineChartDataSet } from '../../../shared/interfaces/chart.interface';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnInit, OnDestroy {
  @Input() labels: string[] = [];
  @Input() dataSet: ILineChartDataSet[] = [];

  subscription$: Subscription = new Subscription();

  chartType: ChartType = 'line';

  chartConfig: ChartConfiguration['options'] = {
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

  chartDataset: ChartData<'line'> = {
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

    this.chartConfig = {
      ...this.chartConfig,
      plugins: {
        ...this.chartConfig?.plugins,
        legend: {
          ...this.chartConfig?.plugins?.legend,
          labels: { color: currentTheme.theme['--secondary-text'] },
        },
      },
      scales: {
        x: gridColor,
        y: { ...gridColor, beginAtZero: true },
      },
    };

    this.chartDataset = {
      labels: this.labels,
      datasets: this.dataSet.map((_dataset: ILineChartDataSet) => ({
        label: this.translate.instant(_dataset.label),
        data: [..._dataset.data],
        backgroundColor: currentTheme.theme[_dataset.backgroundColor],
        borderColor: currentTheme.theme[_dataset.borderColor],
        pointBackgroundColor: currentTheme.theme[_dataset.pointBackgroundColor],
        pointBorderColor: currentTheme.theme[_dataset.pointBorderColor],
        borderWidth: 1,
      })),
    };
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
