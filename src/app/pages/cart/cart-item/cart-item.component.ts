import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ICourseOverview } from '../../../shared/interfaces/course.interfaces';
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CouponService } from '../../../core/services/coupon.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent implements OnInit, OnDestroy {
  @Input('course') course: ICourseOverview | null = null;
  @Input('isInCart') isInCart: boolean = false;

  star = faStar;
  starNone = faStarRegular;
  starHalf = faStarHalfStroke;

  discountValue: number = 0;
  subsription$: Subscription = new Subscription();

  starsList: any[] = [];
  constructor(
    private cart: CartService,
    private wishlist: WishlistService,
    private coupon: CouponService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initStars();
    this.listenToCoupon();
  }

  listenToCoupon() {
    this.subsription$.add(
      this.coupon.inUseCoupon$.subscribe((coupon) => {
        this.discountValue = coupon?.discount ?? 0;
      })
    );
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

  onAddToCart(event: Event) {
    event.stopPropagation();
    if (!this.course) return;

    this.cart.updateCart(this.course);
  }

  onAddToWishList(event: Event) {
    event.stopPropagation();
    if (!this.course) return;

    this.wishlist.updateWishlist(this.course);
  }

  onSwap(event: Event) {
    if (!this.course) return;

    this.onAddToCart(event);
    this.onAddToWishList(event);
  }

  onViewCourseDetails() {
    if (!this.course) return;
    this.router.navigate(['courses', this.course.id]);
  }

  ngOnDestroy(): void {
    this.subsription$.unsubscribe();
  }
}
