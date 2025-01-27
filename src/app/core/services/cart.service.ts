import { Injectable } from '@angular/core';
import { ICourse, ICourseCart } from '../../shared/interfaces/CourseInterfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: ICourseCart = {
    courses: [],
    total: 0,
  };
  public cart$: BehaviorSubject<ICourseCart> = new BehaviorSubject(this.cart);

  constructor() {}

  initCart() {
    // Call API
  }

  updateCart(course: ICourse) {
    const index = this.cart.courses.findIndex((c) => c.id === course.id);
    if (index === -1) {
      this.cart.courses.push(course);
    } else {
      this.cart.courses.splice(index, 1);
    }

    this.cart.total = this.cart.courses.reduce((acc, c) => acc + c.price, 0);
    this.cart$.next(this.cart);
  }
}
