import { Component, Input, OnDestroy, type OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartData, ChartOptions, RadialLinearScaleOptions } from 'chart.js';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { IRadarChartDataSet } from '../../../shared/interfaces/chart.interface';

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

    type themeType = keyof typeof currentTheme.theme;
    this.chartData.datasets = this.dataSet.map((_dataset: IRadarChartDataSet) => {
      if(!_dataset.isUseThemeColor) {
        return _dataset;
      }
      return {
        label: _dataset.label,
        data: _dataset.data,
        backgroundColor: currentTheme.theme[_dataset.backgroundColor as themeType],
        borderColor: currentTheme.theme[_dataset.borderColor as themeType],
        pointBackgroundColor: currentTheme.theme[_dataset.pointBackgroundColor as themeType],
        pointBorderColor: currentTheme.theme[_dataset.pointBorderColor as themeType],
        pointHoverBackgroundColor: currentTheme.theme[_dataset.pointHoverBackgroundColor as themeType],
        pointHoverBorderColor: currentTheme.theme[_dataset.pointHoverBorderColor as themeType],
      };
    })
    this.chartData.labels = this.labels;

    console.log(this.chartData);
  }

  ngOnDestroy(): void { 
    this.subscription$.unsubscribe();
  }

}
