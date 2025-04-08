import { VideoService } from './../../../../core/services/video.service';
import {
  Component,
  ElementRef,
  ViewChild,
  type OnInit,
  OnDestroy,
} from '@angular/core';
import { MessageService } from '../../../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import {
  faCheck,
  faPlus,
  faRemove,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { IUser } from '../../../../shared/interfaces/user.interfaces';
import { ILearningMaterial } from '../../../../shared/interfaces/course.interfaces';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { getAlphabetByIndex } from '../../../../core/utils/quiz.utils';
import { CoursesService } from '@/src/app/core/services/courses.service';
import { MaterialTypeEnum } from '@/src/app/shared/enums/course.enum';

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

  material: ILearningMaterial = {
    title: '',
    description: '',
    type: MaterialTypeEnum.VIDEO,
    video: {
      urlMaterial: '',
      duration: 0,
      thumbnail: '',
    },
  };

  user: IUser | null = null;

  isEdit: boolean = false;
  isDragOverImgInput: boolean = false;

  uploadedFile: null | { file: File; url: string } = null;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private message: MessageService,
    private translate: TranslateService,
    private VideoService: VideoService,
    private course: CoursesService
  ) {}

  ngOnInit(): void {
    this.initView();
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
    this.course.getMaterialById(videoId).subscribe((res) => {
      if (!res?.payload) return;

      this.material = res.payload;
    });
  }

  onClickAddVideo() {
    if (
      !this.fileInput.nativeElement ||
      this.material.video?.urlMaterial !== ''
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
    if (!files) return;

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

    const videoUrl = URL.createObjectURL(file);
    this.uploadedFile = {
      url: videoUrl,
      file,
    };
  }

  onUploadSuccess(url: string) {
    if (!this.material.video) return;
    this.material.video.urlMaterial = url;
  }

  onRemoveVideo(e: Event) {
    if (!this.material.video) return;

    e.stopPropagation();
    this.material.video.urlMaterial = '';
    this.material.video.duration = 0;
    this.uploadedFile = null;
  }

  onCancelCompressVideo(e: Event) {
    e.stopPropagation();
    this.VideoService.stopCompressing();
  }

  onLoadedVideo(initState: any) {
    if (!this.material.video) return;

    this.material.video.duration = initState.duration / 60;
  }

  onCancel() {
    this.location.back();
  }

  onValidate() {
    if (!this.material.video) return;

    if (this.material.video.urlMaterial === '' && !this.uploadedFile) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.NEED_TO_UPLOAD_VIDEO')
      );
      return;
    }

    if (
      this.material.title.trim() === '' ||
      this.material.description.trim() === ''
    ) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.MISSING_FIELDS')
      );
      return;
    }

    // for (let i = 0; i < this.material.data.questions.length; i++) {
    //   const q = this.material.data.questions[i];

    //   if(q.answers.length < 2) {
    //     this.message.addMessage(
    //       'error',
    //       this.translate.instant('MESSAGE.NEED_ALEAST_ANSWERS', {value: 2})
    //     );
    //     return;
    //   }

    //   let correctIdx = -1;
    //   if (q.question.trim() === '') {
    //     this.message.addMessage(
    //       'error',
    //       this.translate.instant('MESSAGE.MISSING_QUESTION')
    //     );
    //     return;
    //   }

    //   for (let j = 0; j < q.answers.length; j++) {
    //     const a = q.answers[j];
    //     if (a.answer.trim() === '') {
    //       this.message.addMessage(
    //         'error',
    //         this.translate.instant('MESSAGE.MISSING_ANSWER')
    //       );
    //       return;
    //     }

    //     if(a.isCorrect) {
    //       correctIdx = j;
    //     }
    //   }

    //   if(correctIdx === -1) {
    //     this.message.addMessage(
    //       'error',
    //       this.translate.instant('MESSAGE.MISSING_CORRECT_ANSWER')
    //     );
    //     return;
    //   }
    // }

    return true;
  }

  onUpdate() {
    if (!this.onValidate()) return;

    console.log(this.material);
  }

  onCreate() {
    if (!this.onValidate() || !this.uploadedFile) return;

    this.VideoService.uploadVideo(this.uploadedFile.file).subscribe((url) => {
      if (!this.material.video) return;
      this.material.video.urlMaterial = url;

      this.course.createMaterial(this.material);
    });
  }

  onAddFastQuestion() {
    // this.material.data.questions.push({
    //   question: '',
    //   answers: [
    //     {
    //       answer: '',
    //       isCorrect: false,
    //     },
    //     {
    //       answer: '',
    //       isCorrect: false,
    //     },
    //   ],
    // });
  }

  onRemoveFastQuestion(qIdx: number) {
    // this.material.data.questions.splice(qIdx, 1);
  }

  getQuestionAlphabet(aIdx: number) {
    return getAlphabetByIndex(aIdx);
  }

  onAddFQAnswer(qIdx: number) {
    // this.material.data.questions[qIdx].answers.push({
    //   answer: '',
    //   isCorrect: false,
    // });
  }

  onRemoveFQAnswer(qIdx: number, aIdx: number) {
    // this.material.data.questions[qIdx].answers.splice(aIdx, 1);
  }

  onSetCorrectAnswer(qIdx: number, aIdx: number) {
    // this.material.data.questions[qIdx].answers.forEach((a, idx) => {
    //   a.isCorrect = idx === aIdx;
    // });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
