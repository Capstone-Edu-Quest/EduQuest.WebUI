import { UserService } from './../../core/services/user.service';
import { Component, type OnInit } from '@angular/core';
import { ILineChartDataSet, IPieChartDataSet } from '../../shared/interfaces/chart.interface';
import { faUser, faUserPlus, faUsersRays } from '@fortawesome/free-solid-svg-icons';
import { IUser } from '../../shared/interfaces/user.interfaces';
import { TableColumn } from '../../shared/interfaces/others.interfaces';
import { WebRole } from '../../shared/enums/user.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.scss',
})
export class UserManageComponent implements OnInit {
  searchText: string = '';

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

  usersTableColumns: TableColumn[] = [
    {
      label: 'LABEL.ID',
      key: 'id'
    },
    {
      label: 'LABEL.NAME',
      key: 'username'
    },
    {
      label: 'LABEL.EMAIL',
      key: 'email'
    },
    {
      label: 'LABEL.PHONE',
      key: 'phone'
    },
    {
      label: 'LABEL.ROLE',
      key: 'role',
      translateLabel: (data: IUser) => this.UserService.getRoleLabel(data.roleId)
    },
  ]
  usersTableData: IUser[] = [
    {
      id: "u1",
      username: "david_teacher",
      email: "david@example.com",
      phone: "+1234567890",
      avatarUrl: "https://example.com/avatars/david.png",
      roleId: WebRole.INSTRUCTOR,
      status: "active",
      statistic: {
        userId: "u1",
        totalActiveDay: 180,
        maxStudyStreakDay: 45,
        lastLearningDay: "2025-03-02",
        completedCourses: 15,
        gold: 7000,
        exp: 18000,
        level: 18,
        studyTime: 360, // hours
        totalCourseCreated: 8,
        totalLearner: 1500,
        totalReview: 300,
      },
      lastActive: "2025-03-03T12:00:00Z",
      mascotItem: ["owl", "lion"],
    },
    {
      id: "u2",
      username: "emily_student",
      email: "emily@example.com",
      phone: "+1987654321",
      avatarUrl: "https://example.com/avatars/emily.png",
      roleId: WebRole.LEARNER,
      status: "active",
      statistic: {
        userId: "u2",
        totalActiveDay: 90,
        maxStudyStreakDay: 25,
        lastLearningDay: "2025-03-03",
        completedCourses: 5,
        gold: 4000,
        exp: 9000,
        level: 12,
        studyTime: 150,
        totalCourseCreated: 0,
        totalLearner: 0,
        totalReview: 20,
      },
      lastActive: "2025-03-03T14:30:00Z",
      mascotItem: ["rabbit", "fox"],
    },
  ];

  constructor(private UserService: UserService, private router: Router) { }

  ngOnInit(): void {
    console.log(this.usersTableData)
  }

  onViewDetails(u: IUser) {
    // view profile page with more details
    this.router.navigate(['/profile', u.id]);
  }

  onConfirmSearch(e: KeyboardEvent) {

  }

}
