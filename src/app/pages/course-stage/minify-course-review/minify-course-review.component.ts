import { CoursesService } from '@/src/app/core/services/courses.service';
import {
  ICourse,
  IReview,
  IReviewParams,
  IReviewQuery,
} from '@/src/app/shared/interfaces/course.interfaces';
import { Component, Input, type OnInit } from '@angular/core';
import {
  faPen,
  faStar,
  faStarHalfStroke,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { MessageService } from '@/src/app/core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@/src/app/core/services/user.service';

@Component({
  selector: 'app-minify-course-review',
  templateUrl: './minify-course-review.component.html',
  styleUrl: './minify-course-review.component.scss',
})
export class MinifyCourseReviewComponent implements OnInit {
  @Input('courseDetails') courseDetails!: ICourse;

  isEdit: boolean = false;

  currentStars: number = 0;
  feedbackContent: string = '';

  myReview: IReview | null = null;

  allReviews: IReview[] = [];

  star = faStar;
  starNone = faStarRegular;
  starHalf = faStarHalfStroke;

  editIcon = faPen;
  deleteIcon = faTrash;

  starsList: any[] = [];

  initStars() {
    if (!this.courseDetails) return;

    this.starsList = Array(5)
      .fill(null)
      .map((_, i) => {
        const rating = this.currentStars - i;

        if (rating >= 1) return this.star;
        if (rating > 0) return this.starHalf;
        return this.starNone;
      });
  }

  constructor(
    private courseService: CoursesService,
    private message: MessageService,
    private translate: TranslateService,
    private user: UserService
  ) {}

  ngOnInit(): void {
    this.initStars();
    if (!this.courseDetails) return;

    const query: IReviewQuery = {
      courseId: this.courseDetails?.id,
      eachPage: 1000,
      pageNo: 1,
    };

    this.courseService.onGetCourseReviews(query).subscribe((res) => {
      if (!res?.payload) {
        this.allReviews = [];
        return;
      }

      this.allReviews = res.payload.filter((review) => {
        if (review.createdBy.id !== this.user.user$.value?.id) {
          return review;
        }

        this.myReview = review;
        this.currentStars = review.rating;
        this.feedbackContent = review.comment;
        this.initStars();
        return false;
      });
    });
  }

  onSelectStar(index: number) {
    this.currentStars = index + 1;
    this.initStars();
  }

  onFeedback() {
    if (this.feedbackContent.trim().length === 0) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.MISSING_FIELDS')
      );
      return;
    }

    const params: IReviewParams = {
      courseId: this.courseDetails.id,
      rating: this.currentStars,
      comment: this.feedbackContent,
    };

    this.courseService.onSendCourseReview(params).subscribe((res) => {
      if (!res?.payload) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.FAILED_FEEDBACK')
        );
        return;
      }

      this.message.addMessage(
        'success',
        this.translate.instant('MESSAGE.FEEDBACK_SUCCESS')
      );

      this.myReview = res.payload;
      this.onCancel();
    });
  }

  onCancel() {
    if (!this.myReview) return;
    this.isEdit = false;
    this.currentStars = this.myReview.rating;
    this.feedbackContent = this.myReview.comment;
    this.initStars();
  }

  onUpdate() {
    if (!this.myReview?.id) return;

    const params: IReviewParams = {
      courseId: this.courseDetails.id,
      rating: this.currentStars,
      comment: this.feedbackContent,
    };

    this.courseService
      .onUpdateCourseReview(this.myReview?.id, params)
      .subscribe((res) => {
        if (!res?.payload) {
          this.message.addMessage(
            'error',
            this.translate.instant('MESSAGE.FAILED_FEEDBACK')
          );
          return;
        }

        this.message.addMessage(
          'success',
          this.translate.instant('MESSAGE.FEEDBACK_SUCCESS')
        );
        this.myReview = res.payload;
        this.onCancel();
      });
  }

  onDelete() {
    if (!this.myReview?.id) return;
    this.courseService
      .onDeleteCourseReview(this.myReview?.id)
      .subscribe((res) => {
        if (!res?.payload) {
          this.message.addMessage(
            'error',
            this.translate.instant('MESSAGE.DELETED_FAIL')
          );
          return;
        }

        this.message.addMessage(
          'success',
          this.translate.instant('MESSAGE.DELETED_SUCCESSFULLY')
        );
        this.myReview = null;
        this.currentStars = 0;
        this.feedbackContent = '';
        this.initStars();
      });
  }
}
