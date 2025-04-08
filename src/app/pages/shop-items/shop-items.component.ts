import { Component, type OnInit, type OnDestroy } from '@angular/core';
import { faCoins, faPlus } from '@fortawesome/free-solid-svg-icons';
import { IShopItem } from '../../shared/interfaces/three.interfaces';
import { folderPath } from '../../shared/constants/path.constant';
import { IUser } from '../../shared/interfaces/user.interfaces';
import { Subscription } from 'rxjs';
import { UserService } from '../../core/services/user.service';
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

  constructor(private userService: UserService) {}

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
    this.items.forEach((item) => {
      item.isOwned = this.user?.mascotItem?.includes(item.id) ?? false;
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
