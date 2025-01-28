import { Component, OnInit } from '@angular/core';
import { CouponService } from '../../../core/services/coupon.service';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ICourse } from '../../../shared/interfaces/CourseInterfaces';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-wishlist-cart',
  templateUrl: './wishlist-cart.component.html',
  styleUrls: ['./wishlist-cart.component.scss'],
})
export class WishlistCartComponent implements OnInit {
  subscription$: Subscription = new Subscription();
  _wishlist: ICourse[] = [];
  discountAmout: number = 0;

  constructor(
    private wishlist: WishlistService,
    private coupon: CouponService,
    private cart: CartService
  ) {}

  ngOnInit() {
    this.listenToWL();
    this.listenToCoupon();
  }

  listenToWL() {
    this.subscription$.add();
    this.wishlist.wishlist$.subscribe((wishlist) => {
      this._wishlist = wishlist;
    });
  }

  listenToCoupon() {
    this.subscription$.add(
      this.coupon.inUseCoupon$.subscribe((coupon) => {
        this.discountAmout = coupon.discount;
      })
    );
  }

  onAddToCart(course: ICourse) {
    this.cart.updateCart(course);
    this.wishlist.remove(course);
  }
}
