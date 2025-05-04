import { MessageService } from './../../../core/services/message.service';
import {
  Component,
  ViewChild,
  type OnInit,
  ElementRef,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import {
  ICourse,
  ICourseApprovalStaff,
  ICourseOverview,
  ITag,
} from '../../../shared/interfaces/course.interfaces';
import { TableColumn } from '../../../shared/interfaces/others.interfaces';
import { Router } from '@angular/router';
import { faCheck, faClose, faPen } from '@fortawesome/free-solid-svg-icons';
import { fadeInOutAnimation } from '../../../shared/constants/animations.constant';
import { UserService } from '../../../core/services/user.service';
import { Subscription } from 'rxjs';
import { WebRole } from '../../../shared/enums/user.enum';
import { CoursesService } from '@/src/app/core/services/courses.service';
import { InstructorCourseStatus } from '@/src/app/shared/enums/course.enum';
import {
  IGetUserByRoleId,
  IUser,
} from '@/src/app/shared/interfaces/user.interfaces';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-courses-approval',
  templateUrl: './courses-approval.component.html',
  styleUrl: './courses-approval.component.scss',
  animations: [fadeInOutAnimation],
})
export class CoursesApprovalComponent implements OnInit, AfterViewInit {
  @ViewChild('buttons') buttonsRef!: TemplateRef<any>;
  @ViewChild('SelectExpert') SelectExpertRef!: ElementRef<any>;

  subscription$: Subscription = new Subscription();
  isLoaded: boolean = false;
  isExpertListLoaded: boolean = true;

  expertsList: IGetUserByRoleId[] = [];
  sortedExpertsList: IGetUserByRoleId[][] = [];

  courses: ICourseApprovalStaff[] = [];

  tableColumns: TableColumn[] = [
    {
      key: 'title',
      label: 'LABEL.COURSE_NAME',
    },
    {
      key: 'description',
      label: 'LABEL.DESCRIPTION',
    },
    {
      key: 'author',
      label: 'LABEL.INSTRUCTOR',
    },
    {
      key: 'price',
      label: 'LABEL.PRICE',
      isMoney: true,
    },
    {
      key: 'totalTime',
      label: 'LABEL.DURATION',
      translateLabel: 'SIGNATURE.MINUTES',
    },
    {
      key: 'totalLesson',
      label: 'LABEL.STAGES',
    },
    {
      key: 'category',
      label: 'LABEL.COURSE_CATEGORY',
      render: (course: ICourseApprovalStaff) =>
        course.listTag.map((tag) => tag.name).join(' '),
    },
  ];

  acceptIcon = faCheck;
  rejectIcon = faClose;
  editIcon = faPen;

  isStaffView: boolean = false;

  constructor(
    private router: Router,
    private user: UserService,
    private CourseService: CoursesService,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.listenToUser();
    this.initCourses();
  }

  ngAfterViewInit(): void {
    this.initTableAction();
  }

  listenToUser() {
    this.subscription$.add(
      this.user.user$.subscribe((user) => {
        this.isStaffView = user?.roleId === WebRole.STAFF;
      })
    );
  }

  initTableAction() {
    this.tableColumns.push({
      key: 'btns',
      label: this.isStaffView ? 'LABEL.ASSIGNED_EXERT' : '',
      elementRef: this.buttonsRef,
    });
  }

  initCorrespondingExpertList() {
    this.sortedExpertsList = [];
    this.courses.forEach((course) => {
      const tagsMap = new Set(course.listTag.map((tag) => tag.id));

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

  initCourses(): void {
    if (!this.user.user$.value) return;
    this.isLoaded = false;
    this.courses = [];
    this.expertsList = [];

    switch (this.user.user$.value.roleId) {
      case WebRole.STAFF:
        this.CourseService.onGetCourseByStatus(
          InstructorCourseStatus.PENDING
        ).subscribe((res) => {
          if (!res?.payload) return;

          this.courses = res.payload;
          this.isLoaded = true;
        });

        this.isExpertListLoaded = false;
        this.user.getUserByRoleId(WebRole.EXPERT).subscribe((res) => {
          if (!res?.payload) return;
          this.expertsList = res.payload;
          this.initCorrespondingExpertList();
          this.isExpertListLoaded = true;
        });
        break;
      case WebRole.EXPERT:
        this.CourseService.onGetCourseAssignedToMe().subscribe((res) => {
          if (!res?.payload) return;

          this.courses = res.payload;
          this.isLoaded = true;
        });
        break;
    }

    this.initTableData();
  }

  onViewDetails(course: ICourse): void {
    this.router.navigate(['/courses-manage/explore', course.id]);
  }

  onUpdateStatus(e: Event, data: ICourse, isApprove: boolean) {
    e.stopPropagation();
    this.CourseService.onApprove(data.id, isApprove).subscribe((res) => {
      if (res?.isError || !res) return;

      this.message.addMessage(
        'success',
        this.translate.instant('MESSAGE.UPDATED_SUCCESSFULLY')
      );
      this.initCourses();
    });
  }

  stoppropa(e: Event) {
    e.stopPropagation();
  }

  initTableData() {}

  onAssignExpert(e: any, row: ICourseOverview) {
    e.stopPropagation();
    const selectEl = e.target as HTMLSelectElement;
    const selectedExpertId = selectEl.value;

    this.CourseService.onAssignCourseToExpert(
      row.id,
      selectedExpertId
    ).subscribe((res) => {
      if (!res?.payload) return;
      this.message.addMessage(
        'success',
        this.translate.instant('MESSAGE.ASSIGNED_SUCCESSFULLY')
      );
    });
  }
}
