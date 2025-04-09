import { getAlphabetByIndex } from '@/src/app/core/utils/quiz.utils';
import { onAddZeroToTime } from '@/src/app/core/utils/time.utils';
import { MaterialTypeEnum } from '@/src/app/shared/enums/course.enum';
import { ILearningMaterial } from '@/src/app/shared/interfaces/course.interfaces';
import { Component, Input, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAngleLeft, faCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-studying-material',
  templateUrl: './studying-material.component.html',
  styleUrl: './studying-material.component.scss',
})
export class StudyingMaterialComponent implements OnInit {
  @Input('viewingMaterial') viewingMaterial: ILearningMaterial | null = null;

  quizAnswersId: { questionId: string; answerId: string }[] = [];

  countdown: number = 0;
  isQuizStarted: boolean = false;
  countdownInterval: any = null;

  constructor(private router: Router) {}
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
}
