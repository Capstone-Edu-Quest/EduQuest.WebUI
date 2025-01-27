import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ICourse,
  ICourseCart,
} from '../../../shared/interfaces/CourseInterfaces';
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { CartService } from '../../../core/services/cart.service';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-coursesCard',
  templateUrl: './coursesCard.component.html',
  styleUrls: ['./coursesCard.component.scss'],
})
export class CoursesCardComponent implements OnInit, OnDestroy {
  @Input('course') course: ICourse | null = null;

  discounted: number = 0.7;

  star = faStar;
  starNone = faStarRegular;
  starHalf = faStarHalfStroke;

  starsList: any[] = [];

  subscription$: Subscription = new Subscription();
  isInCart: boolean = false;
  isInWishlist: boolean = false;

  constructor(private cart: CartService, private wishlist: WishlistService) {}

  ngOnInit() {
    this.initStars();
    this.listenToCart();
    this.listenToWishList();
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

  listenToCart() {
    this.subscription$.add(
      this.cart.cart$.subscribe((cart: ICourseCart) => {
        this.isInCart = cart.courses.some((c) => c.id === this.course?.id);
      })
    );
  }

  listenToWishList() {
    this.subscription$.add(
      this.wishlist.wishlist$.subscribe((wishlist: ICourse[]) => {
        this.isInWishlist = wishlist.some((c) => c.id === this.course?.id);
      })
    );
  }

  onAddToCart() {
    if (!this.course || this.isInCart) return;
    this.cart.updateCart(this.course);
  }

  onAddToWishlist() {
    if (!this.course) return;
    this.wishlist.updateWishlist(this.course);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
