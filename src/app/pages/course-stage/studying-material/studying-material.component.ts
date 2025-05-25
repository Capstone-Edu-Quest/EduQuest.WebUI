import { CoursesService } from 'src/app/core/services/courses.service';
import { getAlphabetByIndex } from '@/src/app/core/utils/quiz.utils';
import { onAddZeroToTime } from '@/src/app/core/utils/time.utils';
import {
  MaterialTypeEnum,
  MissionStatus,
} from '@/src/app/shared/enums/course.enum';
import {
  ICourse,
  ILearningMaterial,
  IMarkedAssignment,
  IShardAndLevel,
  ISubmitAssignment,
  ISubmitQuizReq,
  ISubmittedQuestResponse,
} from '@/src/app/shared/interfaces/course.interfaces';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  type OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { faAngleLeft, faCircle } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '@/src/app/core/services/user.service';
import { MessageService } from '@/src/app/core/services/message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-studying-material',
  templateUrl: './studying-material.component.html',
  styleUrl: './studying-material.component.scss',
})
export class StudyingMaterialComponent implements OnInit {
  @Input('courseDetails') courseDetails!: ICourse;
  @Input('viewingMaterial') viewingMaterial: ILearningMaterial | null = null;
  @Output('onHandleShardAndLevelAnimation')
  onHandleShardAndLevelAnimation: EventEmitter<IShardAndLevel> =
    new EventEmitter<IShardAndLevel>();
  @Output('onFinish') onFinish: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  @ViewChild('textEditor') textEditorRef!: ElementRef;

  quizAnswersId: { questionId: string; answerId: string }[] = [];

  countdown: number = 0;
  isQuizStarted: boolean = false;
  countdownInterval: any = null;
  isNoTimeLimit: boolean = false;

  videoDuration: number = 0;
  isUpdatedStatus: boolean = false;

  quizResult: null | ISubmittedQuestResponse = null;

  assignmentContent: string = '';
  answeredAssignment: IMarkedAssignment | null = null;

  isFinished: boolean = false;

  constructor(
    private router: Router,
    private CoursesService: CoursesService,
    private user: UserService,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.checkIfFinishedAssignment();
    this.trackDocumentProgress();
    this.isNoTimeLimit = false;
    this.isFinished =
      this.getCurrentMaterialOverview()?.status === MissionStatus.DONE;
  }

  backIcon = faAngleLeft;
  circleIcon = faCircle;

  onBack() {
    clearInterval(this.countdownInterval);
    this.router.navigate([], { queryParams: {} });
  }

  getCurrentMaterialOverview() {
    for (const lesson of this.courseDetails.listLesson) {
      const material = lesson.contents.find(
        (m) => m.id === this.viewingMaterial?.id
      );
      if (material) {
        return material;
      }
    }
    return null;
  }

  checkIfFinishedAssignment() {
    const assignmentId = this.viewingMaterial?.assignment?.id;
    let lessonId = null;

    this.courseDetails.listLesson.forEach((l) => {
      const index = l.contents.findIndex(
        (m) => m.id === this.viewingMaterial?.id
      );
      if (index !== -1) {
        lessonId = l.id;
      }
    });

    if (!assignmentId || !lessonId) return;

    this.CoursesService.onGetMyAssignment(assignmentId, lessonId).subscribe(
      (res) => {
        if (!res?.payload) {
          if (Number(this.viewingMaterial?.assignment?.timeLimit) > 0) {
            this.countdown =
              Number(this.viewingMaterial?.assignment?.timeLimit) * 60;

            this.countdownInterval = setInterval(() => {
              this.countdown--;

              if (this.countdown === 0) {
                clearInterval(this.countdownInterval);
              }
            }, 1000);
          } else {
            this.isNoTimeLimit = true;
          }
          return;
        }

        this.answeredAssignment = res.payload;
      }
    );
  }

  currentMaterials() {
    if (!this.viewingMaterial) return '';
    switch (this.viewingMaterial.type as any) {
      case 'Video':
      case MaterialTypeEnum.VIDEO:
        return 'Video';
      case 'Quiz':
      case MaterialTypeEnum.QUIZ:
        return 'Quiz';
      case 'Assignment':
      case MaterialTypeEnum.ASSIGNMENT:
        return 'Assignment';
      case 'Document':
      case MaterialTypeEnum.DOCUMENT:
      default:
        return 'Document';
    }
  }

  onRetryQuiz() {
    location.reload();
  }

  onStartQuiz() {
    if (!this.viewingMaterial?.quiz) return;

    this.isQuizStarted = true;
    this.quizAnswersId = [];
    if (this.viewingMaterial.quiz?.timeLimit > 0) {
      this.countdown = this.viewingMaterial.quiz?.timeLimit * 60;

      this.countdownInterval = setInterval(() => {
        this.countdown--;

        if (this.countdown === 0) {
          clearInterval(this.countdownInterval);
        }
      }, 1000);
    } else {
      this.isNoTimeLimit = true;
    }
  }

  convertTimeToCountdown() {
    const seconds = this.countdown % 60;

    return `${onAddZeroToTime(
      (this.countdown - seconds) / 60
    )}:${onAddZeroToTime(seconds)}`;
  }

  onSelectAnswer(qId: string | undefined, aId: string | undefined) {
    if (!qId || !aId) return;

    const qIndex = this.quizAnswersId.findIndex((qa) => qa.questionId === qId);
    if (qIndex === -1) {
      this.quizAnswersId.push({
        questionId: qId,
        answerId: aId,
      });
      return;
    }

    this.quizAnswersId[qIndex].answerId = aId;
  }

