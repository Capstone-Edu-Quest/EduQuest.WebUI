import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICoupon } from '../../shared/interfaces/course.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private defaultCoupon: ICoupon = {
    code: 'SUMMER20',
    description: 'Get 20% off on all courses this summer!',
    discount: 0.2,
    limit: -1,
    usages: 45,
    createdAt: '2025-02-20T10:00:00Z',
    createdBy: 'admin',
    startTime: '2025-03-01T00:00:00Z',
    expireTime: null,
    allowedUsePerUser: 1,
    // whitelistUserIds: null,
    // whitelistCourseIds: null,
  };
  public inUseCoupon$: BehaviorSubject<ICoupon | null> = new BehaviorSubject<ICoupon | null> (null);
  constructor() {}

  useCoupon(couponId: string | null) {
    if (!couponId) {
      this.inUseCoupon$.next(null);
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
