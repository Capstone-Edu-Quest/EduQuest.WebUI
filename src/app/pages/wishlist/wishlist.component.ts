import { Component, OnDestroy, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { Subscription } from 'rxjs';
import { CouponService } from '../../core/services/coupon.service';
import { ICourse } from '../../shared/interfaces/course.interfaces';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
  animations: [fadeInOutAnimation],
})
export class WishlistComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();
  discountAmout: number = 0;
  _wishlist: ICourse[] = [];

  constructor(
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
        this.discountAmout = coupon?.discount ?? 0;
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