  onCheckIsAnswerSelected(qId: string | undefined, aId: string | undefined) {
    if (!qId || !aId) return;

    const qIndex = this.quizAnswersId.findIndex((qa) => qa.questionId === qId);
    if (qIndex === -1) {
      return;
    }

    return this.quizAnswersId[qIndex].answerId === aId;
  }

  getQuestionAlphabet(aIdx: number) {
    return getAlphabetByIndex(aIdx);
  }

  handleSubmitQuiz() {
    if (!this.viewingMaterial?.quiz) return;

    let lessonId = null;

    this.courseDetails.listLesson.forEach((l) => {
      const index = l.contents.findIndex(
        (m) => m.id === this.viewingMaterial?.id
      );
      if (index !== -1) {
        lessonId = l.id;
      }
    });

    if (!lessonId) return;
    const quizData: ISubmitQuizReq = {
      quizId: this.viewingMaterial.quiz.id as string,
      totalTime: Math.ceil(
        Math.abs(
          (this.countdown - this.viewingMaterial.quiz.timeLimit * 60) / 60
        )
      ),
      answers: this.quizAnswersId,
    };

    clearInterval(this.countdownInterval);
    this.CoursesService.onSubmitQuiz(quizData, lessonId as string).subscribe(
      (res) => {
        if (!res?.payload) {
          return;
        }

        this.quizResult = res.payload;
      }
    );
  }

  handleVideoLoaded(e: any) {
    this.videoDuration = e.duration;
  }

  trackVideoProgress(time: number) {
    if (this.viewingMaterial?.status === MissionStatus.DONE) return;
    if (
      time / this.videoDuration <= 0.8 ||
      this.isUpdatedStatus ||
      this.isFinished
    )
      return;

    const lessonId = this.getLessonIdByMaterialId();
    if (!lessonId || !this.viewingMaterial?.id || this.isFinished) return;

    this.isUpdatedStatus = true;
    this.user
      .updateUserLearningProgress(this.viewingMaterial.id, lessonId, null)
      .subscribe((res) => {
        if (!res) {
          this.message.addMessage(
            'error',
            this.translate.instant('MESSAGE.FAIL_UPDATE_PROGRESS')
          );
          return;
        }

        const { addedItemShard, itemShards, levelInfo } = res.payload as any;
        this.onHandleShardAndLevelAnimation.emit({
          addedItemShard,
          itemShards,
          levelInfo,
        });
        this.isFinished = true;
        this.onFinish.emit(false);
      });
  }

  trackDocumentProgress() {
    const materialId = this.viewingMaterial?.id;
    const lessonId = this.getLessonIdByMaterialId();

    let arr: any[] = [];
    this.courseDetails.listLesson.forEach((ls) => arr.push(...ls.contents));

    if (
      (this.viewingMaterial?.type as any) !== 'Document' ||
      !materialId ||
      !lessonId ||
      this.isFinished
    )
      return;

    this.countdown = 10;
    this.countdownInterval = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        clearInterval(this.countdownInterval);
        this.user
          .updateUserLearningProgress(materialId, lessonId, null)
          .subscribe((res) => {
            if (!res) {
              this.message.addMessage(
                'error',
                this.translate.instant('MESSAGE.FAIL_UPDATE_PROGRESS')
              );
              return;
            }
            
            console.log(res)
            const { addedItemShard, itemShards, levelInfo } = res.payload as any;

            this.onHandleShardAndLevelAnimation.emit({
              addedItemShard,
              itemShards,
              levelInfo,
            });
            
            this.isFinished = true;
            this.onFinish.emit(false);
          });
      }
    }, 1000);
  }

  getLessonIdByMaterialId() {
    let lessonId = null;
    this.courseDetails.listLesson.forEach((l) => {
      const index = l.contents.findIndex(
        (m) => m.id === this.viewingMaterial?.id
      );
      if (index !== -1) {
        lessonId = l.id;
      }
    });

    return lessonId;
  }

  onSubmitAssignment() {
    if (!this.viewingMaterial?.assignment) return;

    let lessonId = null;

    this.courseDetails.listLesson.forEach((l) => {
      const index = l.contents.findIndex(
        (m) => m.id === this.viewingMaterial?.id
      );
      if (index !== -1) {
        lessonId = l.id;
      }
    });

    if (!lessonId || !this.viewingMaterial?.assignment?.id) return;

    const result: ISubmitAssignment = {
      assignmentId: this.viewingMaterial.assignment.id,
      totalTime: Math.ceil(
        Math.abs(
          (this.countdown -
            (this.viewingMaterial.assignment?.timeLimit ?? 0) * 60) /
            60
        )
      ),
      answerContent: (this.textEditorRef as any).htmlContent,
    };

    this.CoursesService.onSubmitAssignment(result, lessonId).subscribe(
      (res) => {
        if (res?.payload) {
          this.answeredAssignment = res.payload;
          this.message.addMessage(
            'success',
            this.translate.instant('MESSAGE.SUBMITTED_SUCCESSFULLY')
          );
        }
      }
    );
  }

  onTriggerFinishQuiz() {
    if (this.quizResult?.isPassed) {
      this.triggerFinish();
      return;
    }

    this.isQuizStarted = false;
    this.quizResult = null;
    clearInterval(this.countdownInterval);
  }

  triggerFinish() {
    this.onFinish.emit(true);
  }
}
