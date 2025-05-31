import { Component, type OnInit, type OnDestroy } from '@angular/core';
import { faCoins, faPlus } from '@fortawesome/free-solid-svg-icons';
import { IShopItem } from '../../shared/interfaces/three.interfaces';
import { folderPath } from '../../shared/constants/path.constant';
import { IUser } from '../../shared/interfaces/user.interfaces';
import { Subscription } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { PlatformService } from '../../core/services/platform.service';
import { MessageService } from '../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-shop-items',
  templateUrl: './shop-items.component.html',
  styleUrl: './shop-items.component.scss',
})
export class ShopItemsComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  coinIcon = faCoins;
  addIcon = faPlus;

  user: IUser | null = null;

  thumbnailPath = folderPath.itemThumbnail;

  items: IShopItem[] = [];

  constructor(
    private userService: UserService,
    private platform: PlatformService,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.listenToUser();
  }

  listenToUser() {
    this.subscription$.add(
      this.userService.user$.subscribe((user) => {
        this.user = user;
        this.initItems();
      })
    );
  }

  initItems() {
    this.platform.getShopItems(true).subscribe((data) => {
      if (!data?.payload) return;

      this.items = data.payload
        .map((item) => ({
          ...item,
          isOwned: this.user?.mascotItem?.includes(item.name) ?? false,
        }))
        .sort((a, b) => (a.isOwned ? 1 : b.isOwned ? -1 : 0));
    });
  }

  onPurchase(itemName: string) {
    const request$ = this.platform.purchaseShopItems(itemName);
    if (!request$) return;

    request$.subscribe((res) => {
      if (!res?.payload) {
        return;
      }

      this.message.addMessage(
        'success',
        this.translate.instant('MESSAGE.PURSCHASED_SUCCESS')
      );

      (this.user as any).mascotItem = [
        ...((this.user as any).mascotItem ?? []),
        itemName,
      ];
      
      (this.user as any).statistic.gold = (res.payload as any).gold ?? 0;

      this.userService.updateUser(this.user);

      this.items = this.items.map((item) => {
        if (item.name === itemName) {
          return { ...item, isOwned: true };
        }

        return item;
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
