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
import { MessageService } from './message.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  public inUseCoupon$: BehaviorSubject<ICoupon | null> =
    new BehaviorSubject<ICoupon | null>(null);
  constructor(
    private http: HttpService,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  useCoupon(code: string | null) {
    if (!code) {
      this.inUseCoupon$.next(null);
    } else {
      this.http
        .get<ICoupon>(endPoints.couponLearner + `?Code=${code}`)
        .subscribe((res) => {
          if (!res?.payload) {
            this.message.addMessage(
              'error',
              this.translate.instant('MESSAGE.INVALID_COUPON')
            );
            return;
          }

          this.inUseCoupon$.next(res.payload);
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

  initCoupons() {
    return this.http.get<ICoupon[]>(endPoints.coupon);
  }

  createCoupon(coupon: ICouponCreate) {
    return this.http.post<ICoupon>(endPoints.coupon, coupon);
  }

  updateCoupon(coupon: ICouponUpdate) {
    return this.http.update<ICoupon>(
      endPoints.coupon + `/${coupon.code}`,
      coupon
    );
  }
}
