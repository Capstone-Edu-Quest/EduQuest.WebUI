import { Component, Input, OnDestroy, type OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartData, ChartOptions, RadialLinearScaleOptions } from 'chart.js';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { IRadarChartDataSet } from '../../../shared/interfaces/chart.interface';
import { colorsSet } from '../../../shared/themes/darkTheme';

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrl: './radar-chart.component.scss',
})
export class RadarChartComponent implements OnInit, OnDestroy {
  @Input() labels: string[] = [];
  @Input() dataSet: IRadarChartDataSet[] = [];

  subscription$: Subscription = new Subscription();

  chartCfg: ChartOptions = {
    responsive: true,
    scales: {
      r: {
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.5)',
        },
        ticks: {
          backdropColor: 'transparent',
          color: '#fff',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#FFFFFF',
        },
      },
      tooltip: {
        backgroundColor: '#141210',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
      },
    },
  };

  chartData: ChartData<'radar'> = {
    labels: [],
    datasets: []
  }

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

    this.chartCfg = {
      ...this.chartCfg,
      scales: {
        r: {
          ...this.chartCfg.scales!['r'],
          grid: {
            color: currentTheme.theme['--quaternary-text'],
          },
          ticks: {
            backdropColor: 'transparent',
            color: currentTheme.theme['--primary-text'],
          },
          pointLabels: {
            color: currentTheme.theme['--primary-text'], // ✅ This sets the corner text color (labels)
          },
          angleLines: {
            color: currentTheme.theme['--tertiary-text'],
          },
        } as RadialLinearScaleOptions,
      },
      plugins: {
        ...this.chartCfg.plugins,
        legend: {
          ...this.chartCfg.plugins!.legend,
          labels: {
            color: currentTheme.theme['--primary-text'],
          },
        },
        tooltip: {
          backgroundColor: currentTheme.theme['--tertiary-bg'],
          titleColor: currentTheme.theme['--primary-text'],
          bodyColor: currentTheme.theme['--secondary-text'],
        },
      },
    };

    this.chartData.datasets = this.dataSet.map((_dataset: IRadarChartDataSet, i) => {
      return {
        label: _dataset.label,
        data: _dataset.data,
        backgroundColor: currentTheme.theme[colorsSet[i]],
        borderColor: currentTheme.theme[colorsSet[i]],
        pointBackgroundColor: currentTheme.theme[colorsSet[i]],
        pointBorderColor: currentTheme.theme[colorsSet[i]],
        pointHoverBackgroundColor: currentTheme.theme[colorsSet[i]],
        pointHoverBorderColor: currentTheme.theme[colorsSet[i]],
      };
    })
    this.chartData.labels = this.labels;
  }

  ngOnDestroy(): void { 
    this.subscription$.unsubscribe();
  }

}
