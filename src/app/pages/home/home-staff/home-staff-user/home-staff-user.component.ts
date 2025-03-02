import { Component, type OnInit } from '@angular/core';
import {
  faUser,
  faUserPlus,
  faUsersRays,
} from '@fortawesome/free-solid-svg-icons';
import { ILineChartDataSet } from '../../../../shared/interfaces/chart.interface';

@Component({
  selector: 'app-home-staff-user',
  templateUrl: './home-staff-user.component.html',
  styleUrl: './home-staff-user.component.scss',
})
export class HomeStaffUserComponent implements OnInit {
  statItems = [
    {
      label: 'LABEL.TOTAL_USERS',
      value: 2123,
      icon: faUser,
    },
    {
      label: 'LABEL.MONTHLY_ACTIVE_USERS',
      value: 1263,
      icon: faUsersRays,
    },
    {
      label: 'LABEL.NEW_USER_THIS_MONTH',
      value: 532,
      icon: faUserPlus,
    },
  ];

  graphLabels: string[] = [
    'Oct 2024',
    'Nov 2024',
    'Dec 2024',
    'Jan 2025',
    'Feb 2025',
  ];
  graphData: ILineChartDataSet[] = [
    {
      label: 'LABEL.TOTAL_USERS',
      data: [50, 75, 110, 120, 223],
      borderColor: '--brand-05',
      pointBackgroundColor: '--brand-hover',
      pointBorderColor: '--brand-light',
      backgroundColor: '--brand-05',
    },
    {
      label: 'LABEL.ACTIVE_USERS',
      data: [22, 32, 50, 62, 50],
      borderColor: '--stage-surface-done',
      pointBackgroundColor: '--stage-body-done',
      pointBorderColor: '--stage-body-done',
      backgroundColor: '--stage-surface-done',
    },
    {
      label: 'LABEL.PREMIUM_USERS',
      data: [2, 4, 10, 6, 22],
      borderColor: '--stage-surface-current',
      pointBackgroundColor: '--warning',
      pointBorderColor: '--warning',
      backgroundColor: '--stage-surface-current',
    },
  ];

  ngOnInit(): void {}
}
