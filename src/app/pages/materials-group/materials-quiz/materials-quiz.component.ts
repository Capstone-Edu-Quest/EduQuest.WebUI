import { Component, type OnInit } from '@angular/core';
import {
  faPen,
  faPlus,
  faQuestion,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { IMaterial, IQuiz } from '../../../shared/interfaces/course.interfaces';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-materials-quiz',
  templateUrl: './materials-quiz.component.html',
  styleUrl: './materials-quiz.component.scss',
})
export class MaterialsQuizComponent implements OnInit {
  addIcon = faPlus;
  editIcon = faPen;
  deleteIcon = faTrash;
  clockIcon = faClock;
  questionIcon = faQuestion;

  quizMaterials: IMaterial<IQuiz>[] = [
    {
      id: 'quiz-1',
      name: 'JavaScript Basics',
      description: 'A quiz to test your fundamental JavaScript knowledge.',
      type: 'quiz',
      data: {
        timeLimit: 15, // minutes
        passingPercentages: 70,
        questions: [
          {
            id: 'q1',
            question: 'What is the output of `console.log(typeof null)`?',
            answers: [
              { id: 'a', content: "'null'", isCorrect: false },
              { id: 'b', content: "'object'", isCorrect: false },
              { id: 'c', content: "'undefined'", isCorrect: false },
              { id: 'd', content: "'string'", isCorrect: true },
            ],
          },
          {
            id: 'q2',
            question: 'Which keyword is used to declare a variable in ES6?',
            answers: [
              { id: 'a', content: "'null'", isCorrect: false },
              { id: 'b', content: "'object'", isCorrect: false },
              { id: 'c', content: "'undefined'", isCorrect: false },
              { id: 'd', content: "'string'", isCorrect: true },
            ],
          },
        ],
      },
    },
    {
      id: 'quiz-2',
      name: 'Angular Fundamentals',
      description: 'Test your knowledge of Angular framework basics.',
      type: 'quiz',
      data: {
        timeLimit: 20,
        passingPercentages: 75,
        questions: [
          {
            id: 'q1',
            question:
              'Which directive is used for looping through an array in Angular?',
            answers: [
              { id: 'a', content: "'null'", isCorrect: false },
              { id: 'b', content: "'object'", isCorrect: false },
              { id: 'c', content: "'undefined'", isCorrect: false },
              { id: 'd', content: "'string'", isCorrect: true },
            ],
          },
          {
            id: 'q2',
            question:
              'What is the default change detection strategy in Angular?',
            answers: [
              { id: 'a', content: "'null'", isCorrect: false },
              { id: 'b', content: "'object'", isCorrect: false },
              { id: 'c', content: "'undefined'", isCorrect: false },
              { id: 'd', content: "'string'", isCorrect: true },
            ],
          },
        ],
      },
    },
    {
      id: 'quiz-3',
      name: 'TypeScript Essentials',
      description: 'Check your understanding of TypeScript concepts.',
      type: 'quiz',
      data: {
        timeLimit: 10,
        passingPercentages: 80,
        questions: [
          {
            id: 'q1',
            question: 'What does the `readonly` modifier do in TypeScript?',
            answers: [
              { id: 'a', content: "'null'", isCorrect: false },
              { id: 'b', content: "'object'", isCorrect: false },
              { id: 'c', content: "'undefined'", isCorrect: false },
              { id: 'd', content: "'string'", isCorrect: true },
            ],
          },
          {
            id: 'q2',
            question: 'Which type allows both numbers and strings?',
            answers: [
              { id: 'a', content: "'null'", isCorrect: false },
              { id: 'b', content: "'object'", isCorrect: false },
              { id: 'c', content: "'undefined'", isCorrect: false },
              { id: 'd', content: "'string'", isCorrect: true },
            ],
          },
        ],
      },
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onCreate() {
    this.router.navigate(['materials', 'quiz', 'new']);
  }

  onEdit(e: Event, id: string) {
    e.stopPropagation();
    this.router.navigate(['materials', 'quiz', id]);
  }

  onDelete(e: Event, id: string) {
    e.stopPropagation();
  }
}
