import { Component, OnInit } from '@angular/core';
import { CouponService } from '../../../core/services/coupon.service';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ICourse } from '../../../shared/interfaces/course.interfaces';
import { CartService } from '../../../core/services/cart.service';
import { Router } from '@angular/router';

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
    private cart: CartService,
    private router: Router
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

  viewCourseDetails(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }

  onAddToCart(course: ICourse, event: Event) {
    event.stopPropagation();
    this.cart.updateCart(course);
    this.wishlist.remove(course);
  }
}
