import { Component, OnDestroy, OnInit } from '@angular/core';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';
import { CartService } from '../../core/services/cart.service';
import { ICoupon, ICourse, ICourseCart } from '../../shared/interfaces/CourseInterfaces';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../core/services/wishlist.service';
import { CouponService } from '../../core/services/coupon.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  animations: [fadeInOutAnimation],
})
export class CartComponent implements OnInit, OnDestroy {
  _cart!: ICourseCart;
  _wishlist!: ICourse[];
  subsription$: Subscription = new Subscription();
  discountAmout: number = 0;
  _coupon: ICoupon | null = null;

  constructor(private cart: CartService, private wishlist: WishlistService, private coupon: CouponService) {}

  ngOnInit() {
    this.listenToCart();
    this.listenToWishlist();
    this.listenToCoupon();
  }

  listenToCoupon() {
    this.subsription$.add(
      this.coupon.inUseCoupon$.subscribe((coupon) => {
        this._coupon = coupon;
        this.discountAmout = coupon.discount;
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

  ngOnDestroy(): void {
    this.subsription$.unsubscribe();
  }
}
