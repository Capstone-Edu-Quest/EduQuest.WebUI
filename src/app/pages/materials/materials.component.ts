import { Component, type OnInit } from '@angular/core';
import {
  faAngleDown,
  faAngleRight,
  faCode,
} from '@fortawesome/free-solid-svg-icons';
import {
  IAssignment,
  IDocument,
  IMaterial,
  IQuiz,
  IVideo,
} from '../../shared/interfaces/course.interfaces';
import { faClock, faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { AssignmentLanguageEnum } from '../../shared/enums/materials.enum';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.scss',
})
export class MaterialsComponent implements OnInit {
  clockIcon = faClock;
  viewAllIcon = faAngleRight;
  questionIcon = faQuestionCircle;
  codeIcon = faCode;

  materialsSection = [
    {
      id: 'video',
      label: 'LABEL.VIDEOS',
      description: 'LABEL.VIDEOS_DESCRIPTION',
      value: { value: 22 },
    },
    {
      id: 'document',
      label: 'LABEL.DOCUMENTS',
      description: 'LABEL.DOCUMENTS_DESCRIPTION',
      value: { value: 7 },
    },
    {
      id: 'quiz',
      label: 'LABEL.QUIZ',
      description: 'LABEL.QUIZ_DESCRIPTION',
      value: { value: 6 },
    },
    {
      id: 'assignment',
      label: 'LABEL.ASSIGNMENT',
      description: 'LABEL.ASSIGNMENT_DESCRIPTION',
      value: { value: 2 },
    },
  ];

  videoMaterials: IMaterial<IVideo>[] = [
    {
      id: '1',
      name: 'Introduction to TypeScript',
      description:
        'A beginner-friendly introduction to TypeScript fundamentals.',
      type: 'video',
      data: {
        url: 'https://example.com/videos/typescript-intro.mp4',
        duration: 10, // 10 minutes,
        questions: [],
      },
    },
    {
      id: '2',
      name: 'React State Management',
      description:
        'Learn about state management in React using hooks and Redux.',
      type: 'video',
      data: {
        url: 'https://example.com/videos/react-state.mp4',
        duration: 15, // 15 minutes
        questions: [],
      },
    },
    {
      id: '3',
      name: 'Understanding Asynchronous JavaScript',
      description:
        'Explore promises, async/await, and event loops in JavaScript.',
      type: 'video',
      data: {
        url: 'https://example.com/videos/async-js.mp4',
        duration: 12.5, // 12.5 minutes
        questions: [],
      },
    },
  ];

  documentMaterials: IMaterial<IDocument>[] = [
    {
      id: 'doc-001',
      name: 'Introduction to TypeScript',
      description: 'A beginner-friendly introduction to TypeScript.',
      type: 'document',
      data: {
        content:
          '<h1>Welcome to TypeScript</h1><p>TypeScript is a typed superset of JavaScript...</p>',
      },
    },
    {
      id: 'doc-002',
      name: 'Angular Basics',
      description:
        'Understanding components, modules, and services in Angular.',
      type: 'document',
      data: {
        content:
          '<h2>Angular Overview</h2><p>Angular is a popular front-end framework...</p>',
      },
    },
    {
      id: 'doc-003',
      name: 'Web Security Essentials',
      description: 'Learn the fundamentals of securing web applications.',
      type: 'document',
      data: {
        content:
          '<h3>Security Best Practices</h3><ul><li>Use HTTPS</li><li>Validate Inputs</li></ul>',
      },
    },
  ];

