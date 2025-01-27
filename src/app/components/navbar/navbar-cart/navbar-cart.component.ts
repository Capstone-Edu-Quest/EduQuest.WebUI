import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { ICourseCart } from '../../../shared/interfaces/CourseInterfaces';

@Component({
  selector: 'app-navbar-cart',
  templateUrl: './navbar-cart.component.html',
  styleUrls: ['./navbar-cart.component.scss']
})
export class NavbarCartComponent implements OnInit {
  _cart!: ICourseCart;

  constructor(private cart: CartService) {}

  ngOnInit() {
    this.listenToCart();
  }

  listenToCart() {
    this.cart.cart$.subscribe((cart) => {
      this._cart = cart;
    });
  }

}
