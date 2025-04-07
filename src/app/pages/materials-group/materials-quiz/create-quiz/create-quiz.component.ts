import { Location } from '@angular/common';
import { Component, OnDestroy, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ILearningMaterial } from '../../../../shared/interfaces/course.interfaces';
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
    quiz: {
      timeLimit: 0,
      passingPercentage: 0,
      questions: [],
    },
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
    this.course.getMaterialById(quizId).subscribe((res) => {
      if (!res?.payload) return;

      this.material = res.payload;
    });
  }

  onAddQuestion() {
    if (!this.material.quiz) return;
    this.material.quiz.questions.push({
      questionTitle: '',
      multipleAnswers: false,
      answers: [
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
    if (!this.material.quiz) return;

    this.material.quiz.questions.splice(index, 1);
  }

  onSetCorrectAnswer(questionIndex: number, answerIndex: number) {
    if (!this.material.quiz) return;

    this.material.quiz.questions[questionIndex].answers.forEach(
      (answer, idx) => {
        answer.isCorrect = idx === answerIndex;
      }
    );
  }

  getQuestionAlphabet(aIdx: number) {
    return getAlphabetByIndex(aIdx);
  }

  onAddAnswer(questionIndex: number) {
    if (!this.material.quiz) return;
    this.material.quiz.questions[questionIndex].answers.push({
      answerContent: '',
      isCorrect: false,
    });
  }

  onRemoveAnswer(questionIndex: number, answerIndex: number) {
    if (!this.material.quiz) return;
    this.material.quiz.questions[questionIndex].answers.splice(answerIndex, 1);
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
    if (!this.material.quiz) return;

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

    if (this.material.quiz.timeLimit < 0) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.INVALID_TIME_LIMIT')
      );
      return;
    }

    if (
      this.material.quiz.passingPercentage < 0 ||
      this.material.quiz.passingPercentage > 100
    ) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.INVALID_PASSING_PERCENTAGE')
      );
      return;
    }

    if (this.material.quiz.questions.length < 2) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.NEED_ALEAST_QUESTIONS', { value: 2 })
      );
      return;
    }

    for (let i = 0; i < this.material.quiz.questions.length; i++) {
      const q = this.material.quiz.questions[i];

      if (q.answers.length < 2) {
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

      for (let j = 0; j < q.answers.length; j++) {
        const a = q.answers[j];
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
