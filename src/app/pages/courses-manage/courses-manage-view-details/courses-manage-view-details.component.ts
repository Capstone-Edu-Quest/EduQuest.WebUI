import { UserService } from './../../../core/services/user.service';
import { Component, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IAssignment,
  ICourseFullMetarialsView,
  IDocument,
  IMaterial,
  IQuiz,
  ITableMaterialData,
  IVideo,
} from '../../../shared/interfaces/course.interfaces';
import { AssignmentLanguageEnum } from '../../../shared/enums/materials.enum';
import {
  faAngleLeft,
  faAngleRight,
  faCheck,
  faCheckCircle,
  faClose,
  faHashtag,
  faPen,
  faPlus,
  faTrash,
  faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { TableColumn } from '../../../shared/interfaces/others.interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { WebRole } from '../../../shared/enums/user.enum';
import { IUser } from '../../../shared/interfaces/user.interfaces';

@Component({
  selector: 'app-courses-manage-view-details',
  templateUrl: './courses-manage-view-details.component.html',
  styleUrl: './courses-manage-view-details.component.scss',
})
export class CoursesManageViewDetailsComponent implements OnInit {
  subscription$: Subscription = new Subscription();

  backIcon = faAngleLeft;
  reqIcon = faCheckCircle;
  rightIcon = faAngleRight;
  addIcon = faPlus;

  user: IUser | null = null;

  exampleCourse: ICourseFullMetarialsView = {
    id: 'course-002',
    name: 'Advanced TypeScript & Functional Programming',
    author: {
      id: 'user-456',
      name: 'Alice Johnson',
      avatar: 'https://example.com/avatar-alice.jpg',
      bio: 'Tech Lead & TypeScript Enthusiast',
    },
    description:
      'Master advanced TypeScript concepts and functional programming techniques.',
    duration: 15, // hours
    stageCount: 2,
    image: 'assets/images/demo-course-thumb.webp',
    price: 59.99,
    createdDate: '2025-02-23T10:00:00Z',
    lastUpdated: '2025-02-23T12:00:00Z',
    rating: 4.9,
    numberOfRating: 540,
    isCompleted: false,
    progress: 25, // %
    tags: [
      { id: 'tag-004', name: 'TypeScript' },
      { id: 'tag-005', name: 'Functional Programming' },
      { id: 'tag-006', name: 'Advanced Coding' },
    ],
    requirements: [
      'Basic TypeScript knowledge',
      'Familiarity with functional programming',
      'Node.js installed',
    ],
    stages: [
      {
        id: 'stage-101',
        title: 'Deep Dive into TypeScript',
        description:
          'Learn TypeScript beyond the basics, including generics and utility types.',
        materials: [
          {
            id: 'material-101',
            name: 'Introduction to TypeScript',
            description: 'A video covering TypeScript fundamentals.',
            type: 'video',
            data: {
              url: 'https://example.com/ts-intro.mp4',
              duration: 900, // 15 minutes
              questions: [
                {
                  question: 'What is TypeScript primarily used for?',
                  answers: [
                    { answer: 'Styling websites', isCorrect: false },
                    {
                      answer: 'Enhancing JavaScript with static types',
                      isCorrect: true,
                    },
                    { answer: 'Managing databases', isCorrect: false },
                  ],
                },
              ],
            },
          },
          {
            id: 'material-102',
            name: 'TypeScript Utility Types',
            description:
              'An in-depth document about mapped types and utility types in TypeScript.',
            type: 'document',
            data: {
              content: '<h1>Understanding Utility Types</h1><p>...</p>',
            },
          },
        ],
      },
      {
        id: 'stage-102',
        title: 'Functional Programming with TypeScript',
        description:
          'Explore the benefits of functional programming using TypeScript.',
        materials: [
          {
            id: 'material-103',
            name: 'Higher-Order Functions & Immutability',
            description:
              'A challenging quiz on functional programming concepts.',
            type: 'quiz',
            data: {
              timeLimit: 15, // minutes
              passingPercentages: 80,
              questions: [
                {
                  question:
                    'What is the key characteristic of a pure function?',
                  answers: [
                    {
                      id: 'q-201',
                      content: 'Modifies external variables',
                      isCorrect: false,
                    },
                    {
                      id: 'q-202',
                      content: 'Returns the same output for the same input',
                      isCorrect: true,
                    },
                  ],
                },
              ],
            },
          },
          {
            id: 'material-104',
            name: 'Implementing a Functional Pipeline',
            description:
              'A hands-on assignment for implementing function composition in TypeScript.',
            type: 'assignment',
            data: {
              question:
                'Write a function that composes two functions and applies them in order.',
              inputArguments: ['function1', 'function2', 'inputValue'],
              answerLanguage: AssignmentLanguageEnum.JAVASCRIPT,
              expectedAnswer: 'function2(function1(inputValue))',
            },
          },
        ],
      },
    ],
  };

  tableColumns: TableColumn[] = [
    {
      key: 'stage',
      label: 'LABEL.STAGES',
    },
    {
      key: 'name',
      label: 'LABEL.MATERIAL_NAME',
    },
    {
      key: 'type',
      label: 'LABEL.TYPE',
    },
    {
      key: 'description',
      label: 'LABEL.MATERIAL_DESCRIPTION',
    },
    {
      key: 'time',
      label: 'LABEL.TIME',
    },
    {
      key: 'data',
      label: 'LABEL.MATERIAL_INFO',
    },
    {
      key: 'view',
      label: '',
      icon: this.rightIcon,
    },
  ];
  materialsData: ITableMaterialData[] = [];

  course: ICourseFullMetarialsView | null = null;

  approvalMenu = [
    {
      icon: faCheck,
      label: 'LABEL.ACCEPT',
      action: (e: Event) => this.onAccept(e),
    },
    {
      icon: faClose,
      label: 'LABEL.REJECT',
      action: (e: Event) => this.onReject(e),
    },
  ];

  modifyMenu = [
    {
      icon: faHashtag,
      label: 'LABEL.MODIFY_HASHTAG',
      action: (e: Event) => this.onModifyHashtag(e),
    },
  ];
  
  staffMenu = [
    {
      icon: faWarning,
      label: 'LABEL.SUSPEND_COURSE',
      action: (e: Event) => this.onSuspendCourse(e),
    },
  ]

  menu: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private translate: TranslateService,
    private UserService: UserService
  ) {}

  ngOnInit(): void {
    this.initCourse();
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((_user) => {
        this.user = _user;
      })
    );
  }

  initCourse = () => {
    const id = this.route.snapshot.paramMap.get('courseId');
    this.course = this.exampleCourse;

    this.onInitMaterialsData();
    this.initMenu();
  };

  initMenu() {
    this.menu = [];

    // Check status = pending & expert
    if (this.user?.roleId === WebRole.EXPERT) {
      this.menu = [...this.approvalMenu];
    } else {
      this.menu = [...this.staffMenu];
    }

    this.menu.push(...this.modifyMenu);
  }

  onConverTime(time: string) {
    return new Date(time).toLocaleString();
  }

  async onInitMaterialsData() {
    if (!this.course) return;

    for (const [i, stage] of this.course.stages.entries()) {
      for (const material of stage.materials) {
        const materialData: ITableMaterialData = {
          name: material.name,
          type: material.type,
          stage: i + 1,
          description: material.description,
          data: await this.onGetDataInfo(material),
          time: this.onGetDataTime(material),
        };
        this.materialsData.push(materialData);
      }
    }
  }

  onGetDataInfo(
    material: IMaterial<IVideo | IDocument | IQuiz | IAssignment>
  ): Promise<string> {
    return new Promise((resolve) => {
      switch (material.type) {
        case 'video':
          this.translate
            .get('LABEL.QUESTIONS_COUNT', {
              value: (material.data as IVideo).questions.length,
            })
            .subscribe((res) => resolve(res));
          break;

        case 'document':
          resolve('');
          break;

        case 'quiz':
          this.translate
            .get('LABEL.QUESTIONS_COUNT', {
              value: (material.data as IQuiz).questions.length,
            })
            .subscribe((questions) => {
              const passingPercentages = (material.data as IQuiz)
                .passingPercentages;
              resolve(`${questions} | ${passingPercentages}%`);
            });
          break;

        case 'assignment':
          resolve(
            `${(material.data as IAssignment).question} (${
              (material.data as IAssignment).answerLanguage
            })`
          );
          break;

        default:
          resolve('');
      }
    });
  }

  onGetDataTime(material: IMaterial<IVideo | IDocument | IQuiz | IAssignment>) {
    switch (material.type) {
      case 'video':
        return this.translate.instant('SIGNATURE.MINUTES', {
          value: ((material.data as IVideo).duration / 60).toFixed(0),
        });
      case 'document':
        return '';
      case 'quiz':
        return this.translate.instant('SIGNATURE.MINUTES', {
          value: (material.data as IQuiz).timeLimit.toFixed(0),
        });
      case 'assignment':
        return ``;
      default:
        return '';
    }
  }

  onAccept(e: Event) {
    e.stopPropagation();
    console.log('Accept');
  }

  onReject(e: Event) {
    e.stopPropagation();
    console.log('Decline');
  }

  onModifyHashtag(e: Event) {
    e.stopPropagation();
    console.log('Modify Hashtag');
  }

  onSuspendCourse(e: Event) {
    e.stopPropagation();
    console.log('Suspend Course');
  }

  onBack() {
    this.location.back();
    console.log('back');
  }
}
