import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { CouponService } from './coupon.service';
import { HttpService } from './http.service';
import { endPoints } from '../../shared/constants/endPoints.constant';
import { PaymentConfigEnum } from '../../shared/enums/others.enum';
import {
  ITransaction,
  ITransactionFilterParams,
} from '../../shared/interfaces/transactions.interfaces';
import { onConvertObjectToQueryParams } from '../utils/data.utils';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(
    private cart: CartService,
    private coupon: CouponService,
    private http: HttpService,
    private user: UserService
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

  onRefund(transactionId: string, courseId: string) {
    return this.http.post(endPoints.refund, { courseId, transactionId });
  }

  filterTransaction(param: ITransactionFilterParams) {
    const query = onConvertObjectToQueryParams(param);
    return this.http.get<ITransaction[]>(endPoints.transactions + query);
  }

  getTransactionDetails(trId: string) {
    return this.http.get(
      endPoints.transactionDetails + `?transactionId=${trId}`
    );
  }

  getConnectedAccount() {
    if (!this.user.user$.value) return;
    this.http
      .get(
        endPoints.getConnectedPaymentAccount +
          `?userId=${this.user.user$.value.id}`
      )
      .subscribe((res) => {
        if (!res?.payload) {
          this.createStripeAccount();
        }
      });
  }

  createStripeAccount() {
    if (!this.user.user$.value) return;
    this.http
      .post<string>(endPoints.createStripeAccount, {})
      .subscribe((res) => {
        if (!res?.payload) return;

        window.open(res?.payload, "_blank");
      });
  }
}
