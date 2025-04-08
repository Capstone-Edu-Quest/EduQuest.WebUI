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
import { IUser } from '../../shared/interfaces/user.interfaces';
import {
  ICourseCreate,
  ILessonOverview,
} from '../../shared/interfaces/course.interfaces';
import { Location } from '@angular/common';
import { CoursesService } from '../../core/services/courses.service';

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
  currentDragStageId: string | null = null;

  uploadedFile: { file: File; url: string } | null = null;

  courseInfo: ICourseCreate = {
    title: '',
    description: '',
    price: 0,
    photoUrl: '',
    requirementList: [],
    lessonCourse: [],
  };

  fullLessons: ILessonOverview[] = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private message: MessageService,
    private translate: TranslateService,
    private ImageService: ImageService,
    private UserService: UserService,
    private CourseService: CoursesService
  ) {}

  ngOnInit(): void {
    this.initView();
    this.listenToUser();
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((user) => {
        this.user = user;
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
    this.CourseService.onGetInstructorCourseDetails(courseId).subscribe(
      (res) => {
        if (!res?.payload) return;

        this.courseInfo = {
          courseId: res.payload.id,
          title: res.payload.title,
          description: res.payload.description,
          price: res.payload.price,
          photoUrl: res.payload.photoUrl,
          requirementList: res.payload.requirementList,
          lessonCourse: res.payload.listLesson.map((l) => {
            return {
              id: l.id,
              name: l.name,
              index: l.index,
              description: '',
              materialIds: l.materials.map((m) => m.id),
            };
          }),
        };

        this.fullLessons = res.payload.listLesson.sort(
          (a, b) => a.index - b.index
        );
      }
    );
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
    this.uploadedFile = {
      url: URL.createObjectURL(croppedFile),
      file: croppedFile,
    };
  }

  onRemoveImage(e: Event) {
    e.stopPropagation();
    this.courseInfo.photoUrl = '';
    this.uploadedFile = null;
  }

  onAddRequirement() {
    this.courseInfo.requirementList.push('');
  }

  onRemoveRequirement(idx: number) {
    this.courseInfo.requirementList.splice(idx, 1);
  }

  RequirementTrackIdx(index: number, item: string) {
    return index;
  }

  onValidateCourseInfo(course: any) {
    const courseKey = Object.keys(course).filter((k) => k !== 'photoUrl');
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
    if (!this.onValidateCourseInfo(this.courseInfo) || !this.uploadedFile?.file)
      return;

    this.ImageService.uploadImage(this.uploadedFile.file).subscribe((res) => {
      if (!res?.payload) return;

      this.courseInfo.photoUrl = res.payload.url;

      this.CourseService.createCourse(this.courseInfo);
    });
  }

  onUpdate() {
    this.courseInfo = {
      ...this.courseInfo,
      lessonCourse: this.fullLessons.map((lesson, index) => {
        return {
          id: lesson.id,
          name: lesson.name,
          index,
          description: '',
          materialIds: lesson.materials.map((material) => material.id),
        };
      }),
    };

    this.CourseService.updateCourse(this.courseInfo);
  }

  onCancel() {
    this.location.back();
  }

  onEditLesson(event: ILessonOverview | string) {
    if (typeof event === 'string') {
      this.fullLessons = this.fullLessons.filter(
        (lesson) => lesson.id !== event
      );
      return;
    }
    const idx = this.fullLessons.findIndex((lesson) => lesson.id === event.id);
    if (idx === -1) return;
    this.fullLessons[idx] = event;
  }

  trackStageChange(index: number) {
    return index;
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
      const dropIndx = this.fullLessons.findIndex(
        (c) => c.id === droppedOnStageId
      );

      const dragStage = this.fullLessons.find(
        (s) => s.id === this.currentDragStageId
      );

      this.fullLessons = this.fullLessons.filter(
        (c) => c.id !== this.currentDragStageId
      );

      this.fullLessons = [
        ...this.fullLessons.slice(0, dropIndx),
        dragStage as ILessonOverview,
        ...this.fullLessons.slice(dropIndx),
      ];
    }

    this.currentDragStageId = null;
  }

  onAddNewStage() {
    const newStage: ILessonOverview = {
      id: `stage-${this.fullLessons.length + 1}`,
      name: '',
      totalTime: 0,
      index: this.fullLessons.length,
      materials: [],
    };
    this.fullLessons.push(newStage);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
