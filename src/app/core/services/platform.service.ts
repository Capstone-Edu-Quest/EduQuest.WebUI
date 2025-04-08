import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { endPoints } from '../../shared/constants/endPoints.constant';
import { IPlatformSettingsStats, IUpdateShopItem } from '../../shared/interfaces/others.interfaces';
import { BehaviorSubject } from 'rxjs';
import { IShopItem, IShopItemEdit } from '../../shared/interfaces/three.interfaces';
import { ILevel } from '../../shared/interfaces/Platform.interface';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  platformStats$: BehaviorSubject<IPlatformSettingsStats | null> =
    new BehaviorSubject<IPlatformSettingsStats | null>(null);

  constructor(private http: HttpService) {}

  initPlatformStats() {
    this.http
      .get<IPlatformSettingsStats>(endPoints.platformSettingStatistic)
      .subscribe((res) => {
        this.platformStats$.next(res?.payload ?? null);
      });
  }

  getShopItems() {
    return this.http.get<IShopItemEdit[]>(endPoints.filterShopItem)
  }

  updateShopItems(data: IUpdateShopItem) {
    return this.http.update(endPoints.shopitem, data)
  }
  
  getLevels() {
    return this.http.get<ILevel[]>(endPoints.getLevel + '?Page=1&EachPage=100');
  }
  
}
