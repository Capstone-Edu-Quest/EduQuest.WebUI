import { CouponService } from '@/src/app/core/services/coupon.service';
import {
  AfterViewInit,
  Component,
  ViewChild,
  type OnInit,
  TemplateRef,
} from '@angular/core';
import { TableColumn } from '../../../shared/interfaces/others.interfaces';
import { ModalService } from '../../../core/services/modal.service';
import { ICoupon } from '../../../shared/interfaces/course.interfaces';

@Component({
  selector: 'app-coupons-settings',
  templateUrl: './coupons-settings.component.html',
  styleUrl: './coupons-settings.component.scss',
})
export class CouponsSettingsComponent implements OnInit, AfterViewInit {
  @ViewChild('whitelistUser') whitelistUserRef!: TemplateRef<any>;
  @ViewChild('whitelistCourse') whitelistCourseRef!: TemplateRef<any>;
  @ViewChild('status') statusRef!: TemplateRef<any>;
  @ViewChild('createCoupon') createCouponRef!: TemplateRef<any>;

  tableColumns: TableColumn[] = [];

  coupons: ICoupon[] = [];

  constructor(
    private modal: ModalService,
    private CouponService: CouponService
  ) {}

  ngOnInit(): void {
    this.initCoupons()
  }

  initCoupons() {
    this.CouponService.initCoupons().subscribe((data) => {
      if (!data?.payload) return;

      this.coupons = data.payload;
    });
  }

  ngAfterViewInit(): void {
    this.tableColumns = [
      {
        key: 'code',
        label: 'LABEL.CODE',
      },
      {
        key: 'description',
        label: 'LABEL.DESCRIPTION',
      },
      {
        key: 'discount',
        label: 'LABEL.DISCOUNT',
        render: (coupon: ICoupon) => `${(coupon?.discount ?? 0) * 100}%`,
      },
      {
        key: 'use_per_user',
        label: 'LABEL.USE_PER_USER',
        render: (coupon: ICoupon) => coupon.allowedUsePerUser,
      },
      {
        key: 'usages',
        label: 'LABEL.USAGES',
        render: (coupon: ICoupon) =>
          `${coupon.usages}/${coupon.limit === -1 ? '∞' : coupon.limit}`,
      },
      {
        key: 'available',
        label: 'LABEL.AVAILABLE_TIME',
        render: (coupon: ICoupon) =>
          `${this.generateTime(coupon.startTime)} - ${this.generateTime(
            coupon.expireTime
          )}`,
      },
      // {
      //   key: 'whitelist_user',
      //   label: 'LABEL.WHITELIST_USERS',
      //   elementRef: this.whitelistUserRef,
      // },
      // {
      //   key: 'whitelist_course',
      //   label: 'LABEL.WHITELIST_COURSES',
      //   elementRef: this.whitelistCourseRef,
      // },

      {
        key: 'status',
        label: 'LABEL.STATUS',
        elementRef: this.statusRef,
      },
    ];
  }

  generateTime(time: string | null) {
    if (!time) return '∞';

    return new Date(time).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Set to true for 12-hour format
    });
  }

  onGetStatus(coupon: ICoupon) {
    const now = new Date().getTime();
    const expire = coupon.expireTime
      ? new Date(coupon.expireTime).getTime()
      : null;
    const start = new Date(coupon.startTime).getTime();

    if (now < start) return 'UNACTIVE';

    if (expire && now > expire) return 'EXPIRED';

    return 'ACTIVE';
  }

  onCreateCoupon() {
    this.modal.updateModalContent(this.createCouponRef);
  }
}
