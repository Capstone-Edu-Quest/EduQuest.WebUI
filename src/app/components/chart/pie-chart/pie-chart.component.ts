import { Component, Input, OnDestroy, type OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { IPieChartDataSet } from '../../../shared/interfaces/chart.interface';
import { colorsSet, darkTheme } from '../../../shared/themes/darkTheme';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent implements OnInit, OnDestroy {
  @Input() isUseTranslate: boolean = false;
  @Input() labels: string[] | number[] = [];
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
      labels: this.labels.map((label) =>
        this.isUseTranslate ? this.translate.instant(label.toString()) : label
      ),
      datasets: this.dataSet.map((_dataset: IPieChartDataSet) => ({
        label: this.translate.instant(_dataset.label),
        data: [..._dataset.data],
        backgroundColor: _dataset.data.map(
          (color, i) => currentTheme.theme[colorsSet[i]]
        ),
        hoverBackgroundColor: _dataset.data.map(
          (color, i) => currentTheme.theme[colorsSet[i]]
        ),
        borderColor: currentTheme.theme['--brand-05'],
        hoverBorderColor: currentTheme.theme['--alert'],
        borderWidth: 1,
      })),
    };
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
