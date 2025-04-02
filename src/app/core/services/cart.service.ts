import { ElementRef, Injectable } from '@angular/core';
import {
  ICourse,
  ICourseCart,
  ICourseOverview,
} from '../../shared/interfaces/course.interfaces';
import { BehaviorSubject, Subject } from 'rxjs';
import { WishlistService } from './wishlist.service';
import { endPoints } from '../../shared/constants/endPoints.constant';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public cart$: BehaviorSubject<ICourseCart> = new BehaviorSubject<ICourseCart>(
    {
      courses: [],
      total: 0,
      numOfCourse: 0,
      id: '',
    }
  );

  constructor(private wishlist: WishlistService, private http: HttpService) {}

  initCart() {
    this.http.get<ICourseCart>(endPoints.cart).subscribe((res) => {
      if (!res?.payload) return;
      this.cart$.next(res.payload);
    });
  }

  updateCart(course: ICourseOverview) {
    const cart = this.cart$.value;
    const index = cart.courses.findIndex((c) => c.id === course.id);
    if (index === -1) {
      cart.courses.push(course);
    } else {
      cart.courses.splice(index, 1);
    }

    const ids = cart.courses.map((c) => c.id);
    this.http.update<ICourseOverview[]>(endPoints.addToCart, ids).subscribe((res) => {
      if(!res?.payload) return;
      
      cart.total = cart.courses.reduce((acc, c) => acc + c.price, 0);
      this.cart$.next(cart);
    });
  }

  addToCartAnimation(courseItem: ElementRef) {
    const courseElement = courseItem.nativeElement;
    const cartElement = document.querySelector('.cart');

    if (!cartElement || !courseElement) return;

    const productRect = courseElement.getBoundingClientRect();
    const cartRect = cartElement.getBoundingClientRect();

    // Clone the product element
    const flyComponent = courseElement.cloneNode(true) as HTMLElement;
    flyComponent.classList.add('flying-component');

    const productCenterX = (productRect.left + productRect.right) / 2;
    const productCenterY = (productRect.top + productRect.bottom) / 2;

    const cartCenterX = (cartRect.left + cartRect.right) / 2;
    const cartCenterY = (cartRect.top + cartRect.bottom) / 2;

    // Calculate the translation values based on the center of both elements
    const translateX = (cartCenterX - productCenterX) * 1.08;
    const translateY = cartCenterY - productCenterY - 20;
    flyComponent.style.setProperty('--translate-x', `${translateX}px`);
    flyComponent.style.setProperty('--translate-y', `${translateY}px`);

    // Apply the translation as CSS variables
    flyComponent.style.top = `${productRect.top}px`;
    flyComponent.style.left = `${productRect.left}px`;
    flyComponent.style.width = `${productRect.width}px`;
    flyComponent.style.height = `${productRect.height}px`;

    // Add the cloned element to the DOM
    document.body.appendChild(flyComponent);

    // Remove the cloned element after the animation
    setTimeout(() => {
      flyComponent.remove();
    }, 1000);
  }

  destroyCart() {
    this.cart$.next({
      courses: [],
      total: 0,
      numOfCourse: 0,
      id: '',
    });
  }
}
