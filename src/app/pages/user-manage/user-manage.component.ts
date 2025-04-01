import { UserService } from './../../core/services/user.service';
import {
  Component,
  ViewChild,
  type OnInit,
  TemplateRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import {
  ILineChartDataSet,
  IPieChartDataSet,
} from '../../shared/interfaces/chart.interface';
import {
  faUser,
  faUserPlus,
  faUsersRays,
} from '@fortawesome/free-solid-svg-icons';
import { IUser } from '../../shared/interfaces/user.interfaces';
import { TableColumn } from '../../shared/interfaces/others.interfaces';
import { WebRole } from '../../shared/enums/user.enum';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.scss',
})
export class UserManageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('actionOnUser') actionRef!: TemplateRef<any>;
  @ViewChild('roleManagement') roleManagementRef!: TemplateRef<any>;

  subscription$: Subscription = new Subscription();

  isAdminView: boolean = false;

  roleOptions: any[] = [];

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
    },
    {
      label: 'LABEL.ACTIVE_USERS',
      data: [22, 32, 50, 62, 50],
    },
    {
      label: 'LABEL.PREMIUM_USERS',
      data: [2, 4, 10, 6, 22],
    },
  ];

  usersTableColumns: TableColumn[] = [
    {
      label: 'LABEL.ID',
      key: 'id',
    },
    {
      label: 'LABEL.NAME',
      key: 'username',
    },
    {
      label: 'LABEL.EMAIL',
      key: 'email',
    },
    {
      label: 'LABEL.PHONE',
      key: 'phone',
    },
  ];

  columns: TableColumn[] = [];
  usersTableData: IUser[] = [
    // {
    //   id: 'u1',
    //   username: 'david_teacher',
    //   email: 'david@example.com',
    //   phone: '+1234567890',
    //   avatarUrl: 'https://example.com/avatars/david.png',
    //   roleId: WebRole.INSTRUCTOR,
    //   status: 'active',
    //   isPremium: false,
    //   statistic: {
    //     userId: 'u1',
    //     maxExpLevel: 20000,
    //     totalActiveDay: 180,
    //     maxStudyStreakDay: 45,
    //     lastLearningDay: '2025-03-02',
    //     completedCourses: 15,
    //     gold: 7000,
    //     exp: 18000,
    //     level: 18,
    //     studyTime: 360, // hours
    //     totalCourseCreated: 8,
    //     totalLearner: 1500,
    //     totalReview: 300,
    //     totalCompletedCourses: 15,
    //     currentStreak: 10,
    //     longestStreak: 20,
    //     lastActive: '2025-03-03T12:00:00Z',
    //   },
    //   lastActive: '2025-03-03T12:00:00Z',
    //   mascotItem: ['owl', 'lion'],
    // },
    // {
    //   id: 'u2',
    //   username: 'emily_student',
    //   email: 'emily@example.com',
    //   phone: '+1987654321',
    //   avatarUrl: 'https://example.com/avatars/emily.png',
    //   roleId: WebRole.LEARNER,
    //   status: 'active',
    //   isPremium: false,
    //   statistic: {
    //     userId: 'u2',
    //     maxExpLevel: 20000,
    //     totalActiveDay: 90,
    //     maxStudyStreakDay: 25,
    //     lastLearningDay: '2025-03-03',
    //     completedCourses: 5,
    //     gold: 4000,
    //     exp: 9000,
    //     level: 12,
    //     studyTime: 150,
    //     totalCourseCreated: 0,
    //     totalLearner: 0,
    //     totalReview: 20,
    //     totalCompletedCourses: 15,
    //     currentStreak: 10,
    //     longestStreak: 20,
    //     lastActive: '2025-03-03T12:00:00Z',
    //   },
    //   lastActive: '2025-03-03T14:30:00Z',
    //   mascotItem: ['rabbit', 'fox'],
    // },
  ];

  constructor(private UserService: UserService, private router: Router) {}

  ngOnInit(): void {
    console.log(this.usersTableData);
    this.listenToUser();
    this.initRoleOptions();
  }

  ngAfterViewInit(): void {
    this.initColumns();
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((user) => {
        this.isAdminView = user?.roleId === WebRole.ADMIN;
        this.initColumns();
      })
    );
  }

  initColumns() {
    this.columns = [...this.usersTableColumns];

    if (this.isAdminView) {
      this.columns.push({
        label: 'LABEL.ROLE',
        key: 'role',
        elementRef: this.roleManagementRef,
      });
    } else {
      // Staff
      this.columns.push({
        label: 'LABEL.ROLE',
        key: 'role',
        isSwitchData: true,
        translateLabel: (data: IUser) =>
          this.UserService.getRoleLabel(data.roleId),
      });
    }
    this.columns.push({
      label: '',
      key: 'action',
      elementRef: this.actionRef,
    });
  }

  initRoleOptions() {
    Object.keys(WebRole).forEach((key) => {
      const _k = key as keyof typeof WebRole;

      if (isNaN(Number(WebRole[_k]))) {
        this.roleOptions.push({
          label: this.UserService.getRoleLabel(Number(_k)),
          value: Number(_k),
        });
      }
    });

    this.roleOptions = this.roleOptions.filter((r) => r.label !== '');

    console.log(this.roleOptions);
  }

  onGetRole(r: any) {
    // console.log(r);
    return 2;
  }

  onViewDetails(u: IUser) {
    // view profile page with more details
    this.router.navigate(['/profile', u.id]);
  }

  onConfirmSearch(e: KeyboardEvent) {}

  onWarn(e: Event, u: IUser) {
    e.stopPropagation();
    console.log('warn', u);
  }

  onSuspend(e: Event, u: IUser) {
    e.stopPropagation();
    console.log('suspend', u);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
