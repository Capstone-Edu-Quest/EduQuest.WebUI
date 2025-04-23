import { CurrencyExchangePipe } from './../../../core/pipes/currency.pipe';
import { Component, OnDestroy, type OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { darkTheme } from '../../../shared/themes/darkTheme';
import { ILineChartDataSet } from '@/src/app/shared/interfaces/chart.interface';
import { CoursesService } from '@/src/app/core/services/courses.service';

@Component({
  selector: 'app-my-revenue-trends',
  templateUrl: './MyRevenueTrends.component.html',
  styleUrl: './MyRevenueTrends.component.scss',
})
export class MyRevenueTrendsComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  chartIsReady: boolean = false;

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

  lineChartsLabel: string[] = [];
  dataSet: ILineChartDataSet[] = [
    {
      label: this.translate.instant('LABEL.REVENUE'),
      data: [170, 65, 780, 232, 522],
    },
    {
      label: this.translate.instant('LABEL.TOTAL_SALES'),
      data: [1, 2, 3, 4, 5, 6],
    },
    {
      label: this.translate.instant('LABEL.TOTAL_REFUNDS'),
      data: [1, 2, 3, 4, 5, 6],
    },
  ];

  sales = [170, 65, 780, 232, 522];
  refunds = [8, 5, 120, 24, 44];
  revenues = this.sales.map((val, index) => val - this.refunds[index]);

  constructor(
    private theme: ThemeService,
    private translate: TranslateService,
    private currency: CurrencyExchangePipe,
    private course: CoursesService
  ) {}

  ngOnInit(): void {
    this.initTrend();
  }

  initTrend() {
    this.chartIsReady = false;
    this.dataSet[0].data = [];
    this.dataSet[1].data = [];
    this.dataSet[2].data = [];

    this.course.getMyCourseChartRevenue().subscribe((res) => {
      if (!res?.payload) return;

      const { earnings, refunds, sales } = res.payload as any;

      const labelsSet = new Set<string>();

      for (
        let i = 0;
        i < Math.max(earnings.length, refunds.length, sales.length);
        i++
      ) {
        labelsSet.add(earnings[i]?.time);
        labelsSet.add(refunds[i]?.time);
        labelsSet.add(sales[i]?.time);

        this.dataSet[0].data.push(Number(earnings[i]?.count ?? 0));
        this.dataSet[1].data.push(Number(sales[i]?.count ?? 0));
        this.dataSet[2].data.push(Number(refunds[i]?.count ?? 0));
      }

      this.lineChartsLabel = Array.from(labelsSet)
      this.chartIsReady = true;
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
