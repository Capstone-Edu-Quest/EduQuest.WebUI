import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICoupon } from '../../shared/interfaces/course.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private defaultCoupon: ICoupon = {
    id: 'coupon1',
    code: 'EDUQUEST',
    discount: 20,
    description: 'Default',
    expireDate: null,
  };
  private notUse: ICoupon = {
    id: 'notUse',
    code: 'notUse',
    discount: 0,
    description: 'Coupon represent for not use',
    expireDate: null,
  };
  public inUseCoupon$: BehaviorSubject<ICoupon> = new BehaviorSubject(
    this.notUse
  );
  constructor() {}

  useCoupon(couponId: string) {
    if (couponId === 'notUse') {
      this.inUseCoupon$.next(this.notUse);
    } else {
      const coupon: ICoupon = this.getCouponById(couponId);
      this.inUseCoupon$.next(coupon);
    }
  }

  getCouponById(id: string): ICoupon {
    // return this.coupons.find((coupon) => coupon.id === id);
    return this.defaultCoupon;
  }
}
