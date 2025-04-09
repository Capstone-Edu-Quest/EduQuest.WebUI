import { Component, ViewChild, type OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { ICouponCreateState } from '../../../../shared/interfaces/course.interfaces';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '../../../../core/services/modal.service';
import { CouponService } from '@/src/app/core/services/coupon.service';
import { MessageService } from '@/src/app/core/services/message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrl: './create-coupon.component.scss',
})
export class CreateCouponComponent implements OnInit {
  @ViewChild('timeGroup') timeGroupRef!: TemplateRef<any>;
  @ViewChild('textInput') textInputRef!: TemplateRef<any>;
  @ViewChild('numberInput') numberInputRef!: TemplateRef<any>;
  @ViewChild('arrayInput') arrayInputRef!: TemplateRef<any>;
  @ViewChild('none') noneRef!: TemplateRef<any>;

  @Output('created') created = new EventEmitter();

  coupon: ICouponCreateState = {
    code: null,
    startTime: '',
    description: '',
    expireTime: null,
    discount: 0,
    limit: -1,
    allowedUsePerUser: 1,
    // whitelistUserIds: null,
    // whitelistCourseIds: null,
  };

   expireTime = '17:30';
   expireDate = '2024-05-24'

   startTime = '14:30';
   startDate = '2024-05-12'

  newIcon = faPlus;
  removeIcon = faMinus;

  constructor(private modal: ModalService, private CouponService: CouponService, private message: MessageService, private translate: TranslateService) {}

  ngOnInit(): void {}

  getRenderKeys(): (keyof ICouponCreateState)[] {
    return Object.keys(this.coupon) as (keyof ICouponCreateState)[];
  }

  getTypeOfInput(key: keyof ICouponCreateState) {
    switch (key) {
      case 'code':
      case 'description':
        return this.textInputRef;
      case 'startTime':
      case 'expireTime':
        return this.timeGroupRef;
      case 'allowedUsePerUser':
      case 'discount':
      case 'limit':
        return this.numberInputRef;
      // case 'whitelistCourseIds':
      // case 'whitelistUserIds':
      //   return this.arrayInputRef;
      default:
        return this.noneRef;
    }
  }

  getCouponKey(key: string) {
    return key as keyof ICouponCreateState;
  }

  onAddCode() {
    this.coupon.code = '';
  }

  onRemoveCode() {
    this.coupon.code = null;
  }

  onAddLimit() {
    this.coupon.limit = 0;
  }

  onRemoveLimit() {
    this.coupon.limit = -1;
  }

  onCreate() {
    this.coupon.startTime = new Date(`${this.startDate}T${this.startTime}:00Z`).toISOString();
    this.coupon.expireTime = new Date(`${this.expireDate}T${this.expireTime}:00Z`).toISOString();

    this.CouponService.createCoupon(this.coupon).subscribe(res => {
      if(!res?.payload) return;

      this.modal.updateModalContent(null);
      this.created.emit('');
      this.message.addMessage('success', this.translate.instant('MESSAGE.CREATED_SUCCESSFULLY'));
    })
  }

  onCancel() {
    this.modal.updateModalContent(null);
  }
}
