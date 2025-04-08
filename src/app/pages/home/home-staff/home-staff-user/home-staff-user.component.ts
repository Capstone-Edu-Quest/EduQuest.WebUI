import { Component, OnDestroy, type OnInit } from '@angular/core';
import {
  faUser,
  faUserPlus,
  faUsersRays,
} from '@fortawesome/free-solid-svg-icons';
import { ILineChartDataSet } from '../../../../shared/interfaces/chart.interface';
import { UserService } from '@/src/app/core/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-staff-user',
  templateUrl: './home-staff-user.component.html',
  styleUrl: './home-staff-user.component.scss',
})
export class HomeStaffUserComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  statItems: any[] = [];

  graphLabels: string[] = [];
  graphData: ILineChartDataSet[] = [];

  isLoaded: boolean = false;

  constructor(private user: UserService) {}

  ngOnInit(): void {
    this.listenToAdminDashboard();
  }

  listenToAdminDashboard() {
    this.subscription$.add(
      this.user.adminDashboard$.subscribe((res) => {
        if (!res) return;

        this.statItems = [
          {
            label: 'LABEL.TOTAL_USERS',
            value: res.adminDasboardUsers.totalUsers,
            icon: faUser,
          },
          {
            label: 'LABEL.MONTHLY_ACTIVE_USERS',
            value: res.adminDasboardUsers.monthlyActiveUsers,
            icon: faUsersRays,
          },
          {
            label: 'LABEL.NEW_USER_THIS_MONTH',
            value: res.adminDasboardUsers.thisMonthNewUsers,
            icon: faUserPlus,
          },
        ];

        this.graphLabels = [];
        this.graphData = [
          {
            label: 'LABEL.TOTAL_USERS',
            data: [],
          },
          {
            label: 'LABEL.ACTIVE_USERS',
            data: [],
          },
          {
            label: 'LABEL.PREMIUM_USERS',
            data: [],
          },
        ];

        res.adminDasboardUsers.graphData.forEach((data) => {
          this.graphLabels.push(data.date);
          this.graphData[0].data.push(data.totalUser);
          this.graphData[1].data.push(data.totalActiveUser);
          this.graphData[2].data.push(data.totalProUser);
        });

        this.isLoaded = true;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
