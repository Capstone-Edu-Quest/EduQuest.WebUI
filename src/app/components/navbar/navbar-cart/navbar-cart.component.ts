import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { ICourseCart } from '../../../shared/interfaces/course.interfaces';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CouponService } from '../../../core/services/coupon.service';

@Component({
  selector: 'app-navbar-cart',
  templateUrl: './navbar-cart.component.html',
  styleUrls: ['./navbar-cart.component.scss'],
})
export class NavbarCartComponent implements OnInit, OnDestroy {
  _cart!: ICourseCart;
  discountAmout: number = 0;
  subscription$: Subscription = new Subscription();

  constructor(
    private cart: CartService,
    private router: Router,
    private coupon: CouponService
  ) {}

  ngOnInit() {
    this.listenToCart();
    this.listenToCoupon();
  }

  listenToCart() {
    this.subscription$.add();
    this.cart.cart$.subscribe((cart) => {
      this._cart = cart;
    });
  }

  listenToCoupon() {
    this.subscription$.add(
      this.coupon.inUseCoupon$.subscribe((coupon) => {
        this.discountAmout = coupon.discount;
      })
    );
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  viewCourseDetails(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
