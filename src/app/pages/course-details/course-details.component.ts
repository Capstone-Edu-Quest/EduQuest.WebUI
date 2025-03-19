import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../core/services/courses.service';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';
import {
  ICoupon,
  ICourse,
  ICourseCart,
  ICourseDetails,
  ICourseOverview,
} from '../../shared/interfaces/course.interfaces';
import { CouponService } from '../../core/services/coupon.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { handleCastDateString } from '../../core/utils/time.utils';
import { MessageService } from '../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { WebRole } from '../../shared/enums/user.enum';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
  animations: [fadeInOutAnimation],
})
export class CourseDetailsComponent implements OnInit, OnDestroy {
  courseDetails: ICourseDetails = {
    id: 'course-001',
    name: 'Mastering TypeScript',
    leanerCount: 1253,
    author: {
      id: 'user-123',
      name: 'John Doe',
      email: 'johndoe@example.com',
      jobTitle: 'Senior Software Engineer @ Shopee',
      avatar: 'https://example.com/avatar.jpg',
      role: WebRole.INSTRUCTOR,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T12:30:00Z',
      description:
        'An expert in their field, dedicated to delivering high-quality, engaging content to help learners master new skills with real-world applications.',
      statistics: [
        { label: 'LABEL.TOTAL_COURSES_STATS', value: 12 },
        { label: 'LABEL.TOTAL_LEARNER_STATS', value: 1253 },
        { label: 'LABEL.TOTAL_REVIEWS_STATS', value: 152 },
        { label: 'LABEL.AVERAGE_RATINGS_STATS', value: 4.8 },
      ],
    }, // TODO: Replace with IUserStat interface
    description:
      'A complete guide to mastering TypeScript, from basics to advanced concepts.',
    duration: 12,
    stageCount: 3,
    image: '/assets/images/demo-course-thumb.webp',
    price: 49.99,
    createdDate: '2024-01-01T00:00:00Z',
    lastUpdated: '2024-01-20T10:00:00Z',
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

  authorStatsIcon = ['play-circle', 'user', 'comment', 'star'];

  guaranteeItems = [
    {
      icon: 'clock-circle',
      label: 'LABEL.TOTAL_HOUR',
      value: 21
    },
    {
      icon: 'field-time',
      label: 'LABEL.LIFE_TIME_ACCESS'
    },
    {
      icon: 'trophy',
      label: 'LABEL.CERTIFICATE_OF_COMPLETEION'
    },
    {
      icon: 'exclamation-circle',
      label: 'LABEL.REFUND_WITHIN_PERCENT',
      value: 10
    }
  ]

  star = faStar;
  starNone = faStarRegular;
  starHalf = faStarHalfStroke;

  starsList: any[] = [];

  subscription$: Subscription = new Subscription();
  isInCart: boolean = false;
  isInWishlist: boolean = false;
  discountAmount: number = 0;

  rightPricePosition: number = 25;

  inputCoupon: string = '';
  _coupon: ICoupon | null = null;

  constructor(
    private route: ActivatedRoute,
    private course: CoursesService,
    private cart: CartService,
    private wishlist: WishlistService,
    private coupon: CouponService,
    private router: Router,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.initCourse();
    this.initStars();
    this.listenToCart();
    this.listenToWishList();
    this.listenToCoupon();
  }

  @HostListener('window:scroll', [])
  onScroll(event: Event) {
    const addedValue = window.scrollY < 25 ? 25 : 0
    this.rightPricePosition = window.scrollY + addedValue;
    const scrollTimeout = setTimeout(() => {
      clearTimeout(scrollTimeout);
    }, 1000);
  }

  initCourse() {
    const id = this.route.snapshot.paramMap.get('courseId');
    if (!id) return;
    this.course.onGetCourse(id);
  }

  initStars() {
    if (!this.courseDetails) return;

    this.starsList = Array(5)
      .fill(null)
      .map((_, i) => {
        const rating = this.courseDetails?.rating! - i;

        if (rating >= 1) return this.star;
        if (rating > 0) return this.starHalf;
        return this.starNone;
      });
  }

  listenToCart() {
    this.subscription$.add(
      this.cart.cart$.subscribe((cart: ICourseCart) => {
        this.isInCart = cart.courses.some(
          (c) => c.id === this.courseDetails?.id
        );
      })
    );
  }

  listenToWishList() {
    this.subscription$.add(
      this.wishlist.wishlist$.subscribe((wishlist: ICourseOverview[]) => {
        this.isInWishlist = wishlist.some(
          (c) => c.id === this.courseDetails?.id
        );
      })
    );
  }

  listenToCoupon() {
    this.subscription$.add(
      this.coupon.inUseCoupon$.subscribe((coupon) => {
        this._coupon = coupon;
        this.discountAmount = coupon?.discount ?? 0;
      })
    );
  }

  onGetCourseLastUpdate() {
    return handleCastDateString(
      new Date(this.courseDetails.lastUpdated).toLocaleDateString()
    );
  }

  onAddToCart(event: Event) {
    event.stopPropagation();

    if (this.isInCart) {
      this.goToCart();
      return;
    }

    if (!this.course) return;
    this.cart.updateCart(this.course.onConvertCourseDetailsToCourseOverview(this.courseDetails));
    // Remove from wishlist if exist
    this.isInWishlist && this.wishlist.updateWishlist(this.course.onConvertCourseDetailsToCourseOverview(this.courseDetails));
  }

  onAddToWishlist(event: Event) {
    event.stopPropagation();
    if (!this.course) return;
    this.wishlist.updateWishlist(this.course.onConvertCourseDetailsToCourseOverview(this.courseDetails));
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  applyNewCoupon() {
    if (this.inputCoupon.trim() === '') return;
    this.coupon.useCoupon(this.inputCoupon);
    this.inputCoupon = '';
    this.message.addMessage('success', this.translate.instant('MESSAGE.APPLIED_COUPON'));
  }

  onPressEnterCoupon(e: KeyboardEvent) {
    if (e.key !== 'Enter') return;
    this.applyNewCoupon();
  }

  removeCoupon() {
    this.coupon.useCoupon(null);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
