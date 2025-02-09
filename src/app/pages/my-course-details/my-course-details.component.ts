import { Component, OnDestroy, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ICourseManageDetails } from '../../shared/interfaces/course.interfaces';
import {
  faCartShopping,
  faHeart,
  faPen,
  faStar,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../core/services/theme.service';
import { handleCastDateString } from '../../core/utils/time.utils';

@Component({
  selector: 'app-my-course-details',
  templateUrl: './my-course-details.component.html',
  styleUrl: './my-course-details.component.scss',
})
export class MyCourseDetailsComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  courseId!: string | null;
  course: ICourseManageDetails = {
    id: 'course-001',
    name: 'Mastering TypeScript',
    leanerCount: 1253,
    isPublic: true,
    totalInCart: 88,
    totalInWhislist: 122,
    totalEnrolled: 1253,
    courseEnrollOverTime: [
      { time: 'Oct 2024', count: 120 },
      { time: 'Nov 2024', count: 652 },
      { time: 'Dec 2024', count: 781 },
      { time: 'Jan 2025', count: 992 },
      { time: 'Feb 2025', count: 1211 },
    ],
    courseRatingOverTime: [
      { time: 'Oct 2024', count: 44 },
      { time: 'Nov 2024', count: 86 },
      { time: 'Dec 2024', count: 122 },
      { time: 'Jan 2025', count: 322 },
      { time: 'Feb 2025', count: 452 },
    ],
    description:
      'A complete guide to mastering TypeScript, from basics to advanced concepts.',
    duration: 12,
    stageCount: 3,
    image: '/assets/images/demo-course-thumb.webp',
    price: 49.99,
    createdDate: '2024-01-01T00:00:00Z',
    lastUpdated: '2025-01-20T10:00:00Z',
    rating: 4.8,
    numberOfRating: 1520,
    isCompleted: false,
    progress: 25, // 25% completed
    tags: [
      {
        id: 'tag-1',
        name: 'TypeScript',
        description: 'Strongly-typed JavaScript',
      },
      { id: 'tag-2', name: 'Frontend', description: 'For frontend developers' },
      { id: 'tag-3', name: 'Backend', description: 'For backend developers' },
    ],
    totalTime: 12, // Total time in hours
    requirements: [
      'Basic knowledge of JavaScript',
      'Familiarity with ES6+ syntax',
      'A code editor (VS Code recommended)',
    ],
    stages: [
      {
        id: 'stage-001',
        title: 'Introduction to TypeScript',
        time: 3, // 3 hours
        mission: [
          {
            id: 'mission-001',
            title: 'What is TypeScript?',
            type: 'video',
            mission: 'Learn the basics and advantages of TypeScript.',
            time: 120,
          },
          {
            id: 'mission-002',
            title: 'Setting up TypeScript',
            type: 'document',
            mission: 'Guide to installing and configuring TypeScript.',
            time: 120,
          },
          {
            id: 'mission-003',
            title: 'TypeScript Quiz 1',
            type: 'quiz',
            mission: 'Test your understanding of TypeScript basics.',
            time: 120,
          },
        ],
      },
      {
        id: 'stage-002',
        title: 'TypeScript in Action',
        time: 4, // 4 hours
        mission: [
          {
            id: 'mission-004',
            title: 'TypeScript Type System',
            type: 'video',
            mission:
              'Understand types, interfaces, and type inference in TypeScript.',
            time: 120,
          },
          {
            id: 'mission-005',
            title: 'Practical TypeScript Examples',
            type: 'document',
            mission:
              'Explore real-world TypeScript applications and best practices.',
            time: 120,
          },
        ],
      },
      {
        id: 'stage-003',
        title: 'Advanced TypeScript',
        time: 5, // 5 hours
        mission: [
          {
            id: 'mission-006',
            title: 'Generics & Advanced Types',
            type: 'video',
            mission:
              'Deep dive into generics, mapped types, and utility types.',
            time: 120,
          },
          {
            id: 'mission-007',
            title: 'TypeScript Quiz 2',
            type: 'quiz',
            mission: 'Assess your knowledge of advanced TypeScript topics.',
            time: 120,
          },
        ],
      },
    ],
  };

  lastUpdated = {
    date: 0,
    month: 0,
    year: 0,
  };

  statsItem: { label: string; index: keyof ICourseManageDetails; icon: any }[] =
    [
      {
        label: 'LABEL.TOTAL_LEANERS',
        index: 'totalEnrolled',
        icon: faUser,
      },
      {
        label: 'LABEL.TOTAL_IN_CART',
        index: 'totalInCart',
        icon: faCartShopping,
      },
      {
        label: 'LABEL.TOTAL_IN_WISHLIST',
        index: 'totalInWhislist',
        icon: faHeart,
      },
      {
        label: 'LABEL.AVERAGE_RATING',
        index: 'rating',
        icon: faStar,
      },
    ];

  // Chart
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  chartData: ChartData<'line'> = {
    labels: [],
    datasets: [],
  };

  pannelBtn = [
    {
      icon: faPen,
      label: 'LABEL.EDIT',
      action: (e: Event) => this.onEdit(e),
    },
    {
      icon: faTrash,
      label: 'LABEL.DELETE',
      action: (e: Event) => this.onDelete(e),
    },
    // {
    //   icon: faClone,
    //   label: 'LABEL.CLONE',
    //   action: (e: Event) => this.onClone(e),
    // },
    // {
    //   icon: faShare,
    //   label: 'LABEL.SHARE',
    //   action: (e: Event) => this.onShare(e),
    // },
  ];
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private theme: ThemeService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initCourse();
    this.listenToRoute();
    this.listenToTheme();
    this.listenToTranslate();
  }

  listenToRoute() {
    this.subscription$.add(
      this.route.paramMap.subscribe((params) => {
        const courseId = params.get('courseId');
        this.courseId = courseId;
        this.initCourse();
      })
    );
  }

  listenToTheme() {
    this.subscription$.add(
      this.theme.currentTheme$.subscribe(() => {
        this.updateChartLanguageAndTheme();
      })
    );
  }

  listenToTranslate() {
    this.subscription$.add(
      this.translate.onLangChange.subscribe(() => {
        this.updateChartLanguageAndTheme();
      })
    );
  }

  initCourse() {
    // Fetch course details from API
    this.convertTime();
  }

  updateChartLanguageAndTheme() {
    const currentTheme = this.theme.getCurrentTheme();
    if (!currentTheme) return;

    const gridColor = {
      grid: {
        color: currentTheme.theme['--quaternary-text'],
      },
      ticks: {
        color: currentTheme.theme['--secondary-text'],
      },
    };

    this.chartOptions = {
      ...this.chartOptions,
      plugins: {
        ...this.chartOptions?.plugins,
        legend: {
          ...this.chartOptions?.plugins?.legend,
          labels: { color: currentTheme.theme['--secondary-text'] },
        },
      },
      scales: {
        x: gridColor,
        y: gridColor,
      },
    };

    this.chartData = {
      labels: this.course.courseEnrollOverTime.map((item) => item.time),
      datasets: [
        {
          label: this.translate.instant('LABEL.LEARNERS'),
          data: this.course.courseEnrollOverTime.map((item) => item.count),
          borderColor: currentTheme?.theme['--brand-05'],
          pointBackgroundColor: currentTheme?.theme['--brand-hover'],
          pointBorderColor: currentTheme?.theme['--brand-light'],
          backgroundColor: currentTheme?.theme['--brand-05'],
          borderWidth: 1,
        },
        {
          label: this.translate.instant('LABEL.REVIEWS'),
          data: this.course.courseRatingOverTime.map((item) => item.count),
          borderColor: currentTheme?.theme['--warning'],
          pointBackgroundColor: currentTheme?.theme['--warning'],
          pointBorderColor: currentTheme?.theme['--warning'],
          backgroundColor: currentTheme?.theme['--warning'],
          borderWidth: 1,
        },
      ],
    };
  }

  convertTime() {
    this.lastUpdated = handleCastDateString(
      new Date(this.course.lastUpdated).toLocaleDateString()
    );
  }

  onEdit(e: Event) {
    e.stopPropagation();
    this.router.navigate(['my-courses', this.course.id, 'edit']);
  }

  onDelete(e: Event) {
    e.stopPropagation();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
