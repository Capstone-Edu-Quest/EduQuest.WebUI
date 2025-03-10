import { Component, Input, OnDestroy, type OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ILineChartDataSet } from '../../../shared/interfaces/chart.interface';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { colorsSet } from '../../../shared/themes/darkTheme';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnInit, OnDestroy {
  @Input() labels: string[] | number[] = [];
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
      datasets: this.dataSet.map((_dataset: ILineChartDataSet, i) => ({
        label: this.translate.instant(_dataset.label),
        data: [..._dataset.data],
        backgroundColor: currentTheme.theme[colorsSet[i * 3]],
        borderColor:currentTheme.theme[colorsSet[i * 3]],
        pointBackgroundColor:currentTheme.theme[colorsSet[i * 3]],
        pointBorderColor: currentTheme.theme[colorsSet[i * 3]],
        borderWidth: 1,
      })),
    };
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
