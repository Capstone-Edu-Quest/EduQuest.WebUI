import { Location } from '@angular/common';
import { Component, OnDestroy, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  IMaterial,
  IMaterialCreate,
  IQuiz,
} from '../../../../shared/interfaces/course.interfaces';
import { faCheck, faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getAlphabetByIndex } from '../../../../core/utils/quiz.utils';
import { MessageService } from '../../../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.scss',
})
export class CreateQuizComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  isEdit: boolean = false;

  material: IMaterial<IQuiz> | IMaterialCreate<IQuiz> = {
    name: '',
    description: '',
    type: 'Quiz',
    data: {
      timeLimit: 0, // minutes
      passingPercentages: 0,
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
    private translate: TranslateService
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
    // this.material = this.materialService.getMaterial(quizId);
    this.material = {
      id: 'quiz-3',
      name: 'TypeScript Essentials',
      description: 'Check your understanding of TypeScript concepts.',
      type: 'Quiz',
      data: {
        timeLimit: 10,
        passingPercentages: 60,
        questions: [
          {
            id: 'q1',
            question: 'What does the `readonly` modifier do in TypeScript?',
            answers: [
              {
                id: 'a1',
                content: 'Makes a property immutable',
                isCorrect: true,
              },
              { id: 'a2', content: 'Removes the property', isCorrect: false },
              { id: 'a3', content: 'Hides the property', isCorrect: false },
            ],
          },
          {
            id: 'q2',
            question: 'Which type allows both numbers and strings?',
            answers: [
              { id: 'b1', content: 'union type', isCorrect: true },
              { id: 'b2', content: 'any', isCorrect: false },
              { id: 'b3', content: 'object', isCorrect: false },
            ],
          },
        ],
      },
    };
  }

  onAddQuestion() {
    this.material.data.questions.push({
      question: '',
      answers: [
        {
          content: '',
          isCorrect: false,
        },
        {
          content: '',
          isCorrect: false,
        },
      ],
    });
  }

  onRemoveQuestion(index: number) {
    this.material.data.questions.splice(index, 1);
  }

  onSetCorrectAnswer(questionIndex: number, answerIndex: number) {
    this.material.data.questions[questionIndex].answers.forEach(
      (answer, idx) => {
        answer.isCorrect = idx === answerIndex;
      }
    );
  }

  getQuestionAlphabet(aIdx: number) {
    return getAlphabetByIndex(aIdx);
  }

  onAddAnswer(questionIndex: number) {
    this.material.data.questions[questionIndex].answers.push({
      content: '',
      isCorrect: false,
    });
  }

  onRemoveAnswer(questionIndex: number, answerIndex: number) {
    this.material.data.questions[questionIndex].answers.splice(answerIndex, 1);
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

    console.log(this.material);
  }

  onValidate() {
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

    if (this.material.data.timeLimit < 0) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.INVALID_TIME_LIMIT')
      );
      return;
    }

    if (this.material.data.passingPercentages < 0) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.INVALID_PASSING_PERCENTAGE')
      );
      return;
    }

    if (this.material.data.questions.length < 2) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.NEED_ALEAST_QUESTIONS', { value: 2 })
      );
      return;
    }

    for (let i = 0; i < this.material.data.questions.length; i++) {
      const q = this.material.data.questions[i];

      if (q.answers.length < 2) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.NEED_ALEAST_ANSWERS', { value: 2 })
        );
        return;
      }

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
        if (a.content.trim() === '') {
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
