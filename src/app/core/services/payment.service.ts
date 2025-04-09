import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { CouponService } from './coupon.service';
import { HttpService } from './http.service';
import { endPoints } from '../../shared/constants/endPoints.constant';
import { PaymentConfigEnum } from '../../shared/enums/others.enum';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(
    private cart: CartService,
    private coupon: CouponService,
    private http: HttpService
  ) {}

  proceedCheckoutCart() {
    const cartId = this.cart.cart$.value.id;
    const couponCode = this.coupon.inUseCoupon$.value?.code ?? null;

    const checkOutItem = {
      cartId,
      couponCode,
      configEnum: null,
      successUrl: 'https://edu-quest-webui.vercel.app/',
      cancelUrl: 'https://edu-quest-webui.vercel.app/cart',
    };

    console.log(checkOutItem);

    this.http
      .post<string>(endPoints.checkout, checkOutItem)
      .subscribe((res) => {
        if (!res?.payload) return;

        window.open(res.payload, '_blank');
      });
  }

  purchaseSubscription(buyType: PaymentConfigEnum) {
    const checkOutItem = {
      cartId: null,
      couponCode: null,
      configEnum: buyType,
      successUrl: 'https://edu-quest-webui.vercel.app/',
      cancelUrl: 'https://edu-quest-webui.vercel.app/cart',
    };

    this.http
      .post<string>(endPoints.checkout, checkOutItem)
      .subscribe((res) => {
        if (!res?.payload) return;

        window.open(res.payload, '_blank');
      });
  }
}
