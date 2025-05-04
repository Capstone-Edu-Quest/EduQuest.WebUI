import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  type OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  ICourseCart,
  ICourseOverview,
} from '../../../shared/interfaces/course.interfaces';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Router } from '@angular/router';
import { CouponService } from '../../../core/services/coupon.service';
import { Subscription } from 'rxjs';
import {
  faStar,
  faStarHalfStroke,
  faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import {
  formatRemainingTime,
} from '@/src/app/core/utils/time.utils';
import { TranslateService } from '@ngx-translate/core';
import { LearningPathService } from '@/src/app/core/services/learning-path.service';

@Component({
  selector: 'app-path-course-item',
  templateUrl: './path-course-item.component.html',
  styleUrl: './path-course-item.component.scss',
})
export class PathCourseItemComponent implements OnInit, OnDestroy {
  @Input('pathId') pathId!: string;
  @Input('course') course: ICourseOverview | null = null;
  @Input('isEdit') isEdit!: boolean;
  @Input('isExpertView') isExpertView: boolean = false;
  @Output('onRemoveCourse') onRemoveCourse: EventEmitter<ICourseOverview> =
    new EventEmitter();
  @Output('reinitLearningpath') reinitLearningpath: EventEmitter<any> = new EventEmitter();

  @ViewChild('item') item!: ElementRef;

  star = faStar;
  starNone = faStarRegular;
  starHalf = faStarHalfStroke;

  warningIcon = faWarning;

  starsList: any[] = [];

  subscription$: Subscription = new Subscription();
  isInCart: boolean = false;
  isInWishlist: boolean = false;

  discountAmount: number = 0;

  constructor(
    private cart: CartService,
    private wishlist: WishlistService,
    private router: Router,
    private coupon: CouponService,
    private translate: TranslateService,
    private learningPath: LearningPathService
  ) {}

  ngOnInit() {
    this.initStars();

    if (!this.isExpertView) {
      this.listenToCart();
      this.listenToWishList();
      this.listenToCoupon();
    }
  }

  initStars() {
    if (!this.course) return;

    this.starsList = Array(5)
      .fill(null)
      .map((_, i) => {
        const rating = this.course?.rating! - i;

        if (rating >= 1) return this.star;
        if (rating > 0) return this.starHalf;
        return this.starNone;
      });
  }

  listenToCoupon() {
    this.subscription$.add(
      this.coupon.inUseCoupon$.subscribe((coupon) => {
        this.discountAmount = coupon?.discount ?? 0;
      })
    );
  }

  listenToCart() {
    this.subscription$.add(
      this.cart.cart$.subscribe((cart: ICourseCart) => {
        this.isInCart = cart.courses.some((c) => c.id === this.course?.id);
      })
    );
  }

  listenToWishList() {
    this.subscription$.add(
      this.wishlist.wishlist$.subscribe((wishlist: ICourseOverview[]) => {
        this.isInWishlist = wishlist.some((c) => c.id === this.course?.id);
      })
    );
  }

  viewCourseDetails() {
    if (!this.course || this.isEdit) return;
    this.router.navigate([
      this.isExpertView ? '/courses-manage/explore' : '/courses',
      this.course.id,
    ]);
  }

  handleRemoveCourse(e: Event) {
    e.stopPropagation();

    if (!this.course) return;
    this.onRemoveCourse.emit(this.course);
  }

  onAddToCart(event: Event) {
    event.stopPropagation();

    if (this.isInCart) {
      this.goToCart();
      return;
    }

    if (!this.course) return;
    this.cart.updateCart(this.course);
    this.cart.addToCartAnimation(this.item);
    // Remove from wishlist if exist
    this.isInWishlist && this.wishlist.updateWishlist(this.course);
  }

  onAddToWishlist(event: Event) {
    event.stopPropagation();
    if (!this.course) return;
    this.wishlist.updateWishlist(this.course);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  round(val: number) {
    return val?.toFixed(2);
  }

  stopEvent(e: Event) {
    e.stopPropagation();
  }

  getDueDate() {
    const dueTime = new Date(this.course?.dueDate || '');
    const now = new Date().getTime();
    return `${dueTime.toLocaleString()} (${this.translate.instant(
      'LABEL.REMAINING',
      { value: formatRemainingTime(dueTime.getTime() - now) }
    )})`;
  }

  onViewCertificate() {
    this.router.navigate(['/c', this.course?.certificateId])
  }

  onReEnroll() {
    if(!this.pathId) return;
    this.learningPath.reEnrollLearningPath(this.pathId).subscribe(res => {
      if(res?.isError) return;

      this.reinitLearningpath.emit();
    })
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
