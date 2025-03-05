import { Injectable } from '@angular/core';
import {
  ViolationActionEnum,
  ViolationsStatusEnum,
  ViolationsTypeEnum,
} from '../../shared/enums/violations.enum';

@Injectable({
  providedIn: 'root',
})
export class ViolationsService {
  constructor() {}

  onGetTypeLabel(type: ViolationsTypeEnum) {
    switch (type) {
      case ViolationsTypeEnum.COURSE:
        return 'LABEL.COURSE';
      case ViolationsTypeEnum.FEEDBACK:
        return 'LABEL.FEEDBACK';
      case ViolationsTypeEnum.USER:
        return 'LABEL.USER';
      default:
        return 'LABEL.UNKNOWN';
    }
  }

  onGetStatusLabel(status: ViolationsStatusEnum) {
    switch (status) {
      case ViolationsStatusEnum.PENDING:
        return 'LABEL.PENDING';
      case ViolationsStatusEnum.RESOLVED:
        return 'LABEL.RESOLVED';
      case ViolationsStatusEnum.REJECTED:
        return 'LABEL.REJECTED';
      default:
        return 'LABEL.UNKNOWN';
    }
  }

  onGetActionLabel(action: ViolationActionEnum | undefined | null) {
    switch (action) {
      case ViolationActionEnum.SUSPEND:
        return 'LABEL.SUSPEND';
      case ViolationActionEnum.WARN:
        return 'LABEL.WARN';
      case ViolationActionEnum.WARN_DELETE:
        return 'LABEL.WARN_DELETE';
      default:
      return '-';
    }
  }
}
