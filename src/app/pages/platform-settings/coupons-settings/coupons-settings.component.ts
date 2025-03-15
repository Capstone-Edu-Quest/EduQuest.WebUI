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

  coupons: ICoupon[] = [
    {
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
      // whitelistCourseIds: ['ts', 'js'],
    },
    {
      code: 'NEWUSER15',
      description: '15% discount for new users on their first course!',
      discount: 0.15,
      limit: 200,
      usages: 150,
      createdAt: '2025-01-15T09:30:00Z',
      createdBy: 'admin',
      startTime: '2025-01-20T00:00:00Z',
      expireTime: '2025-12-31T23:59:59Z',
      allowedUsePerUser: 1,
      // whitelistUserIds: null,
      // whitelistCourseIds: null,
    },
    {
      code: 'SPRING25',
      description: 'Exclusive 25% off for the spring season!',
      discount: 0.25,
      limit: 50,
      usages: 25,
      createdAt: '2025-02-25T12:00:00Z',
      createdBy: 'marketing_team',
      startTime: '2025-04-01T00:00:00Z',
      expireTime: '2025-04-30T23:59:59Z',
      allowedUsePerUser: 1,
      // whitelistUserIds: null,
      // whitelistCourseIds: null,
    },
    {
      code: 'BLACKFRIDAY50',
      description: 'Massive 50% discount for Black Friday!',
      discount: 0.5,
      limit: 500,
      usages: 320,
      createdAt: '2024-10-01T08:45:00Z',
      createdBy: 'admin',
      startTime: '2024-11-25T00:00:00Z',
      expireTime: '2024-11-30T23:59:59Z',
      allowedUsePerUser: 1,
      // whitelistUserIds: ['a'],
      // whitelistCourseIds: null,
    },
    {
      code: 'STUDENT30',
      description: 'Students get 30% off with valid student ID!',
      discount: 0.3,
      limit: 300,
      usages: 180,
      createdAt: '2025-02-10T11:15:00Z',
      createdBy: 'support_team',
      startTime: '2025-02-15T00:00:00Z',
      expireTime: '2025-06-30T23:59:59Z',
      allowedUsePerUser: 2,
      // whitelistUserIds: null,
      // whitelistCourseIds: null,
    },
    {
      code: 'EARLYBIRD10',
      description: '10% discount for early course enrollments!',
      discount: 0.1,
      limit: -1,
      usages: 75,
      createdAt: '2025-03-01T14:00:00Z',
      createdBy: 'admin',
      startTime: '2025-03-10T00:00:00Z',
      expireTime: '2025-07-01T23:59:59Z',
      allowedUsePerUser: 1,
      // whitelistUserIds: null,
      // whitelistCourseIds: null,
    },
  ];

  constructor(private modal: ModalService) {}

  ngOnInit(): void {}

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

   if(now < start) return 'UNACTIVE';

    if (expire && now > expire) return 'EXPIRED';

    return 'ACTIVE';
  }

  onCreateCoupon() {
    this.modal.updateModalContent(this.createCouponRef);
  }
}
