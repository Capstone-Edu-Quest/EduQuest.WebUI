import { ICourseOverview } from './../../shared/interfaces/course.interfaces';
import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../core/services/courses.service';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';
import {
  ICoupon,
  ICourse,
  ICourseCart,
} from '../../shared/interfaces/course.interfaces';
import { CouponService } from '../../core/services/coupon.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  faBookBookmark,
  faPlus,
  faStar,
  faStarHalfStroke,
} from '@fortawesome/free-solid-svg-icons';
import {
  faBookmark,
  faStar as faStarRegular,
} from '@fortawesome/free-regular-svg-icons';
import { handleCastDateString } from '../../core/utils/time.utils';
import { MessageService } from '../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import {
  ILearningPath,
  IModifyLearningPath,
} from '../../shared/interfaces/learning-path.interfaces';
import { LearningPathService } from '../../core/services/learning-path.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
  animations: [fadeInOutAnimation],
})
export class CourseDetailsComponent implements OnInit, OnDestroy {
  @Input('courseDetails') courseDetails!: ICourse;

  authorStatsIcon = ['play-circle', 'user', 'comment', 'star'];

  guaranteeItems = [
    {
      icon: 'clock-circle',
      label: 'LABEL.MINUTES',
      value: 0,
    },
    {
      icon: 'field-time',
      label: 'LABEL.LIFE_TIME_ACCESS',
    },
    {
      icon: 'trophy',
      label: 'LABEL.CERTIFICATE_OF_COMPLETEION',
    },
    {
      icon: 'exclamation-circle',
      label: 'LABEL.REFUND_WITHIN_PERCENT',
      value: 10,
    },
  ];

  star = faStar;
  starNone = faStarRegular;
  starHalf = faStarHalfStroke;
  bookMark = faBookmark;
  bookMarkFilled = faBookBookmark;
  addIcon = faPlus;

  starsList: any[] = [];

  subscription$: Subscription = new Subscription();
  isInCart: boolean = false;
  isInWishlist: boolean = false;
  discountAmount: number = 0;

  rightPricePosition: number = 25;

  inputCoupon: string = '';
  _coupon: ICoupon | null = null;

  myLearningPaths: ILearningPath[] = [];

  newLearningPathName: string = '';

  constructor(
    private course: CoursesService,
    private cart: CartService,
    private wishlist: WishlistService,
    private coupon: CouponService,
    private router: Router,
    private message: MessageService,
    private translate: TranslateService,
    private learningPath: LearningPathService
  ) {}

  ngOnInit() {
    this.initStars();
    this.listenToCart();
    this.listenToWishList();
    this.listenToCoupon();
    this.listenToMyLearningPath();
    this.initCourseDetailsUI();
  }

  @HostListener('window:scroll', [])
  onScroll(event: Event) {
    const addedValue = window.scrollY < 25 ? 25 : 0;
    this.rightPricePosition = window.scrollY + addedValue;
    const scrollTimeout = setTimeout(() => {
      clearTimeout(scrollTimeout);
    }, 1000);
  }

  initCourseDetailsUI() {
    this.isInWishlist = this.wishlist.wishlist$.value.some(
      (c) => c.id === this.courseDetails?.id
    );

    this.isInCart = this.cart.cart$.value.courses.some(
      (c) => c.id === this.courseDetails?.id
    );

    const totalTimeItem = this.guaranteeItems.find(
      (_item) => _item.label === 'LABEL.MINUTES'
    );

    if (!totalTimeItem) return;
    totalTimeItem.value = this.courseDetails?.totalTime ?? 0;
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

  listenToMyLearningPath() {
    this.subscription$.add(
      this.learningPath.myLearningPaths$.subscribe(
        (l) => (this.myLearningPaths = l)
      )
    );
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
      new Date(this.courseDetails?.lastUpdated ?? '').toLocaleDateString()
    );
  }

  onAddToCart(event: Event) {
    event.stopPropagation();

    if (this.isInCart) {
      this.goToCart();
      return;
    }

    if (!this.courseDetails) return;
    this.cart.updateCart(
      this.course.onConvertDetailToOverview(this.courseDetails)
    );

    // Remove from wishlist if exist
    this.isInWishlist &&
      this.wishlist.updateWishlist(
        this.course.onConvertDetailToOverview(this.courseDetails)
      );
  }

  onAddToWishlist(event: Event) {
    event.stopPropagation();
    if (!this.courseDetails) return;

    this.wishlist.updateWishlist(
      this.course.onConvertDetailToOverview(this.courseDetails)
    );
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  applyNewCoupon() {
    if (this.inputCoupon.trim() === '') return;
    this.coupon.useCoupon(this.inputCoupon);
    this.inputCoupon = '';
    this.message.addMessage(
      'success',
      this.translate.instant('MESSAGE.APPLIED_COUPON')
    );
  }

  onPressEnterCoupon(e: KeyboardEvent) {
    if (e.key !== 'Enter') return;
    this.applyNewCoupon();
  }

  isCourseExistedInPath(pathId: string) {
    const currentLearningPath = this.learningPath.myLearningPaths$.value.find(
      (lp) => lp.id === pathId
    );

    if (!currentLearningPath) return;

    const index = currentLearningPath.learningPathCourses.findIndex(
      (c) => c.courseId === this.courseDetails?.id
    );

    return index !== -1;
  }

  onAddCourseTolearningPath(pathId: string) {
    if (!this.courseDetails) return;

    const isCourseExisted = this.isCourseExistedInPath(pathId)

    if (isCourseExisted) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.COURSE_EXISTED_LEARNINGPATH')
      );
      return;
    }

    this.learningPath.modifyCoursesToLearningPath(
      pathId,
      [this.courseDetails.id],
      'add'
    );
  }

  onAddNewLearningPath() {
    if (!this.courseDetails) return;

    const newLearningPath: IModifyLearningPath = {
      name: this.newLearningPathName,
      description: '',
      isPublic: false,
      courses: [
        {
          courseId: this.courseDetails.id,
          courseOrder: 0,
        },
      ],
    };

    this.learningPath.addNewLearningPath(newLearningPath);
    this.newLearningPathName = '';
  }

  removeCoupon() {
    this.coupon.useCoupon(null);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
