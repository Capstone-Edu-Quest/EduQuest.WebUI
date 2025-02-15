import { UserService } from './../../core/services/user.service';
import {
  Component,
  OnDestroy,
  ViewChild,
  type OnInit,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { MessageService } from '../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { ImageService } from '../../core/services/image.service';
import { FirebaseStorageFolder } from '../../shared/enums/firebase.enum';
import { IUser } from '../../shared/interfaces/user.interfaces';
import { FirebaseService } from '../../core/services/firebase.service';

@Component({
  selector: 'app-my-course-add',
  templateUrl: './my-course-add.component.html',
  styleUrl: './my-course-add.component.scss',
})
export class MyCourseAddComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;

  subscription$: Subscription = new Subscription();
  user: IUser | null = null;

  courseId!: string | null;

  cameraIcon = faCamera;

  isEdit: boolean = false;
  isDragOverImgInput: boolean = false;
  imageName: string = `[userid]_${Date.now()}`;
  uploadProgress: number | null = null;
  currentImageURL: string | null = null;

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
        this.imageName.replace('[userid]', user?.id || '[userid]');
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
    this.currentImageURL = url;
    this.firebase.addCacheImage(url);
  }

  onRemoveImage(e: Event) {
    e.stopPropagation();
    this.currentImageURL = null;
  }



  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
