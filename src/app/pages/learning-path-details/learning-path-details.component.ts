import { LearningPathService } from './../../core/services/learning-path.service';
import { Component, TemplateRef, ViewChild, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ILCourseObject,
  ILearningPathDetails,
  IModifyLearningPath,
  IModifyLearningPathCourse,
} from '../../shared/interfaces/learning-path.interfaces';
import {
  faAngleLeft,
  faCheck,
  faClock,
  faClone,
  faEarth,
  faGripVertical,
  faPen,
  faPlus,
  faRetweet,
  faRightToBracket,
  faShare,
  faStar,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { IUser } from '../../shared/interfaces/user.interfaces';
import { MessageService } from '../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { copyToClipboard } from '../../core/utils/data.utils';
import {
  ICourseOverview,
  ISearchCourseParams,
} from '../../shared/interfaces/course.interfaces';
import { CoursesService } from '../../core/services/courses.service';
import { ModalService } from '../../core/services/modal.service';

@Component({
  selector: 'app-learning-path-details',
  templateUrl: './learning-path-details.component.html',
  styleUrl: './learning-path-details.component.scss',
})
export class LearningPathDetailsComponent implements OnInit {
  @ViewChild('searchCourse') searchCourseRef!: TemplateRef<any>;

  subscription$: Subscription = new Subscription();

  currentUser: IUser | null = null;
  learningPathDetails: ILearningPathDetails | null = null;

  authorIcon = faUser;
  timeIcon = faClock;
  privacyIcon = faEarth;
  dragIcon = faGripVertical;
  swapIcon = faRetweet;
  backIcon = faAngleLeft;
  addIcon = faPlus;
  starIcon = faStar;
  checkIcon = faCheck;

  isEdit: boolean = false;
  isExpertView: boolean = false;
  isMyPath: boolean = false;

  currentDragCourse: ICourseOverview | null = null;
  tempCourseList: ICourseOverview[] | null = null;
  deletedCourseList: ICourseOverview[] = [];
  tempEditMeta = {
    name: '',
    description: '',
    isPublic: !!this.learningPathDetails?.isPublic,
  };

  manageMenu = [
    {
      icon: faPen,
      label: 'LABEL.EDIT',
      action: () => this.onEdit(),
    },
    {
      icon: faTrash,
      label: 'LABEL.DELETE',
      action: () => this.onDelete(),
    },
  ];

  commonMenu = [
    {
      icon: faClone,
      label: 'LABEL.CLONE',
      action: () => this.onClone(),
    },
    {
      icon: faShare,
      label: 'LABEL.SHARE',
      action: () => this.onShare(),
    },
  ];

  showingPannelBtn: any[] = [];

  searchKeyword: string = '';
  courses: ICourseOverview[] = [];

  constructor(
    private route: ActivatedRoute,
    private modal: ModalService,
    private LearningPathService: LearningPathService,
    private user: UserService,
    private router: Router,
    private message: MessageService,
    private translate: TranslateService,
    private CourseService: CoursesService
  ) {}

  ngOnInit(): void {
    this.listenToUser();
    this.initPathDetails();

    this.isExpertView =
      this.route.parent?.routeConfig?.path === 'learning-path-manage';
  }

  onEnroll() {
    if (!this.learningPathDetails) return;
    this.LearningPathService.onEnrollLearningPath(
      this.learningPathDetails.id
    ).subscribe((res) => this.initPathDetails());
  }

  initPathDetails() {
    const courseId = this.route.snapshot.paramMap.get('pathId');
    if (!courseId) return;
    this.LearningPathService.getLearningPathDetails(courseId).subscribe(
      (res) => {
        if (!res?.payload) {
          this.router.navigate(['learning-path']);
          return;
        }

        this.learningPathDetails = res.payload;
        this.learningPathDetails.enrollDate = new Date(
          this.learningPathDetails.enrollDate || ''
        ).toLocaleString();
        this.isMyPath = this.currentUser?.id === this.learningPathDetails?.createdBy.id;
        this.onInitMenu();

        if (this.route.snapshot.queryParams['edit']) {
          this.onEdit();
        }
      }
    );
  }

  listenToUser() {
    this.subscription$.add(
      this.user.user$.subscribe((user) => {
        this.currentUser = user;
      })
    );
  }

  onInitMenu() {
    if (!this.learningPathDetails) return;

    this.showingPannelBtn = [];

    if (!this.learningPathDetails.isEnrolled && !this.isExpertView) {
      this.showingPannelBtn.push({
        icon: faRightToBracket,
        label: 'LABEL.ENROLL',
        action: () => this.onEnroll(),
      });
    }

    if (this.currentUser?.id === this.learningPathDetails.createdBy.id) {
      this.showingPannelBtn.push(...this.manageMenu);
    }

    this.showingPannelBtn.push(...this.commonMenu);
  }

  onEdit() {
    if (!this.learningPathDetails) return;

    this.isEdit = !this.isEdit;
    this.tempCourseList = this.learningPathDetails.courses;
    this.showingPannelBtn = this.showingPannelBtn.filter(
      (btn) => btn.label !== 'LABEL.EDIT'
    );
    this.tempEditMeta = {
      name: this.learningPathDetails.name,
      description: this.learningPathDetails.description,
      isPublic: this.learningPathDetails.isPublic,
    };
  }

  onEditPrivacy() {
    if (!this.isEdit) return;
    this.tempEditMeta.isPublic = !this.tempEditMeta.isPublic;
  }

  onBack() {
    this.router.navigate([
      this.isExpertView ? '/learning-path-manage' : 'learning-path',
    ]);
  }

  onRemoveCourse(course: ICourseOverview) {
    if (!this.tempCourseList) return;

    this.tempCourseList = this.tempCourseList.filter((c) => c.id !== course.id);
    this.deletedCourseList.push(course);
  }

  onSaveEdit() {
    if (!this.learningPathDetails || !this.tempCourseList) return;

    const { name, description, isPublic } = this.tempEditMeta;

    const updatedCourses: IModifyLearningPathCourse[] = this.tempCourseList.map(
      (c, index) => ({
        courseId: c.id,
        courseOrder: index,
        action: 'update',
      })
    );

    this.deletedCourseList.forEach((c) => {
      updatedCourses.push({
        courseId: c.id,
        courseOrder: -1,
        action: 'delete',
      });
    });

    const updatedLearningPaths: IModifyLearningPath = {
      name,
      description,
      isPublic,
      courses: updatedCourses,
    };

    this.LearningPathService.updateLearningPath(
      this.learningPathDetails.id,
      updatedLearningPaths
    ).subscribe((res) => {
      if (!res?.payload) return;

      this.learningPathDetails = res.payload;
      this.message.addMessage(
        'success',
        this.translate.instant('MESSAGE.UPDATED_SUCCESSFULLY')
      );
      this.isEdit = !this.isEdit;
      this.deletedCourseList = [];
      this.tempCourseList = null;

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          isEdit: null,
        },
        queryParamsHandling: 'merge',
      });

      this.onInitMenu();
      this.initPathDetails();
    });
  }

  onCancelEdit() {
    this.isEdit = false;
    this.tempCourseList = null;
    this.currentDragCourse = null;
    this.onInitMenu();
  }

  onDelete() {
    if (!this.learningPathDetails) return;
    this.LearningPathService.deleteLearningPath(this.learningPathDetails.id);
  }

  onClone() {
    if (!this.learningPathDetails) return;
    this.LearningPathService.cloneLearningPath(this.learningPathDetails.id);
  }

  onShare() {
    const url =
      window.location.host + '/learning-path/' + this.learningPathDetails?.id;
    copyToClipboard(url);
    this.message.addMessage(
      'success',
      this.translate.instant('MESSAGE.COPIED_URL')
    );
  }

  onDragStart(e: Event, course: ICourseOverview) {
    this.currentDragCourse = course;
  }

  onDragOver(e: Event) {
    e.preventDefault();
    // console.log(e);
  }

  onDrop(e: Event) {
    e.preventDefault();

    const droppedElement = e.target as HTMLElement;
    const droppedOnCourseId = droppedElement
      .closest('.course-wrapper')
      ?.getAttribute('courseId');

    if (this.tempCourseList) {
      const dropIndx = this.tempCourseList.findIndex(
        (c) => c.id === droppedOnCourseId
      );

      this.tempCourseList = this.tempCourseList.filter(
        (c) => c.id !== this.currentDragCourse?.id
      );

      this.tempCourseList = [
        ...this.tempCourseList.slice(0, dropIndx),
        this.currentDragCourse as ILCourseObject,
        ...this.tempCourseList.slice(dropIndx),
      ];
    }

    // console.log(this.tempCourseList, droppedOnCourseId);
    this.currentDragCourse = null;
  }

  isCourseExisted(courseId: string) {
    return this.learningPathDetails?.courses.some((c) => c.id === courseId);
  }

  showSearchCourse() {
    this.modal.updateModalContent(this.searchCourseRef);
  }

  onKeydownSearch(e: any) {
    if (e.key !== 'Enter' || !this.searchKeyword.trim()) return;
    this.handleSearch();
  }

  handleSearch() {
    const courseParams: ISearchCourseParams = {
      KeywordName: encodeURIComponent(this.searchKeyword),
      isPublic: true,
    };
    this.CourseService.onSearchCourse(courseParams).subscribe((res) => {
      this.courses = res?.payload ?? [];
    });
  }

  onSelectCourse(courseId: string) {
    if (!this.learningPathDetails) return;

    const isCourseExisted = this.isCourseExisted(courseId);

    if (isCourseExisted) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.COURSE_EXISTED_LEARNINGPATH')
      );
      return;
    }

    this.LearningPathService.modifyCoursesToLearningPath(
      this.learningPathDetails.id,
      [courseId],
      'add'
    ).subscribe((res) => {
      this.initPathDetails();
    });
  }

  round(num: number) {
    return num.toFixed(1);
  }
}
