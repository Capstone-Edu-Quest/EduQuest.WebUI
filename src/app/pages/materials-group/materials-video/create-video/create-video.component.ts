import { VideoService } from './../../../../core/services/video.service';
import { UserService } from './../../../../core/services/user.service';
import {
  Component,
  ElementRef,
  ViewChild,
  type OnInit,
  OnDestroy,
} from '@angular/core';
import { MessageService } from '../../../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { faPlus, faRemove, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FirebaseStorageFolder } from '../../../../shared/enums/firebase.enum';
import { Subscription } from 'rxjs';
import { IUser } from '../../../../shared/interfaces/user.interfaces';
import {
  IMaterialCreate,
  IVideo,
} from '../../../../shared/interfaces/course.interfaces';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-video',
  templateUrl: './create-video.component.html',
  styleUrl: './create-video.component.scss',
})
export class CreateVideoComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;

  subscription$: Subscription = new Subscription();

  addIcon = faPlus;
  removeIcon = faRemove;
  cameraIcon = faVideo;

  material: IMaterialCreate<IVideo> = {
    name: '',
    description: '',
    type: 'video',
    data: {
      url: '',
      duration: 0,
    },
  };

  user: IUser | null = null;

  isEdit: boolean = false;
  isDragOverImgInput: boolean = false;
  videoName: string = `userid_${Date.now()}`;
  isUploadedFirstTime: boolean = false;
  compressProgress: string | null = null;
  uploadProgress: number | null = null;

  constructor(
    private location: Location,
    private message: MessageService,
    private translate: TranslateService,
    private VideoService: VideoService,
    private UserService: UserService,
    private firebase: FirebaseService
  ) {}

  ngOnInit(): void {
    this.listenToVideoCompressingProgress();
    this.listenToUser();
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((user) => {
        this.user = user;
        this.videoName = this.videoName.replace('userid', user?.id || 'userid');
      })
    );
  }

  listenToVideoCompressingProgress() {
    this.subscription$.add(
      this.VideoService.compressingProgress$.subscribe((progress) => {
        this.compressProgress = progress;
      })
    );
  }

  onClickAddVideo() {
    if (
      !this.fileInput.nativeElement ||
      this.uploadProgress ||
      this.compressProgress ||
      this.material.data.url !== ''
    )
      return;
    this.fileInput?.nativeElement?.click();
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
    const isValid = await this.VideoService.vailidateVideoFile(file);

    if (!isValid) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.INVALID_VIDEO')
      );
      return;
    }

    const { progress$, downloadURL$ } =
      await this.VideoService.uploadVideoToFirebaseStorage(
        FirebaseStorageFolder.COURSE_VIDEO,
        file,
        this.videoName
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
  }

  onUploadSuccess(url: string) {
    this.uploadProgress = null;
    this.material.data.url = url;
    !this.isUploadedFirstTime && this.firebase.addCacheImage(url);
    this.isUploadedFirstTime = true;
  }

  onRemoveVideo(e: Event) {
    e.stopPropagation();
    this.material.data.url = '';
    this.material.data.duration = 0;
  }

  onCancelCompressVideo(e: Event) {
    e.stopPropagation();
    this.VideoService.stopCompressing();
  }

  onLoadedVideo(initState: any) {
    if(initState) {
      this.material.data.duration = initState.duration;
    }
  }

  onCancel() {
    this.location.back()
  }

  onValidate() {
    if(this.material.data.url === '') {
      this.message.addMessage('error', this.translate.instant('MESSAGE.NEED_TO_UPLOAD_VIDEO'));
      return;
    }

    if(this.material.name.trim() === '' || this.material.description.trim() === '') {
      this.message.addMessage('error', this.translate.instant('MESSAGE.MISSING_FIELDS'));
      return;
    }

    return true;
  }

  onUpdate() {}

  onCreate() {
    if(!this.onValidate()) return;

    console.log(this.material)
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
