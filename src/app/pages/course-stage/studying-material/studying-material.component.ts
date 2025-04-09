import { CoursesService } from 'src/app/core/services/courses.service';
import { getAlphabetByIndex } from '@/src/app/core/utils/quiz.utils';
import { onAddZeroToTime } from '@/src/app/core/utils/time.utils';
import { MaterialTypeEnum } from '@/src/app/shared/enums/course.enum';
import {
  ICourse,
  ILearningMaterial,
  ISubmitQuizReq,
} from '@/src/app/shared/interfaces/course.interfaces';
import { Component, Input, type OnInit } from '@angular/core';
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

  quizAnswersId: { questionId: string; answerId: string }[] = [];

  countdown: number = 0;
  isQuizStarted: boolean = false;
  countdownInterval: any = null;

  videoDuration: number = 0;
  isUpdatedStatus: boolean = false;

  constructor(
    private router: Router,
    private CoursesService: CoursesService,
    private user: UserService
  ) {}

  ngOnInit(): void {
    if (this.viewingMaterial?.assignment) {
      this.countdown = Number(this.viewingMaterial?.assignment?.timeLimit) * 60;
      this.countdownInterval = setInterval(() => {
        this.countdown--;

        if (this.countdown === 0) {
          clearInterval(this.countdownInterval);
        }
      }, 1000);
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
    this.countdown = this.viewingMaterial.quiz?.timeLimit * 60;
    this.quizAnswersId = [];

    this.countdownInterval = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
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

    this.CoursesService.onSubmitQuiz(quizData, lessonId as string).subscribe(
      (res) => {
        console.log(res);
      }
    );
  }

  handleVideoLoaded(e: any) {
    this.videoDuration = e.duration;
  }

  trackVideoProgress(time: number) {
    if (time / this.videoDuration <= 0.9 || this.isUpdatedStatus) return;

    
    const lessonId = this.getLessonIdByMaterialId();
    if (!lessonId || !this.viewingMaterial?.id) return;
    
    this.isUpdatedStatus = true;
    this.user
      .updateUserLearningProgress(this.viewingMaterial.id, lessonId, null)
      .subscribe((res) => {
        console.log(res);
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
}
