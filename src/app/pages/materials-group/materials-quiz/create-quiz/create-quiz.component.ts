import { Location } from '@angular/common';
import { Component, OnDestroy, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  ILearningMaterial,
} from '../../../../shared/interfaces/course.interfaces';
import { faCheck, faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getAlphabetByIndex } from '../../../../core/utils/quiz.utils';
import { MessageService } from '../../../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { MaterialTypeEnum } from '@/src/app/shared/enums/course.enum';
import { CoursesService } from '@/src/app/core/services/courses.service';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.scss',
})
export class CreateQuizComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  isEdit: boolean = false;

  material: ILearningMaterial = {
    title: '',
    description: '',
    type: MaterialTypeEnum.QUIZ,
    quizRequest: {
      timeLimit: 0,
      passingPercentage: 0,
      questionRequest: []
    }
  };

  addIcon = faPlus;
  removeIcon = faClose;
  correctIcon = faCheck;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private message: MessageService,
    private translate: TranslateService,
    private course: CoursesService
  ) {}

  ngOnInit(): void {
    this.listenToRoute();
  }

  listenToRoute() {
    this.subscription$.add(
      this.route.paramMap.subscribe((params) => {
        const quizId = params.get('quizId');
        this.isEdit = !!quizId;
        if (!!quizId) {
          this.onInitQuiz(quizId);
        }
      })
    );
  }

  onInitQuiz(quizId: string) {

  }

  onAddQuestion() {
    if(!this.material.quizRequest) return;
    this.material.quizRequest.questionRequest.push({
      questionTitle: '',
      multipleAnswers: false,
      answerRequest: [
        {
          answerContent: '',
          isCorrect: false,
        },
        {
          answerContent: '',
          isCorrect: false,
        },
      ],
    });
  }

  onRemoveQuestion(index: number) {
    if(!this.material.quizRequest) return;

    this.material.quizRequest.questionRequest.splice(index, 1);
  }

  onSetCorrectAnswer(questionIndex: number, answerIndex: number) {
    if(!this.material.quizRequest) return;

    this.material.quizRequest.questionRequest[questionIndex].answerRequest.forEach(
      (answer, idx) => {
        answer.isCorrect = idx === answerIndex;
      }
    );
  }

  getQuestionAlphabet(aIdx: number) {
    return getAlphabetByIndex(aIdx);
  }

  onAddAnswer(questionIndex: number) {
    if(!this.material.quizRequest) return
    this.material.quizRequest.questionRequest[questionIndex].answerRequest.push({
      answerContent: '',
      isCorrect: false,
    });
  }

  onRemoveAnswer(questionIndex: number, answerIndex: number) {
    if(!this.material.quizRequest) return
    this.material.quizRequest.questionRequest[questionIndex].answerRequest.splice(answerIndex, 1);
  }

  onCancel() {
    this.location.back();
  }

  onUpdate() {
    if (!this.onValidate()) {
      return;
    }

    console.log(this.material);
  }

  onCreate() {
    if (!this.onValidate()) {
      return;
    }

    this.course.createMaterial(this.material);
  }

  onValidate() {
    if(!this.material.quizRequest) return

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

    if (this.material.quizRequest.timeLimit < 0) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.INVALID_TIME_LIMIT')
      );
      return;
    }

    if (this.material.quizRequest.passingPercentage < 0 || this.material.quizRequest.passingPercentage > 100) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.INVALID_PASSING_PERCENTAGE')
      );
      return;
    }

    if (this.material.quizRequest.questionRequest.length < 2) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.NEED_ALEAST_QUESTIONS', { value: 2 })
      );
      return;
    }

    for (let i = 0; i < this.material.quizRequest.questionRequest.length; i++) {
      const q = this.material.quizRequest.questionRequest[i];

      if (q.answerRequest.length < 2) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.NEED_ALEAST_ANSWERS', { value: 2 })
        );
        return;
      }

      let correctIdx = -1;
      if (q.questionTitle.trim() === '') {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.MISSING_QUESTION')
        );
        return;
      }

      for (let j = 0; j < q.answerRequest.length; j++) {
        const a = q.answerRequest[j];
        if (a.answerContent.trim() === '') {
          this.message.addMessage(
            'error',
            this.translate.instant('MESSAGE.MISSING_ANSWER')
          );
          return;
        }

        if (a.isCorrect) {
          correctIdx = j;
        }
      }

      if (correctIdx === -1) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.MISSING_CORRECT_ANSWER')
        );
        return;
      }
    }

    return true;
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
