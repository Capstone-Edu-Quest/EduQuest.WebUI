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
  ISubmitAssignment,
  ISubmitQuizReq,
  ISubmittedQuestResponse,
} from '@/src/app/shared/interfaces/course.interfaces';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  type OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { faAngleLeft, faCircle } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '@/src/app/core/services/user.service';

@Component({
  selector: 'app-studying-material',
  templateUrl: './studying-material.component.html',
  styleUrl: './studying-material.component.scss',
})
export class StudyingMaterialComponent implements OnInit {
  @Input('courseDetails') courseDetails!: ICourse;
  @Input('viewingMaterial') viewingMaterial: ILearningMaterial | null = null;
  @Output('onFinish') onFinish: EventEmitter<string> =
    new EventEmitter<string>();

  quizAnswersId: { questionId: string; answerId: string }[] = [];

  countdown: number = 0;
  isQuizStarted: boolean = false;
  countdownInterval: any = null;
  isNoTimeLimit: boolean = false;

  videoDuration: number = 0;
  isUpdatedStatus: boolean = false;

  quizResult: null | ISubmittedQuestResponse = null;

  assignmentContent: string = '';

  constructor(
    private router: Router,
    private CoursesService: CoursesService,
    private user: UserService
  ) {}

  ngOnInit(): void {
    this.isNoTimeLimit = false;
    if (this.viewingMaterial?.assignment) {
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
    }
  }

  backIcon = faAngleLeft;
  circleIcon = faCircle;

  onBack() {
    this.router.navigate([], { queryParams: {} });
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
      const index = l.materials.findIndex(
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
    if (time / this.videoDuration <= 0.8 || this.isUpdatedStatus) return;

    const lessonId = this.getLessonIdByMaterialId();
    if (!lessonId || !this.viewingMaterial?.id) return;

    this.isUpdatedStatus = true;
    this.user
      .updateUserLearningProgress(this.viewingMaterial.id, lessonId, null)
      .subscribe((res) => {
        console.log('Update Progress: ', res);
        this.triggerFinish();
      });
  }

  getLessonIdByMaterialId() {
    let lessonId = null;
    this.courseDetails.listLesson.forEach((l) => {
      const index = l.materials.findIndex(
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
      const index = l.materials.findIndex(
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
      answerContent: this.assignmentContent,
    };

    this.CoursesService.onSubmitAssignment(result, lessonId).subscribe(
      (res) => {
        if (res?.payload) {
          this.triggerFinish();
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
    const mId = this.viewingMaterial?.id;
    this.onFinish.emit(mId);
  }
}
