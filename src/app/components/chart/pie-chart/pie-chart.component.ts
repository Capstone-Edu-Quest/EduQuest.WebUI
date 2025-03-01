import { Component, Input, OnDestroy, type OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { IPieChartDataSet } from '../../../shared/interfaces/chart.interface';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent implements OnInit, OnDestroy {
  @Input() labels: string[] = [];
  @Input() dataSet: IPieChartDataSet[] = [];

  subscription$: Subscription = new Subscription();

  chartCfg: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true },
    },
  };

  chartData: ChartData<'pie'> = {
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

  updateChartLanguageAndTheme(): void {
    const currentTheme = this.theme.getCurrentTheme();
    if (!currentTheme) return;

    this.chartCfg = {
      ...this.chartCfg,
      plugins: {
        ...this.chartCfg?.plugins,
        legend: {
          ...this.chartCfg?.plugins?.legend,
          labels: { color: currentTheme.theme['--secondary-text'] },
        },
      },
    };

    this.chartData = {
      labels: this.labels,
      datasets: this.dataSet.map((_dataset: IPieChartDataSet) => ({
        label: this.translate.instant(_dataset.label),
        data: [..._dataset.data],
        backgroundColor: _dataset.backgroundColor.map((color) => currentTheme.theme[color]),
        hoverBackgroundColor: _dataset.hoverBackgroundColor.map((color) => currentTheme.theme[color]),
        borderColor: currentTheme.theme[_dataset.borderColor],
        borderWidth: 1,
      })),
    };
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
