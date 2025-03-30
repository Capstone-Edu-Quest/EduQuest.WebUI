import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  ICoupon,
  ICouponCreate,
  ICouponUpdate,
  ISearchCouponParams,
} from '../../shared/interfaces/course.interfaces';
import { HttpService } from './http.service';
import { endPoints } from 'src/app/shared/constants/endPoints.constant';
import { onConvertObjectToQueryParams } from '../utils/data.utils';

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
  public inUseCoupon$: BehaviorSubject<ICoupon | null> =
    new BehaviorSubject<ICoupon | null>(null);
  constructor(private http: HttpService) {}

  useCoupon(couponId: string | null) {
    if (!couponId) {
      this.inUseCoupon$.next(null);
    } else {
      this.getCouponById(couponId).subscribe((response) => {
        const coupons = response?.payload;
        if (!coupons || coupons?.length === 0) return;
        this.inUseCoupon$.next(coupons[0]);
      });
    }
  }

  getCouponById(id: string) {
    const queryParam: ISearchCouponParams = { code: id };
    return this.searchCoupons(queryParam);
  }

  searchCoupons(params: ISearchCouponParams) {
    return this.http.get<ICoupon[]>(
      endPoints.coupon + onConvertObjectToQueryParams(params)
    );
  }

  createCoupon(coupon: ICouponCreate) {
    return this.http.post<ICoupon>(endPoints.coupon, coupon);
  }

  updateCoupon(coupon: ICouponUpdate) {
    return this.http.update<ICoupon>(endPoints.coupon, coupon.code, coupon);
  }
}
