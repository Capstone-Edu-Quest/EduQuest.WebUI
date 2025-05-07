import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ICourseOverview,
  ICourseCart,
  ICourse,
} from '../../../shared/interfaces/course.interfaces';
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Router } from '@angular/router';
import { CouponService } from '../../../core/services/coupon.service';

@Component({
  selector: 'app-course-search-item',
  templateUrl: './course-search-item.component.html',
  styleUrls: ['./course-search-item.component.scss'],
})
export class CourseSearchItemComponent implements OnInit, OnDestroy {
  @Input('course') course: ICourseOverview | null = null;

  @ViewChild('item') item!: ElementRef;

  star = faStar;
  starNone = faStarRegular;
  starHalf = faStarHalfStroke;

  starsList: any[] = [];

  subscription$: Subscription = new Subscription();
  isInCart: boolean = false;
  isInWishlist: boolean = false;

  discountAmount: number = 0;

  constructor(
    private cart: CartService,
    private wishlist: WishlistService,
    private router: Router,
    private coupon: CouponService
  ) {}

  ngOnInit() {
    this.initStars();
    this.listenToCart();
    this.listenToWishList();
    this.listenToCoupon();
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
      this.wishlist.wishlist$.subscribe((wishlist: (ICourse | ICourseOverview)[]) => {
        this.isInWishlist = wishlist.some((c) => c.id === this.course?.id);
      })
    );
  }

  viewCourseDetails() {
    if (!this.course) return;
    this.router.navigate(['/courses', this.course.id]);
  }

  round(val: number) {
    return val.toFixed(1)
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

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
