import { LearningPathService } from './../../core/services/learning-path.service';
import { Component, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ILCourseObject,
  ILearningPathDetails,
  IModifyLearningPath,
  IModifyLearningPathCourse,
} from '../../shared/interfaces/learning-path.interfaces';
import {
  faAngleLeft,
  faClock,
  faClone,
  faEarth,
  faGripVertical,
  faPen,
  faRetweet,
  faShare,
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

@Component({
  selector: 'app-learning-path-details',
  templateUrl: './learning-path-details.component.html',
  styleUrl: './learning-path-details.component.scss',
})
export class LearningPathDetailsComponent implements OnInit {
  subscription$: Subscription = new Subscription();

  currentUser: IUser | null = null;
  learningPathDetails: ILearningPathDetails | null = null;

  authorIcon = faUser;
  timeIcon = faClock;
  privacyIcon = faEarth;
  dragIcon = faGripVertical;
  swapIcon = faRetweet;
  backIcon = faAngleLeft;

  isEdit: boolean = false;
  isExpertView: boolean = false;

  currentDragCourse: ILCourseObject | null = null;
  tempCourseList: ILCourseObject[] | null = null;
  deletedCourseList: ILCourseObject[] = [];
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

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private LearningPathService: LearningPathService,
    private user: UserService,
    private router: Router,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.listenToUser();
    this.initPathDetails();

    this.isExpertView =
      this.route.parent?.routeConfig?.path === 'learning-path-manage';
  }

  onEnroll() {}

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

    if (this.currentUser?.id !== this.learningPathDetails.createdBy.id) {
      this.showingPannelBtn = [...this.commonMenu];
      return;
    }

    this.showingPannelBtn = [...this.manageMenu, ...this.commonMenu];
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
    this.location.back();
  }

  onRemoveCourse(course: ILCourseObject) {
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
      this.tempCourseList = [];

      this.onInitMenu();
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
    const url = window.location.host + '/learning-path/' + this.learningPathDetails?.id
    copyToClipboard(url);
    this.message.addMessage('success', this.translate.instant('MESSAGE.COPIED_URL'))
  }

  onDragStart(e: Event, course: ILCourseObject) {
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
}
