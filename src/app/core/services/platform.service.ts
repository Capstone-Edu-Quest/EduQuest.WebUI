import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { endPoints } from '../../shared/constants/endPoints.constant';
import {
  IPlatformSettingsStats,
  IUpdateShopItem,
} from '../../shared/interfaces/others.interfaces';
import { BehaviorSubject } from 'rxjs';
import {
  IShopItem,
  IShopItemEdit,
} from '../../shared/interfaces/three.interfaces';
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

  getShopItems() {
    return this.http.get<IShopItemEdit[]>(endPoints.filterShopItem);
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
        if (!res) {
          this.message.addMessage(
            'error',
            this.translate.instant('MESSAGE.PURSCHASE_FAILED')
          );
        } else {
          this.message.addMessage(
            'success',
            this.translate.instant('MESSAGE.PURSCHASED_SUCCESS')
          );

          currentUser.mascotItem = [...currentUser.mascotItem, itemName];
          this.user.updateUser(currentUser);
        }

        return res;
      });
  }

  getLevels() {
    return this.http.get<ILevel[]>(endPoints.getLevel + '?Page=1&EachPage=100');
  }

  saveLevels(newLevels: ILevel[]) {
    return this.http.update(endPoints.level, newLevels);
  }
}
