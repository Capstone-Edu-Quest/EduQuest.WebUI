import { ElementRef, Injectable } from '@angular/core';
import { ICourse, ICourseCart } from '../../shared/interfaces/course.interfaces';
import { BehaviorSubject, Subject } from 'rxjs';
import { WishlistService } from './wishlist.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: ICourseCart = {
    courses: [],
    total: 0,
  };
  public cart$: BehaviorSubject<ICourseCart> = new BehaviorSubject(this.cart);

  constructor(private wishlist: WishlistService) {}

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

  destroyCart(){
    this.cart$.next(this.cart)
  }
}
