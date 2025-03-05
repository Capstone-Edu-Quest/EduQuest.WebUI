import { Component, type OnInit } from '@angular/core';
import { ILineChartDataSet, IPieChartDataSet } from '../../../shared/interfaces/chart.interface';
import { faExclamationCircle, faWarning } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-violations-statistics',
  templateUrl: './violations-statistics.component.html',
  styleUrl: './violations-statistics.component.scss',
})
export class ViolationsStatisticsComponent implements OnInit {
  statsItem = [
    {
      label: 'LABEL.30_DAYS_REPORTS',
      value: 80,
      icon: faWarning,
    },
    {
      label: 'LABEL.PENDING_REPORTS',
      value: 7,
      icon: faExclamationCircle,
    },
  ];

  pieChartLabels: string[] = [
    'LABEL.PENDING',
    'LABEL.RESOLVED',
    'LABEL.REJECTED',
  ];
  pieChartDataSet: IPieChartDataSet[] = [
    {
      label: `LABEL.REPORTS`,
      data: [7, 75, 12],
      backgroundColor: [
        '--stage-surface-current',
        '--stage-body-done',
        '--error',
      ],
      hoverBackgroundColor: [
        '--stage-surface-current',
        '--stage-body-done',
        '--error',
      ],
      borderColor: '--brand-02',
    },
  ];

  monthlyReportsLabels: string[] = [
    'Nov 2024',
    'Dec 2024',
    'Jan 2025',
    'Feb 2025',
    'Mar 2025',
  ];
  monthlyReportsDataSet: ILineChartDataSet[] = [
    {
      label: 'LABEL.REPORTS',
      backgroundColor: '--brand',
      borderColor: '--brand-light',
      pointBackgroundColor: '--brand',
      pointBorderColor: '--brand-light',
      data: [22, 12, 18, 15, 20],
    },
    {
      label: 'LABEL.RESOLVED',
      backgroundColor: '--stage-body-done',
      borderColor: '--success',
      pointBackgroundColor: '--stage-body-done',
      pointBorderColor: '--success',
      data: [18, 6, 18, 4, 19],
    },
    {
      label: 'LABEL.REJECTED',
      backgroundColor: '--error',
      borderColor: '--alert',
      pointBackgroundColor: '--error',
      pointBorderColor: '--alert',
      data: [4, 6, 0, 11, 1],
    },
  ];

  ngOnInit(): void { }

}
