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
import {
  faCheck,
  faPlus,
  faRemove,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { FirebaseStorageFolder } from '../../../../shared/enums/firebase.enum';
import { Subscription } from 'rxjs';
import { IUser } from '../../../../shared/interfaces/user.interfaces';
import {
  IMaterial,
  IMaterialCreate,
  IVideo,
} from '../../../../shared/interfaces/course.interfaces';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { getAlphabetByIndex } from '../../../../core/utils/quiz.utils';

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
  correctIcon = faCheck;

  material: IMaterialCreate<IVideo> | IMaterial<IVideo> = {
    name: '',
    description: '',
    type: 'video',
    data: {
      url: '',
      duration: 0,
      questions: [],
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
    private route: ActivatedRoute,
    private location: Location,
    private message: MessageService,
    private translate: TranslateService,
    private VideoService: VideoService,
    private UserService: UserService,
    private firebase: FirebaseService
  ) {}

  ngOnInit(): void {
    this.initView();
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

  initView() {
    this.subscription$.add(
      this.route.paramMap.subscribe((params) => {
        const videoId = params.get('videoId');
        this.isEdit = !!videoId;
        if (!!videoId) {
          this.initMaterial(videoId);
        }
      })
    );
  }

  initMaterial(videoId: string) {
    const testMaterial: IMaterial<IVideo> = {
      id: 'material-1',
      name: 'Test Video',
      description: 'Test Description',
      type: 'video',
      data: {
        url: 'https://firebasestorage.googleapis.com/v0/b/eduquest-1a0bd.firebasestorage.app/o/course-video%2Fa70b6e26-ec51-4ddd-bb7b-05646f614fb3_1740246588021?alt=media&token=adc5efe9-14e3-4786-b1ed-dfa3cc5eec59',
        duration: 14,
        questions: [],
      },
    };

    this.material = testMaterial;
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
    if (initState && this.material) {
      this.material.data.duration = initState.duration;
    }
  }

  onCancel() {
    this.location.back();
  }

  onValidate() {
    if (this.material.data.url === '') {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.NEED_TO_UPLOAD_VIDEO')
      );
      return;
    }

    if (
      this.material.name.trim() === '' ||
      this.material.description.trim() === ''
    ) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.MISSING_FIELDS')
      );
      return;
    }

    for (let i = 0; i < this.material.data.questions.length; i++) {
      const q = this.material.data.questions[i];
      let correctIdx = -1;
      if (q.question.trim() === '') {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.MISSING_QUESTION')
        );
        return;
      }

      for (let j = 0; j < q.answers.length; j++) {
        const a = q.answers[j];
        if (a.answer.trim() === '') {
          this.message.addMessage(
            'error',
            this.translate.instant('MESSAGE.MISSING_ANSWER')
          );
          return;
        }

        if(a.isCorrect) {
          correctIdx = j;
        }
      }

      if(correctIdx === -1) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.MISSING_CORRECT_ANSWER')
        );
        return;
      }
    }

    return true;
  }

  onUpdate() {
    if (!this.onValidate()) return;

    console.log(this.material);
  }

  onCreate() {
    if (!this.onValidate()) return;

    console.log(this.material);
  }

  onAddFastQuestion() {
    this.material.data.questions.push({
      question: '',
      answers: [
        {
          answer: '',
          isCorrect: false,
        },
        {
          answer: '',
          isCorrect: false,
        },
      ],
    });
  }

  onRemoveFastQuestion(qIdx: number) {
    this.material.data.questions.splice(qIdx, 1);
  }

  getQuestionAlphabet(aIdx: number) {
    return getAlphabetByIndex(aIdx);
  }

  onAddFQAnswer(qIdx: number) {
    this.material.data.questions[qIdx].answers.push({
      answer: '',
      isCorrect: false,
    });
  }

  onRemoveFQAnswer(qIdx: number, aIdx: number) {
    this.material.data.questions[qIdx].answers.splice(aIdx, 1);
  }

  onSetCorrectAnswer(qIdx: number, aIdx: number) {
    this.material.data.questions[qIdx].answers.forEach((a, idx) => {
      a.isCorrect = idx === aIdx;
    });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
