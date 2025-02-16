import { UserService } from './../../core/services/user.service';
import {
  Component,
  OnDestroy,
  ViewChild,
  type OnInit,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCamera, faPlus, faRemove } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { MessageService } from '../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { ImageService } from '../../core/services/image.service';
import { FirebaseStorageFolder } from '../../shared/enums/firebase.enum';
import { IUser } from '../../shared/interfaces/user.interfaces';
import { FirebaseService } from '../../core/services/firebase.service';
import { ICourseCreate } from '../../shared/interfaces/course.interfaces';

@Component({
  selector: 'app-my-course-add',
  templateUrl: './my-course-add.component.html',
  styleUrl: './my-course-add.component.scss',
})
export class MyCourseAddComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;

  addIcon = faPlus;
  removeIcon = faRemove;

  subscription$: Subscription = new Subscription();
  user: IUser | null = null;

  courseId!: string | null;

  cameraIcon = faCamera;

  isEdit: boolean = false;
  isDragOverImgInput: boolean = false;
  imageName: string = `userid_${Date.now()}`;
  isUploadedFirstTime: boolean = false;
  uploadProgress: number | null = null;
  // currentImageURL: string | null = null;

  courseInfo: ICourseCreate = {
    name: '',
    description: '',
    price: 0,
    image: '',
    requirements: [],
  };

  constructor(
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
        this.courseId = courseId;
        this.isEdit = Boolean(courseId);
      })
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

  onCreateCourse() {
    const course: any = {
      ...this.courseInfo,
      // instructor: this.user.id,
    };

    const courseKey = Object.keys(course);
    if(course.image === '') {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.COURSE_NEED_THUMBNAIL')
      );
      return
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
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
