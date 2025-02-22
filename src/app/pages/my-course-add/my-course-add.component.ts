import { UserService } from './../../core/services/user.service';
import {
  Component,
  OnDestroy,
  ViewChild,
  type OnInit,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  faCamera,
  faGripVertical,
  faPlus,
  faRemove,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { MessageService } from '../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { ImageService } from '../../core/services/image.service';
import { FirebaseStorageFolder } from '../../shared/enums/firebase.enum';
import { IUser } from '../../shared/interfaces/user.interfaces';
import { FirebaseService } from '../../core/services/firebase.service';
import {
  ICourseCreate,
  ICourseManageDetails,
  ICourseUpdate,
  IModifyStage,
  IStage,
} from '../../shared/interfaces/course.interfaces';
import { Location } from '@angular/common';

@Component({
  selector: 'app-my-course-add',
  templateUrl: './my-course-add.component.html',
  styleUrl: './my-course-add.component.scss',
})
export class MyCourseAddComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;

  addIcon = faPlus;
  removeIcon = faRemove;
  cameraIcon = faCamera;
  dragIcon = faGripVertical;

  subscription$: Subscription = new Subscription();
  user: IUser | null = null;

  isEdit: boolean = false;
  isDragOverImgInput: boolean = false;
  imageName: string = `userid_${Date.now()}`;
  isUploadedFirstTime: boolean = false;
  uploadProgress: number | null = null;
  currentDragStageId: string | null = null;

  courseInfo: ICourseCreate = {
    name: '',
    description: '',
    price: 0,
    image: '',
    requirements: [],
  };

  fullStagesInfo: IStage[] = [];

  demoCourse: ICourseManageDetails = {
    id: 'course-001',
    name: 'Mastering TypeScript',
    leanerCount: 1253,
    isPublic: true,
    totalInCart: 88,
    totalInWhislist: 122,
    totalEnrolled: 1253,
    courseEnrollOverTime: [
      { time: 'Oct 2024', count: 120 },
      { time: 'Nov 2024', count: 652 },
      { time: 'Dec 2024', count: 781 },
      { time: 'Jan 2025', count: 992 },
      { time: 'Feb 2025', count: 1211 },
    ],
    courseRatingOverTime: [
      { time: 'Oct 2024', count: 44 },
      { time: 'Nov 2024', count: 86 },
      { time: 'Dec 2024', count: 122 },
      { time: 'Jan 2025', count: 322 },
      { time: 'Feb 2025', count: 452 },
    ],
    description:
      'A complete guide to mastering TypeScript, from basics to advanced concepts.',
    duration: 12,
    stageCount: 3,
    image: '/assets/images/demo-course-thumb.webp',
    price: 49.99,
    createdDate: '2024-01-01T00:00:00Z',
    lastUpdated: '2025-01-20T10:00:00Z',
    rating: 4.8,
    numberOfRating: 1520,
    isCompleted: false,
    progress: 25, // 25% completed
    tags: [
      {
        id: 'tag-1',
        name: 'TypeScript',
        description: 'Strongly-typed JavaScript',
      },
      { id: 'tag-2', name: 'Frontend', description: 'For frontend developers' },
      { id: 'tag-3', name: 'Backend', description: 'For backend developers' },
    ],
    totalTime: 12, // Total time in hours
    requirements: [
      'Basic knowledge of JavaScript',
      'Familiarity with ES6+ syntax',
      'A code editor (VS Code recommended)',
    ],
    stages: [
      {
        id: 'stage-001',
        title: 'Introduction to TypeScript',
        time: 3, // 3 hours
        mission: [
          {
            id: 'mission-001',
            title: 'What is TypeScript?',
            type: 'video',
            mission: 'Learn the basics and advantages of TypeScript.',
            time: 120,
          },
          {
            id: 'mission-002',
            title: 'Setting up TypeScript',
            type: 'document',
            mission: 'Guide to installing and configuring TypeScript.',
            time: 120,
          },
          {
            id: 'mission-003',
            title: 'TypeScript Quiz 1',
            type: 'quiz',
            mission: 'Test your understanding of TypeScript basics.',
            time: 120,
          },
          {
            id: 'mission-004',
            title: 'TypeScript Quiz 1',
            type: 'assignment',
            mission: 'Test your understanding of TypeScript basics.',
            time: 120,
          },
        ],
      },
      {
        id: 'stage-002',
        title: 'TypeScript in Action',
        time: 4, // 4 hours
        mission: [
          {
            id: 'mission-004',
            title: 'TypeScript Type System',
            type: 'video',
            mission:
              'Understand types, interfaces, and type inference in TypeScript.',
            time: 120,
          },
          {
            id: 'mission-005',
            title: 'Practical TypeScript Examples',
            type: 'document',
            mission:
              'Explore real-world TypeScript applications and best practices.',
            time: 120,
          },
        ],
      },
      {
        id: 'stage-003',
        title: 'Advanced TypeScript',
        time: 5, // 5 hours
        mission: [
          {
            id: 'mission-006',
            title: 'Generics & Advanced Types',
            type: 'video',
            mission:
              'Deep dive into generics, mapped types, and utility types.',
            time: 120,
          },
          {
            id: 'mission-007',
            title: 'TypeScript Quiz 2',
            type: 'quiz',
            mission: 'Assess your knowledge of advanced TypeScript topics.',
            time: 120,
          },
        ],
      },
    ],
  };

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private message: MessageService,
    private translate: TranslateService,
    private ImageService: ImageService,
    private UserService: UserService,
    private firebase: FirebaseService
  ) {}

  ngOnInit(): void {
    this.initView();
    this.listenToUser();
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((user) => {
        this.user = user;
        this.imageName = this.imageName.replace('userid', user?.id || 'userid');
      })
    );
  }

  initView() {
    this.subscription$.add(
      this.route.paramMap.subscribe((params) => {
        const courseId = params.get('courseId');
        this.isEdit = !!courseId;
        if (courseId) {
          this.initCourse(courseId);
        }
      })
    );
  }

  initCourse(courseId: string) {
    this.courseInfo = {
      name: this.demoCourse.name,
      description: this.demoCourse.description,
      price: this.demoCourse.price,
      image: this.demoCourse.image,
      requirements: this.demoCourse.requirements,
    };
    this.fullStagesInfo = this.demoCourse.stages;
  }

  onClickAddImage() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    this.onHandleFile(event.target.files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.isDragOverImgInput = true;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOverImgInput = false;
    this.onHandleFile(event.dataTransfer?.files);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();

    this.isDragOverImgInput = false;
  }

  async onHandleFile(files: FileList | undefined) {
    if (!files || !this.user) return;

    if (files.length > 1) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.ONLY_1_FILE')
      );
      return;
    }

    const file = files[0];
    const isValid = this.ImageService.validateImage(file);

    if (!isValid) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.INVALID_IMAGE')
      );
      return;
    }

    const croppedFile = await this.ImageService.cropImageTo16by9(file);
    const { progress$, downloadURL$ } =
      this.ImageService.uploadImageToFirebaseStorage(
        FirebaseStorageFolder.COURSE_THUMBNAIL,
        croppedFile,
        this.imageName
      );

    this.subscription$.add(
      progress$.subscribe((progress: any) => {
        this.uploadProgress = progress.toFixed(2);
      })
    );

    this.subscription$.add(
      downloadURL$.subscribe((url: string) => {
        this.onUploadSuccess(url);
      })
    );

    // Create a name for img and keep that name
    // Upload image with that name to storage, change image also upload as the same name
    // Then save the url to firebase db
    // When click create course, remove url from firebase db
    // 1. When user leave the page, as soon as when the user enter web again, trigger to db and remove url + image from storage
    // 2. Or use beforeunload event & onDestroy event to remove url + image from storage
  }

  onUploadSuccess(url: string) {
    this.uploadProgress = null;
    this.courseInfo.image = url;
    !this.isUploadedFirstTime && this.firebase.addCacheImage(url);
    this.isUploadedFirstTime = true;
  }

  onRemoveImage(e: Event) {
    e.stopPropagation();
    this.courseInfo.image = '';
  }

  onAddRequirement() {
    this.courseInfo.requirements.push('');
  }

  onRemoveRequirement(idx: number) {
    this.courseInfo.requirements.splice(idx, 1);
  }

  RequirementTrackIdx(index: number, item: string) {
    return index;
  }

  onValidateCourseInfo(course: any) {
    const courseKey = Object.keys(course);
    if (course.image === '') {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.COURSE_NEED_THUMBNAIL')
      );
      return;
    }
    for (let i = 0; i < courseKey.length; i++) {
      if (
        typeof course[courseKey[i]] === 'string' &&
        course[courseKey[i]].trim().length === 0
      ) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.MISSING_FIELDS')
        );
        return;
      }

      if (
        typeof course[courseKey[i]] === 'number' &&
        course[courseKey[i]] < 0
      ) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.INVALID_PRICE')
        );
        return;
      }

      if (
        Array.isArray(course[courseKey[i]]) &&
        course[courseKey[i]].length === 0
      ) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.MISSING_FIELDS')
        );
        return;
      }
    }

    return true;
  }

  onCreateCourse() {
    const course: any = {
      ...this.courseInfo,
      // instructor: this.user.id,
    };

    if (!this.onValidateCourseInfo(course)) return;
    console.log(course);
  }

  onUpdate() {
    const newCourseInfo: ICourseUpdate = {
      id: this.demoCourse.id,
      ...this.courseInfo,
      stages: this.fullStagesInfo.map((stage) => {
        return {
          name: stage.title,
          description: '',
          materialsId: stage.mission.map((mission) => mission.id),
        } as IModifyStage;
      }),
    };

    if (!this.onValidateCourseInfo(newCourseInfo)) return;

    const emptyStage = newCourseInfo.stages.findIndex(
      (stage) => stage.name === '' || stage.materialsId.length === 0
    );

    if (emptyStage !== -1) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.INVALID_STAGES')
      );
      return;
    }

    console.log(newCourseInfo);
  }

  onCancel() {
    this.location.back();
  }

  onEditStage(event: IStage | string) {
    if (typeof event === 'string') {
      this.fullStagesInfo = this.fullStagesInfo.filter(
        (stage) => stage.id !== event
      );
      return;
    }

    const idx = this.fullStagesInfo.findIndex((stage) => stage.id === event.id);
    if (idx === -1) return;

    this.fullStagesInfo[idx] = event;
  }

  trackStageChange(index: number, item: IStage) {
    return item.id;
  }

  onDragStageStart(e: Event, stageId: string) {
    this.currentDragStageId = stageId;
  }

  onDragStageOver(e: Event) {
    e.preventDefault();
    // console.log(e);
  }

  onDropStage(e: Event) {
    e.preventDefault();

    const droppedElement = e.target as HTMLElement;
    const droppedOnStageId = droppedElement
      .closest('.stage-wrapper')
      ?.getAttribute('stageId');

    if (this.currentDragStageId) {
      const dropIndx = this.fullStagesInfo.findIndex(
        (c) => c.id === droppedOnStageId
      );

      const dragStage = this.fullStagesInfo.find(
        (s) => s.id === this.currentDragStageId
      );

      this.fullStagesInfo = this.fullStagesInfo.filter(
        (c) => c.id !== this.currentDragStageId
      );

      this.fullStagesInfo = [
        ...this.fullStagesInfo.slice(0, dropIndx),
        dragStage as IStage,
        ...this.fullStagesInfo.slice(dropIndx),
      ];
    }

    this.currentDragStageId = null;
  }

  onAddNewStage() {
    const newStage: IStage = {
      id: `stage-${this.fullStagesInfo.length + 1}`,
      title: '',
      time: 0,
      mission: [],
    };

    this.fullStagesInfo.push(newStage);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
