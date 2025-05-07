import {
  AfterViewInit,
  Component,
  OnDestroy,
  TemplateRef,
  ViewChild,
  type OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  ICourseInstructor,
  ICourseLearnerOverview,
  IReview,
  IReviewQuery,
} from '../../shared/interfaces/course.interfaces';
import {
  faAngleLeft,
  faAngleRight,
  faCartShopping,
  faHeart,
  faMarker,
  faPen,
  faStar,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { formatTime, handleCastDateString } from '../../core/utils/time.utils';
import { CoursesService } from '../../core/services/courses.service';
import { ILineChartDataSet } from '../../shared/interfaces/chart.interface';
import { MessageService } from '../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { InstructorCourseStatus } from '../../shared/enums/course.enum';
import { TableColumn } from '../../shared/interfaces/others.interfaces';
import { ModalService } from '../../core/services/modal.service';
@Component({
  selector: 'app-my-course-details',
  templateUrl: './my-course-details.component.html',
  styleUrl: './my-course-details.component.scss',
})
export class MyCourseDetailsComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('viewCertificate') viewCertificateRef!: TemplateRef<any>;
  @ViewChild('viewLearnerDetailsModal')
  viewLearnerDetailsModalRef!: TemplateRef<any>;

  subscription$: Subscription = new Subscription();

  moreIcon = faAngleRight;
  backIcon = faAngleLeft;

  isLearnersOverviewReady: boolean = false;
  learnersOverviewTableColumns: TableColumn[] = [
    {
      key: 'userName',
      label: 'LABEL.NAME',
    },
    {
      key: 'enrolledDate',
      label: 'LABEL.ENROLLED_DATE',
      render: (data: ICourseLearnerOverview) =>
        new Date(data.enrolledDate).toLocaleDateString(),
    },
    {
      key: 'purchasedAmount',
      label: 'LABEL.PURCHASED_AMOUNT',
      isMoney: true,
    },
    {
      key: 'progress',
      label: 'LABEL.PROGRESS',
      render: (data: ICourseLearnerOverview) => `${data.progress.toFixed(2)}%`,
    },
  ];
  learnersOverview: ICourseLearnerOverview[] = [];

  courseId!: string | null;
  course: ICourseInstructor | null = null;
  reviews: IReview[] = [];

  isViewAllReviews: boolean = false;
  allReviews: IReview[] = [];

  lastUpdated = {
    date: 0,
    month: 0,
    year: 0,
  };

  statsItem: { label: string; index: keyof ICourseInstructor; icon: any }[] = [
    {
      label: 'LABEL.TOTAL_LEANERS',
      index: 'totalLearner',
      icon: faUser,
    },
    {
      label: 'LABEL.TOTAL_IN_CART',
      index: 'totalInCart',
      icon: faCartShopping,
    },
    {
      label: 'LABEL.TOTAL_IN_WISHLIST',
      index: 'totalInWishList',
      icon: faHeart,
    },
    {
      label: 'LABEL.AVERAGE_RATING',
      index: 'rating',
      icon: faStar,
    },
  ];

  chartLabels: string[] = [];
  chartDatasets: ILineChartDataSet[] = [];

  pannelBtn = [
    {
      icon: faMarker,
      label: 'LABEL.UNMARK_ASSIGNMENTS',
      action: (e: Event) =>
        this.router.navigate([
          'my-courses',
          this.course?.id,
          'unmark-assignment',
        ]),
    },
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
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private courseService: CoursesService,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.listenToRoute();
    this.initCourse();
    this.initFeedbacks();
    this.initLearnsOverview();
  }

  ngAfterViewInit(): void {
    this.learnersOverviewTableColumns.push({
      key: 'certificate',
      label: '',
      elementRef: this.viewCertificateRef,
      onClick: () => {},
    });
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

  initCourse() {
    if (!this.courseId) return;
    this.courseService
      .onGetInstructorCourseDetails(this.courseId)
      .subscribe((res) => {
        if (!res?.payload) return;

        this.course = res.payload;
        this.course.listLesson.sort((a, b) => a.index - b.index);

        const [date, month, year] = formatTime(res.payload.lastUpdated).split(
          '/'
        );
        this.lastUpdated = {
          date: Number(date),
          month: Number(month),
          year: Number(year),
        };

        const labelsSet = new Set<string>();
        this.chartDatasets = [
          {
            label: 'LABEL.LEARNERS',
            data: [],
          },
          {
            label: 'LABEL.RATING',
            data: [],
          },
        ];

        for (
          let i = 0;
          i <
          Math.max(
            res.payload.courseEnrollOverTime.length,
            res.payload.courseRatingOverTime.length
          );
          i++
        ) {
          if (res.payload.courseEnrollOverTime.length > i) {
            labelsSet.add(res.payload.courseEnrollOverTime[i].time);
          }

          if (res.payload.courseRatingOverTime.length > i) {
            labelsSet.add(res.payload.courseRatingOverTime[i].time);
          }

          this.chartDatasets[0].data.push(
            Number(res.payload.courseEnrollOverTime[i]?.count ?? 0)
          );

          this.chartDatasets[1].data.push(
            Number(res.payload.courseRatingOverTime[i]?.count ?? 0)
          );
        }

        this.chartLabels = [...labelsSet];
      });
    this.convertTime();
  }

  getTags() {
    return this.course?.listTag.map((t) => t.name).join(' ');
  }

  initLearnsOverview() {
    this.isLearnersOverviewReady = false;
    this.learnersOverview = [];

    const courseId = this.route.snapshot.paramMap.get('courseId');
    if (!courseId) return;

    this.courseService.getCourseLearnersOverview(courseId).subscribe((res) => {
      if (!res?.payload) return;

      this.learnersOverview = res.payload;
      this.isLearnersOverviewReady = true;
    });
  }

  initFeedbacks() {
    if (!this.courseId) return;
    const query: IReviewQuery = {
      courseId: this.courseId,
      eachPage: 6,
      pageNo: 1,
    };

    this.courseService.onGetCourseReviews(query).subscribe((res) => {
      if (!res?.payload) {
        this.reviews = [];
        return;
      }

      this.reviews = res.payload;
    });
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

  onViewMoreFeedbacks() {
    if (!this.courseId) return;

    this.isViewAllReviews = !this.isViewAllReviews;
    const query: IReviewQuery = {
      courseId: this.courseId,
      eachPage: 1000,
      pageNo: 1,
    };

    if (!this.isViewAllReviews) return;
    this.courseService.onGetCourseReviews(query).subscribe((res) => {
      if (!res?.payload) {
        this.reviews = [];
        return;
      }

      this.allReviews = res.payload;
    });
  }

  onPublishCourse() {
    if (!this.course) return;

    if(this.course.listLesson.length === 0 || this.course.listLesson.some(l => l.materials.length === 0)) {
      this.message.addMessage('error', this.translate.instant('MESSAGE.PLEASE_ADD_LESSON'));
      return;
    }

    this.courseService
      .onSubmitCourseForApproval(this.course.id)
      .subscribe((res) => {
        if (res?.isError || !res) return;

        this.message.addMessage(
          'success',
          this.translate.instant('MESSAGE.SENT_APPROVAL_SUCCESSFULLY')
        );

        if (this.course) {
          this.course.status = InstructorCourseStatus.PENDING;
        }
      });
  }

  round(val: number) {
    return Math.ceil(val);
  }

  onViewLearnerDetails(userId: string) {
    if (!this.courseId) return;
    // this.courseService.getCourseLearnerDetails(this.courseId, userId).subscribe(res => {
    //   console.log(res?.payload)
    //   this.modal.updateModalContent(this.viewLearnerDetailsModalRef)
    // })
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
