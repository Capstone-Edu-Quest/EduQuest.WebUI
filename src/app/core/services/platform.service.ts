import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { endPoints } from '../../shared/constants/endPoints.constant';
import {
  IBecomeInstructorReq,
  IInstructorApplyRes,
  ILeaderboard,
  IPlatformSettingsStats,
  IUpdateShopItem,
} from '../../shared/interfaces/others.interfaces';
import { BehaviorSubject } from 'rxjs';
import { IShopItemEdit } from '../../shared/interfaces/three.interfaces';
import { ILevel } from '../../shared/interfaces/Platform.interface';
import { UserService } from './user.service';
import { MessageService } from './message.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  platformStats$: BehaviorSubject<IPlatformSettingsStats | null> =
    new BehaviorSubject<IPlatformSettingsStats | null>(null);

  constructor(
    private http: HttpService,
    private user: UserService,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  initPlatformStats() {
    this.http
      .get<IPlatformSettingsStats>(endPoints.platformSettingStatistic)
      .subscribe((res) => {
        this.platformStats$.next(res?.payload ?? null);
      });
  }

  getShopItems(isGold?: boolean) {
    return this.http.get<IShopItemEdit[]>(
      endPoints.filterShopItem +
        (isGold !== undefined ? `?isGold=${isGold}` : '')
    );
  }

  updateShopItems(data: IUpdateShopItem) {
    return this.http.update(endPoints.shopitem, data);
  }

  purchaseShopItems(itemName: string) {
    const currentUser = this.user.user$.value;
    if (!currentUser) return;

    const userId = currentUser.id;

    return this.http
      .post(endPoints.purchaseItem, { userId, name: itemName })
      .pipe((res) => {
        return res;
      });
  }

  getLevels() {
    return this.http.get<ILevel[]>(endPoints.getLevel + '?Page=1&EachPage=100');
  }

  saveLevels(newLevels: ILevel[]) {
    return this.http.update(endPoints.level, newLevels);
  }

  getAppliedInstructor() {
    return this.http.get<IInstructorApplyRes[]>(
      endPoints.getUserByStatus + '?Status=pending'
    );
  }

  applyBecomeInstructor(param: IBecomeInstructorReq) {
    const formData = new FormData();
    Object.entries(param).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          (value ?? []).forEach((_v: any) => formData.append(key, _v as any));
        } else {
          formData.append(key, value as any);
        }
      }
    });

    return this.http.upload<IInstructorApplyRes>(
      endPoints.applyInstructor,
      formData
    );
  }

  getMyInstructorApplicant() {
    return this.http.get<IInstructorApplyRes>(endPoints.getMyInsApplicant);
  }

  getAssignedInstructorApplicantToMe() {
    return this.http.get<IInstructorApplyRes[]>(
      endPoints.instructorsListAssignedToMe +
        `?expertId=${this.user.user$.value?.id}`
    );
  }

  onUpdateInstructorStatus(
    UserId: string,
    isApprove: boolean,
    rejectedReason: string
  ) {
    return this.http.post(endPoints.approveInstructor, {
      UserId,
      isApprove,
      rejectedReason,
    });
  }

  cancelInstructorRegistration() {
    const params = {
      userId: this.user.user$.value?.id,
      isCanceled: true,
    };

    return this.http.post(endPoints.cancelInstructorApplication, params);
  }

  assignInstructorToExpert(instructorId: string, assignTo: string) {
    this.http
      .post(endPoints.assignInstructorToExpert, {
        instructorId,
        assignTo,
      })
      .subscribe((res) => {
        if (!res?.payload) {
          this.message.addMessage(
            'error',
            this.translate.instant('MESSAGE.ASSIGNED_FAIL')
          );
          return;
        }

        this.message.addMessage(
          'success',
          this.translate.instant('MESSAGE.ASSIGNED_SUCCESS')
        );
      });
  }

  getInstructorHomeStatistics() {
    return this.http.get(endPoints.instructorHome);
  }

  getInstructorRevenueReport() {
    return this.http.get(endPoints.instructorRevenueReport);
  }
  getLeaderboard() {
    return this.http.get<ILeaderboard[]>(endPoints.leaderboard);
  }
}
