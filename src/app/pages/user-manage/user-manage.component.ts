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
import { IUser } from '../../shared/interfaces/user.interfaces';
import {
  IInstructorApplyRes,
  TableColumn,
} from '../../shared/interfaces/others.interfaces';
import { WebRole } from '../../shared/enums/user.enum';
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
  usersTableData: IUser[] = [];

  expertsList: IUser[] = [];

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
          this.UserService.getRoleLabel(data.roleId),
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
          value: Number(_k),
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

  onConfirmSearch(e: KeyboardEvent) {}

  onWarn(e: Event, u: IUser) {
    e.stopPropagation();
    console.log('warn', u);
  }

  onSuspend(e: Event, u: IUser) {
    e.stopPropagation();
    console.log('suspend', u);
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
