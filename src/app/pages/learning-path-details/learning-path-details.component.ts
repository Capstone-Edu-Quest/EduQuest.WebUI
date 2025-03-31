import { Component, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ILCourseObject,
  ILearningPathDetails,
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

@Component({
  selector: 'app-learning-path-details',
  templateUrl: './learning-path-details.component.html',
  styleUrl: './learning-path-details.component.scss',
})
export class LearningPathDetailsComponent implements OnInit {
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
  tempEditMeta = {
    name: '',
    description: '',
    isPublic: !!this.learningPathDetails?.isPublic,
  };

  pannelBtn = [
    {
      icon: faShare,
      label: 'LABEL.SHARE',
      action: () => this.onShare(),
    },
    {
      icon: faTrash,
      label: 'LABEL.ENROLL',
      action: () => this.onEnroll(),
    },
    {
      icon: faClone,
      label: 'LABEL.CLONE',
      action: () => this.onClone(),
    },
  ];

  defaultPannels = [
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

  showingPannelBtn: any[] = [];

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    if (this.route.snapshot.queryParams['edit']) {
      this.onEdit();
    }

    this.isExpertView =
      this.route.parent?.routeConfig?.path === 'learning-path-manage';
    this.onInitMenu();
  }

  onEnroll() {}

  onInitMenu() {
    this.showingPannelBtn = [];
    if (!this.isExpertView) {
      this.showingPannelBtn = [...this.pannelBtn];
    }

    this.showingPannelBtn = [...this.showingPannelBtn, ...this.defaultPannels];
  }

  onEdit() {
    // this.isEdit = !this.isEdit;
    // this.tempCourseList = this.learningPathDetails.courses;
    // this.showingPannelBtn = this.showingPannelBtn.filter(
    //   (btn) => btn.label !== 'LABEL.EDIT'
    // );

    // this.tempEditMeta = {
    //   name: this.learningPathDetails.name,
    //   description: this.learningPathDetails.description,
    //   isPublic: this.learningPathDetails.isPublic,
    // };
  }

  onEditPrivacy() {
    if (!this.isEdit) return;
    this.tempEditMeta.isPublic = !this.tempEditMeta.isPublic;
  }

  onBack() {
    this.location.back();
  }

  onSaveEdit() {
    // this.learningPathDetails.courses = (
    //   this.tempCourseList as ILCourseObject[]
    // ).map((c, i) => ({
    //   ...c,
    //   order: i,
    // }));

    // this.learningPathDetails.name = this.tempEditMeta.name;
    // this.learningPathDetails.description = this.tempEditMeta.description;
    // this.learningPathDetails.isPublic = this.tempEditMeta.isPublic;

    // console.log(this.learningPathDetails);

    // // Reset all edit attributes
    // this.onCancelEdit();
  }

  onCancelEdit() {
    this.isEdit = false;
    this.tempCourseList = null;
    this.currentDragCourse = null;
    this.onInitMenu();
  }

  onDelete() {}

  onClone() {}

  onShare() {}

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
        (c) => c.course.id === droppedOnCourseId
      );

      this.tempCourseList = this.tempCourseList.filter(
        (c) => c.course.id !== this.currentDragCourse?.course.id
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
