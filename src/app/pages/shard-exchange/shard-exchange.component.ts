import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { PlatformService } from '../../core/services/platform.service';
import { IShopItem } from '../../shared/interfaces/three.interfaces';
import { folderPath } from '../../shared/constants/path.constant';
import { IUser } from '../../shared/interfaces/user.interfaces';
import { MessageService } from '../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-shard-exchange',
  templateUrl: './shard-exchange.component.html',
  styleUrl: './shard-exchange.component.scss',
})
export class ShardExchangeComponent implements OnInit {
  shardsList: [string, number][] = [];

  thumbnailPath = folderPath.itemThumbnail;

  items: IShopItem[] = [];
  userInfo: IUser | null = null;

  constructor(
    private user: UserService,
    private platform: PlatformService,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.listenToUser();
    this.initItems();
  }

  listenToUser() {
    this.user.user$.subscribe((user) => {
      this.userInfo = user;
      this.shardsList = Object.entries(user?.itemShards ?? {});
      this.initItems();
    });
  }

  initItems() {
    this.platform.getShopItems(false).subscribe((data) => {
      if (!data?.payload) return;

      this.items = data.payload
        .map((item) => ({
          ...item,
          isOwned: this.userInfo?.mascotItem?.includes(item.name) ?? false,
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

      (this.userInfo as any).mascotItem = [
        ...((this.userInfo as any).mascotItem ?? []),
        itemName,
      ];
      (this.userInfo as any).itemShards = (res.payload as any).itemShards ?? {};

      this.user.updateUser(this.userInfo);

      this.items = this.items.map((item) => {
        if (item.name === itemName) {
          return { ...item, isOwned: true };
        }

        return item;
      });
    });
  }
}
