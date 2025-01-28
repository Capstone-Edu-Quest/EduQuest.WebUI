import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Subscription } from 'rxjs';
import { CouponService } from '../../core/services/coupon.service';
import { ICourse } from '../../shared/interfaces/CourseInterfaces';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();
  discountAmout: number = 0;
  _wishlist: ICourse[] = [];

  constructor(
    private cart: CartService,
    private wishlist: WishlistService,
    private coupon: CouponService
  ) {}

  ngOnInit() {
    this.listenToCoupon();
    this.listenToWishlist();
  }

  listenToCoupon() {
    this.subscription$.add(
      this.coupon.inUseCoupon$.subscribe((coupon) => {
        this.discountAmout = coupon.discount;
      })
    );
  }

  listenToWishlist() {
    this.subscription$.add(
      this.wishlist.wishlist$.subscribe((wishlist) => {
        this._wishlist = wishlist;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
