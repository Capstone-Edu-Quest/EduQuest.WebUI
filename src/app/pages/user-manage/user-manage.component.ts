import { UserService } from './../../core/services/user.service';
import {
  Component,
  ViewChild,
  type OnInit,
  TemplateRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ILineChartDataSet } from '../../shared/interfaces/chart.interface';
import {
  faUpRightFromSquare,
  faUser,
  faUserPlus,
  faUsersRays,
} from '@fortawesome/free-solid-svg-icons';
import { ISearchUserRes, IUser } from '../../shared/interfaces/user.interfaces';
import {
  IInstructorApplyRes,
  TableColumn,
} from '../../shared/interfaces/others.interfaces';
import { UserStatusEnum, WebRole } from '../../shared/enums/user.enum';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlatformService } from '../../core/services/platform.service';
import { ModalService } from '../../core/services/modal.service';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.scss',
})
export class UserManageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('actionOnUser') actionRef!: TemplateRef<any>;
  @ViewChild('roleManagement') roleManagementRef!: TemplateRef<any>;
  @ViewChild('assignToExpert') assignToExpertRef!: TemplateRef<any>;
  @ViewChild('instructorDetails') instructorDetailsRef!: TemplateRef<any>;

  subscription$: Subscription = new Subscription();

  exploreIcon = faUpRightFromSquare;

  appliedInstructor: IInstructorApplyRes[] = [];
  isAppliedInsReady: boolean = false;
  currentViewInstructor: IInstructorApplyRes | null = null;

  isAdminView: boolean = false;

  isChartReady: boolean = false;

  roleOptions: any[] = [];

  searchText: string = '';

  statItems: any[] = [
    {
      label: 'LABEL.TOTAL_USERS',
      value: 0,
      icon: faUser,
    },
    {
      label: 'LABEL.MONTHLY_ACTIVE_USERS',
      value: 0,
      icon: faUsersRays,
    },
    {
      label: 'LABEL.NEW_USER_THIS_MONTH',
      value: 0,
      icon: faUserPlus,
    },
  ];

  graphLabels: string[] = [];
  graphData: ILineChartDataSet[] = [];

  appliedInstructorColumns: TableColumn[] = [];

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

  expertsList: IUser[] = [];

  isSearchUserDone: boolean = true;
  usersList: ISearchUserRes[] = [];

  constructor(
    private UserService: UserService,
    private router: Router,
    private platform: PlatformService,
    private user: UserService,
    private modal: ModalService
  ) {}

  ngOnInit(): void {
    this.initInstructors();
    this.listenToUser();
    this.initRoleOptions();
    this.initExperts();
    this.initUsersStats();
  }

  initUsersStats() {
    this.isChartReady = false;
    this.user.getAdminDashboard().subscribe((res) => {
      if (!res?.payload) return;
      const { payload } = res;

      this.statItems = [
        {
          label: 'LABEL.TOTAL_USERS',
          value: payload.adminDasboardUsers.totalUsers,
          icon: faUser,
        },
        {
          label: 'LABEL.MONTHLY_ACTIVE_USERS',
          value: payload.adminDasboardUsers.monthlyActiveUsers,
          icon: faUsersRays,
        },
        {
          label: 'LABEL.NEW_USER_THIS_MONTH',
          value: payload.adminDasboardUsers.thisMonthNewUsers,
          icon: faUserPlus,
        },
      ];

      const sourceData = payload.adminDasboardUsers.graphData;
      this.graphLabels = sourceData.map((item) => item.date);
      this.graphData = [
        {
          label: 'LABEL.TOTAL_USERS',
          data: sourceData.map((item) => item.totalUser),
        },
        {
          label: 'LABEL.ACTIVE_USERS',
          data: sourceData.map((item) => item.totalActiveUser),
        },
        {
          label: 'LABEL.PREMIUM_USERS',
          data: sourceData.map((item) => item.totalProUser),
        },
      ];

      this.isChartReady = true;
    });
  }

  handleSearchUser(e: KeyboardEvent) {
    if (!this.searchText || e.key.toLowerCase() !== 'enter') return;

    this.isSearchUserDone = false;
    this.user
      .onSearchUser({ Username: this.searchText.trim() })
      .subscribe((res) => {
        this.usersList = res?.payload?.users ?? [];
        this.isSearchUserDone = true;
      });
  }

  ngAfterViewInit(): void {
    // this.initColumns();
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((user) => {
        this.isAdminView = user?.roleId === WebRole.ADMIN;
        this.initColumns();
      })
    );
  }

  initExperts() {
    this.user.getUserByRoleId(WebRole.EXPERT).subscribe((res) => {
      if (!res?.payload) return;
      this.expertsList = res.payload;
    });
  }

  initInstructors() {
    this.platform.getAppliedInstructor().subscribe((res) => {
      if (res?.payload) {
        this.appliedInstructor = res.payload;
      }

      this.isAppliedInsReady = true;
    });
  }

  initColumns() {
    this.columns = [...this.usersTableColumns];
    this.appliedInstructorColumns = [
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
          this.UserService.getRoleLabel(Number(data.roleId)),
      });
    }

    this.columns.push({
      label: '',
      key: 'action',
      elementRef: this.actionRef,
    });

    this.appliedInstructorColumns.push({
      label: '',
      key: 'action',
      onClick: () => {},
      elementRef: this.assignToExpertRef,
    });
  }

  initRoleOptions() {
    Object.keys(WebRole).forEach((key) => {
      const _k = key as keyof typeof WebRole;

      if (isNaN(Number(WebRole[_k]))) {
        this.roleOptions.push({
          label: this.UserService.getRoleLabel(Number(_k)),
          value: Number(_k).toString()
        });
      }
    });

    this.roleOptions = this.roleOptions.filter((r) => r.label !== '');
  }

  onViewInstructorRegisterInfo(data: IInstructorApplyRes) {
    this.currentViewInstructor = data;
    this.modal.updateModalContent(this.instructorDetailsRef);
  }

  onGetRole(r: any) {
    // console.log(r);
    return 2;
  }

  onViewDetails(u: IUser) {
    // view profile page with more details
    this.router.navigate(['/profile', u.id]);
  }

  onWarn(e: Event, u: IUser) {
    e.stopPropagation();
    console.log('warn', u);
  }

  onSuspend(e: Event, u: ISearchUserRes) {
    e.stopPropagation();

    this.user
      .updateUserStatus({
        userId: u.id,
        status:
          u.status === UserStatusEnum.BLOCKED
            ? UserStatusEnum.ACTIVE
            : UserStatusEnum.BLOCKED,
      })
      .subscribe((res) => {
        this.handleSearchUser({ key: 'enter' } as any);
      });
  }

  onAssignExpert(e: any, row: IInstructorApplyRes) {
    this.platform.assignInstructorToExpert(row.id, e.target?.value);
  }

  viewCertificate(url: string) {
    window.open(url, '_blank');
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
