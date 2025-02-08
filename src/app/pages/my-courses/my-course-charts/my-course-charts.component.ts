import { Component, OnDestroy, type OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType,
  RadialLinearScaleOptions,
} from 'chart.js';
import { darkTheme } from '../../../shared/themes/darkTheme';
import { ThemeService } from '../../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-course-charts',
  templateUrl: './my-course-charts.component.html',
  styleUrl: './my-course-charts.component.scss',
})
export class MyCourseChartsComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();
  // Total Course Chart
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
        label: this.translate.instant('LABEL.LEANERS'),
        data: [50, 75, 110, 120, 223],
        borderWidth: 1,
        borderColor: darkTheme['--brand-05'],
        pointBackgroundColor: darkTheme['--brand-hover'],
        pointBorderColor: darkTheme['--brand-light'],
        backgroundColor: darkTheme['--brand-05'],
      },
    ],
  };
  roundChartConfig: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true },
    },
  };
  leanerStatisticsChartData: ChartData<'pie'> = {
    labels: ['In Progress', 'Completed'],
    datasets: [
      {
        label: this.translate.instant('LABEL.LEANERS'),
        data: [50, 75],
        backgroundColor: [darkTheme['--brand'], darkTheme['--brand-light']],
        hoverBackgroundColor: [
          darkTheme['--brand'],
          darkTheme['--brand-light'],
        ],
        borderWidth: 1,
        borderColor: darkTheme['--brand-05'],
      },
    ],
  };
  ratingChartData: ChartData<'radar'> = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
      {
        label: '',
        data: [2, 4, 22, 82, 122],
        borderWidth: 1,
      },
    ],
  };

  radarChartOptions: ChartOptions = {
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
  topCoursesChartData: ChartData<'radar'> = {
    labels: ['Leaners', 'Rating (3.5 - 5)', 'Rating (1 - 3.5)'], // Labels for each axis
    datasets: [
      {
        label: 'ReactJS',
        data: [35, 120, 22], // Scores for each subject
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Fill color
        borderColor: 'rgba(255, 99, 132, 1)', // Border color
        pointBackgroundColor: 'rgba(255, 99, 132, 1)', // Points color
        pointBorderColor: '#fff', // Point border color
        pointHoverBackgroundColor: '#fff', // Hover background color
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)', // Hover border color
      },
      {
        label: 'Typescript',
        data: [70, 85, 44], // Scores for another student
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
      },
      {
        label: '.Net Fundamentals',
        data: [80, 90, 55], // Scores for each subject
        backgroundColor: 'rgba(187, 224, 155, 0.2)', // Fill color
        borderColor: '#bbe09b', // Border color
        pointBackgroundColor: '#bbe09b', // Points color
        pointBorderColor: '#fff', // Point border color
        pointHoverBackgroundColor: '#fff', // Hover background color
        pointHoverBorderColor: '#bbe09b', // Hover border color
      },
    ],
  };

  constructor(
    private translate: TranslateService,
    private theme: ThemeService
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

    // Config
    const gridColor = {
      grid: {
        color: currentTheme.theme['--quaternary-text'],
      },
      ticks: {
        color: currentTheme.theme['--secondary-text'],
      },
    };
    this.roundChartConfig = {
      ...this.roundChartConfig,
      plugins: {
        ...this.roundChartConfig?.plugins,
        legend: {
          ...this.roundChartConfig?.plugins?.legend,
          labels: { color: currentTheme.theme['--secondary-text'] },
        },
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
    this.radarChartOptions = {
      ...this.radarChartOptions,
      scales: {
        r: {
          ...this.radarChartOptions.scales!['r'],
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
        ...this.radarChartOptions.plugins,
        legend: {
          ...this.radarChartOptions.plugins!.legend,
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

    // Data
    this.totalCourseLeanerChartData = {
      ...this.totalCourseLeanerChartData,
      datasets: [
        {
          ...this.totalCourseLeanerChartData.datasets[0],
          label: this.translate.instant('LABEL.LEARNERS'),
          backgroundColor: currentTheme?.theme['--brand'],
          hoverBackgroundColor: currentTheme?.theme['--brand-hover'],
          borderColor: currentTheme?.theme['--brand'],
          hoverBorderColor: currentTheme?.theme['--brand-01'],
        },
      ],
    };
    this.leanerStatisticsChartData = {
      labels: [
        this.translate.instant('LABEL.IN_PROGRESS'),
        this.translate.instant('LABEL.COMPLETED'),
      ],
      datasets: [
        {
          ...this.leanerStatisticsChartData.datasets[0],
          backgroundColor: [
            currentTheme?.theme['--brand'],
            currentTheme?.theme['--brand-light'],
          ],
          hoverBackgroundColor: [
            currentTheme?.theme['--brand'],
            currentTheme?.theme['--brand-light'],
          ],
          borderColor: currentTheme?.theme['--brand-02'],
        },
      ],
    };
    this.ratingChartData = {
      ...this.ratingChartData,
      datasets: [
        {
          ...this.ratingChartData.datasets[0],
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
