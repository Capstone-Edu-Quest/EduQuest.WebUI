import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  type OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ILearningMaterial } from '../../../../shared/interfaces/course.interfaces';
import { faCheck, faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getAlphabetByIndex } from '../../../../core/utils/quiz.utils';
import { MessageService } from '../../../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { MaterialTypeEnum } from '@/src/app/shared/enums/course.enum';
import { CoursesService } from '@/src/app/core/services/courses.service';
import { exportExcel, readExcelFile } from '@/src/app/core/utils/ExcelUtils';
import { LoadingService } from '@/src/app/core/services/loading.service';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.scss',
})
export class CreateQuizComponent implements OnInit, OnDestroy {
  @ViewChild('inputXLSX') inputXLSXRef!: ElementRef<any>;

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
    private course: CoursesService,
    private loading: LoadingService
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

  onDownloadQuestionTemplate() {
    const demoTemplate = [
      {
        question: 'Demo question',
        correctAnswerNumber: 1,
        answer1: 'Correct Answer',
        answer2: 'Wrong answer',
        answer3: 'Wrong Answer',
        answer4: 'Wrong answer',
      },
    ];
    exportExcel(demoTemplate, 'QuizAnswerTemplate', 'QuizAnswerTemplate');
  }

  onClickImport() {
    this.inputXLSXRef?.nativeElement?.click();
  }

  async onFileSelected(e: any) {
    const files: FileList = e.target.files;
    const fileArray = Array.from(files);

    const readQueue = fileArray.map((f: File) => readExcelFile(f));

    const results = await Promise.all(readQueue);
    const questionData = results.flatMap((json) => json);

    questionData.forEach((importedData) => {
      if (!this.material.quiz) return;
      const { question, correctAnswerNumber, ...answers } = importedData;

      this.material.quiz.questions.push({
        questionTitle: question ?? '',
        multipleAnswers: false,
        answers: Object.entries(answers).map(([key, value], index) => {
          return {
            answerContent: (value as string) ?? '',
            isCorrect: index === correctAnswerNumber - 1,
          };
        }),
      });
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

    this.course.updateMaterial(this.material)
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
