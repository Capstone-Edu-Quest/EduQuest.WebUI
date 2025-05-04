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
import {
  IGetUserByRoleId,
  ISearchUserRes,
  IUser,
} from '../../shared/interfaces/user.interfaces';
import {
  IInstructorApplyRes,
  TableColumn,
} from '../../shared/interfaces/others.interfaces';
import { UserStatusEnum, WebRole } from '../../shared/enums/user.enum';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlatformService } from '../../core/services/platform.service';
import { ModalService } from '../../core/services/modal.service';
import { MessageService } from '../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { CoursesService } from '../../core/services/courses.service';
import { TagTypeRequestEnum } from '../../shared/enums/course.enum';
import { ITag } from '../../shared/interfaces/course.interfaces';
import { cloneDeep } from 'lodash';

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
  @ViewChild('ViewDetailsUser') ViewDetailsUserRef!: TemplateRef<any>;

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
    // {
    //   label: 'LABEL.ID',
    //   key: 'id',
    // },
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

  expertsList: IGetUserByRoleId[] = [];
  sortedExpertsList: IGetUserByRoleId[][] = [];

  isSearchUserDone: boolean = true;
  isInitColumns: boolean = false;
  usersList: ISearchUserRes[] = [];

  currentViewUser: ISearchUserRes | null = null;

  constructor(
    private UserService: UserService,
    private router: Router,
    private platform: PlatformService,
    private user: UserService,
    private modal: ModalService,
    private message: MessageService,
    private translate: TranslateService,
    private course: CoursesService
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

  initExperts() {
    this.user.getUserByRoleId(WebRole.EXPERT).subscribe((res) => {
      if (!res?.payload) return;
      this.expertsList = res.payload;
      this.initCorrespondingExpertList()
    });
  }

  initInstructors() {
    this.platform.getAppliedInstructor().subscribe((res) => {
      if (res?.payload) {
        this.appliedInstructor = res.payload;
      }

      this.initCorrespondingExpertList();
      this.isAppliedInsReady = true;
    });
  }

  initCorrespondingExpertList() {
    this.sortedExpertsList = [];
    this.appliedInstructor.forEach((instructor) => {
      const tagsMap = new Set(instructor.tags.map((tag) => tag.tagId));

      const availableExperts: IGetUserByRoleId[] = cloneDeep(this.expertsList);

      availableExperts.sort((a, b) => {
        const aMatch = a.tags.some((tag) => tagsMap.has(tag.tagId));
        const bMatch = b.tags.some((tag) => tagsMap.has(tag.tagId));
        return Number(bMatch) - Number(aMatch);
      });

      const finalizeExpertList = availableExperts.map((expert) => {
        const matchTag = expert.tags.find((tag) => tagsMap.has(tag.tagId));
        return matchTag
          ? { ...expert, username: `${expert.username} *` }
          : expert;
      });

      this.sortedExpertsList.push(finalizeExpertList);
    });
  }

  initColumns() {
    this.isInitColumns = false;
    this.columns = [...this.usersTableColumns];
    this.appliedInstructorColumns = [
      // {
      //   label: 'LABEL.ID',
      //   key: 'id',
      // },
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
      {
        label: 'LABEL.SUBJECT',
        key: 'subject',
        render: (value: IInstructorApplyRes) =>
          value.tags?.map((t) => t.tagName).join(', ') || '-',
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

    this.isInitColumns = true;
  }

  initRoleOptions() {
    Object.keys(WebRole).forEach((key) => {
      const _k = key as keyof typeof WebRole;

      if (isNaN(Number(WebRole[_k]))) {
        this.roleOptions.push({
          label: this.UserService.getRoleLabel(Number(_k)),
          value: Number(_k).toString(),
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

  onViewDetails(u: ISearchUserRes) {
    this.currentViewUser = u;
    this.modal.updateModalContent(this.ViewDetailsUserRef);
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

  onChangeRole(e: any, user: ISearchUserRes) {
    this.user
      .onSwitchUserRole({ userId: user.id, roleId: e.target.value })
      .subscribe((res) => {
        if (res?.isError) return;

        this.message.addMessage(
          'success',
          this.translate.instant('MESSAGE.UPDATED_SUCCESSFULLY')
        );
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
