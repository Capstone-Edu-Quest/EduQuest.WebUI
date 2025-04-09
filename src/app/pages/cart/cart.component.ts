import { Component, OnDestroy, OnInit } from '@angular/core';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';
import { CartService } from '../../core/services/cart.service';
import {
  ICoupon,
  ICourseCart,
  ICourseOverview,
} from '../../shared/interfaces/course.interfaces';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../core/services/wishlist.service';
import { CouponService } from '../../core/services/coupon.service';
import { MessageService } from '../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  animations: [fadeInOutAnimation],
})
export class CartComponent implements OnInit, OnDestroy {
  _cart!: ICourseCart;
  _wishlist!: ICourseOverview[];
  subsription$: Subscription = new Subscription();
  discountAmout: number = 0;
  _coupon: ICoupon | null = null;

  inputCoupon: string = '';

  constructor(
    private cart: CartService,
    private wishlist: WishlistService,
    private coupon: CouponService,
    private message: MessageService,
    private translate: TranslateService,
    private payment: PaymentService
  ) {}

  ngOnInit() {
    this.listenToCart();
    this.listenToWishlist();
    this.listenToCoupon();
  }

  listenToCoupon() {
    this.subsription$.add(
      this.coupon.inUseCoupon$.subscribe((coupon) => {
        this._coupon = coupon;
        this.discountAmout = coupon?.discount ?? 0;
      })
    );
  }

  listenToCart() {
    this.subsription$.add(
      this.cart.cart$.subscribe((cart) => {
        this._cart = cart;
      })
    );
  }

  listenToWishlist() {
    this.subsription$.add(
      this.wishlist.wishlist$.subscribe((wishlist) => {
        this._wishlist = wishlist;
      })
    );
  }

  removeCoupon() {
    this.coupon.useCoupon(null);
  }

  applyNewCoupon() {
    if (this.inputCoupon.trim() === '') return;
    this.coupon.useCoupon(this.inputCoupon);
    this.inputCoupon = '';
    // this.message.addMessage('success', this.translate.instant('MESSAGE.APPLIED_COUPON'));
  }

  onPressEnterCoupon(e: KeyboardEvent) {
    if (e.key !== 'Enter') return;
    this.applyNewCoupon();
  }

  onCheckout() {
    if(this.cart.cart$.value.courses.length === 0) {
      this.message.addMessage('error', this.translate.instant('MESSAGE.NO_COURSE_TO_CHECKOUT'));
      return;
    }

    this.payment.proceedCheckoutCart();
  }

  ngOnDestroy(): void {
    this.subsription$.unsubscribe();
  }
}