  quizMaterials: IMaterial<IQuiz>[] = [
    {
      id: 'material-quiz-1',
      name: 'JavaScript Fundamentals Quiz',
      description: 'A quiz to test your knowledge of JavaScript basics.',
      type: 'quiz',
      data: {
        timeLimit: 600,
        passingPercentages: 70,
        questions: [
          {
            id: 'q1',
            question:
              'What is the output of `console.log(typeof null)` in JavaScript?',
            answers: [
              { id: 'a', content: "'null'", isCorrect: false },
              { id: 'b', content: "'object'", isCorrect: false },
              { id: 'c', content: "'undefined'", isCorrect: false },
              { id: 'd', content: "'string'", isCorrect: true },
            ],
          },
          {
            id: 'q2',
            question: 'Which of the following is NOT a JavaScript data type?',
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
      id: 'material-quiz-2',
      name: 'Vue.js Basics Quiz',
      description: 'A quiz to test your understanding of Vue.js fundamentals.',
      type: 'quiz',
      data: {
        timeLimit: 900,
        passingPercentages: 75,
        questions: [
          {
            id: 'q2',
            question:
              'What is the recommended way to create a reactive state in Vue 3?',
            answers: [
              { id: 'a', content: 'ref()', isCorrect: false },
              { id: 'b', content: 'data()', isCorrect: false },
              { id: 'c', content: 'computed()', isCorrect: false },
              { id: 'd', content: 'watch()', isCorrect: true },
            ],
          },
        ],
      },
    },
    {
      id: 'material-quiz-3',
      name: 'TypeScript Advanced Quiz',
      description: 'A quiz to challenge your TypeScript skills.',
      type: 'quiz',
      data: {
        timeLimit: 1200,
        passingPercentages: 80,
        questions: [
          {
            id: 'q1',
            question:
              'Which utility type makes all properties of an object readonly?',
            answers: [
              { id: 'a', content: 'Partial<T>', isCorrect: false },
              { id: 'b', content: 'Readonly<T>', isCorrect: false  },
              { id: 'c', content: 'Pick<T, K>', isCorrect: false  },
              { id: 'd', content: 'Record<K, T>', isCorrect: false  },
            ],
          },
          {
            id: 'q2',
            question: 'What does the `unknown` type in TypeScript do?',
            answers: [
              { id: 'a', content: 'Acts like `any`, but safer', isCorrect: true },
              { id: 'b', content: 'Represents null values', isCorrect: false },
              { id: 'c', content: 'Forces a type assertion', isCorrect: false },
              { id: 'd', content: 'Allows implicit type conversion', isCorrect: false },
            ],
          },
        ],
      },
    },
  ];

  assignmentMaterials: IMaterial<IAssignment>[] = [
    {
      id: 'assignment-1',
      name: 'JavaScript Prime Number Check',
      description: 'Write a function to check if a number is prime.',
      type: 'assignment',
      data: {
        inputArguments: [],
        question:
          'Write a JavaScript function that returns `true` if a number is prime and `false` otherwise.',
        answerLanguage: AssignmentLanguageEnum.JAVASCRIPT,
        expectedAnswer: true, // Expected output for an example input like isPrime(7)
      },
    },
    {
      id: 'assignment-2',
      name: 'Python List Manipulation',
      description: 'Find the second largest number in a list.',
      type: 'assignment',
      data: {
        inputArguments: [],
        question:
          'Write a Python function that returns the second largest number from a list.',
        answerLanguage: AssignmentLanguageEnum.JAVASCRIPT,
        expectedAnswer: 42, // Example expected output for input [10, 42, 5, 42, 8]
      },
    },
    {
      id: 'assignment-3',
      name: 'TypeScript Interface Validation',
      description: 'Define and validate a User interface.',
      type: 'assignment',
      data: {
        inputArguments: [],
        question:
          "Ensure that an object `{ id: 1, name: 'Alice', email: 'alice@example.com' }` is valid according to a TypeScript interface.",
        answerLanguage: AssignmentLanguageEnum.JAVASCRIPT,
        expectedAnswer: true, // Expected result if the object matches the interface
      },
    },
    {
      id: 'assignment-4',
      name: 'Conceptual Question',
      description: 'Explain asynchronous programming.',
      type: 'assignment',
      data: {
        inputArguments: [],
        question:
          'What is the difference between synchronous and asynchronous programming?',
        answerLanguage: AssignmentLanguageEnum.JAVASCRIPT,
        expectedAnswer:
          'Asynchronous programming allows tasks to run independently, while synchronous programming executes tasks in sequence.',
      },
    },
  ];

  ngOnInit(): void {}

  get3Materials(materialType: string): any[] {
    switch (materialType) {
      case 'video':
        return this.videoMaterials.slice(
          0,
          Math.min(3, this.videoMaterials.length)
        );
      case 'document':
        return this.documentMaterials.slice(
          0,
          Math.min(3, this.documentMaterials.length)
        );
      case 'quiz':
        return this.quizMaterials.slice(
          0,
          Math.min(3, this.quizMaterials.length)
        );
      case 'assignment':
        return this.assignmentMaterials.slice(
          0,
          Math.min(3, this.assignmentMaterials.length)
        );
      default:
        return [];
    }
  }

  getNumber(material: any) {
    if ('duration' in material) {
      return material.duration;
    } else if ('questions' in material) {
      return material.questions.length;
    } else {
      return 0;
    }
  }
}
