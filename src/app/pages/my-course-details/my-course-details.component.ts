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
import { CoursesService } from '../../core/services/courses.service';
@Component({
  selector: 'app-my-course-details',
  templateUrl: './my-course-details.component.html',
  styleUrl: './my-course-details.component.scss',
})
export class MyCourseDetailsComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  courseId!: string | null;
  course: ICourseManageDetails | null = null;

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
    private translate: TranslateService,
    private courseService: CoursesService
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
    if (!this.courseId) return;
    const result = this.courseService.onGetCourseById(this.courseId);
    result.subscribe((data) => {
      // this.course = data?.payload ?? null;
    });
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
      labels: this.course?.courseEnrollOverTime?.map((item) => item.time) ?? [],
      datasets: [
        {
          label: this.translate.instant('LABEL.LEARNERS'),
          data: this.course?.courseEnrollOverTime?.map((item) => item.count) ?? [],
          borderColor: currentTheme?.theme['--brand-05'],
          pointBackgroundColor: currentTheme?.theme['--brand-hover'],
          pointBorderColor: currentTheme?.theme['--brand-light'],
          backgroundColor: currentTheme?.theme['--brand-05'],
          borderWidth: 1,
        },
        {
          label: this.translate.instant('LABEL.REVIEWS'),
          data: this.course?.courseRatingOverTime?.map((item) => item.count) ?? [],
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
      new Date(this.course?.lastUpdated ?? '').toLocaleDateString()
    );
  }

  onEdit(e: Event) {
    e.stopPropagation();
    this.router.navigate(['my-courses', this.course?.id, 'edit']);
  }

  onDelete(e: Event) {
    e.stopPropagation();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
