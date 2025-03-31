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

  items: IShopItem[] = [
    {
      id: 'orange-vest',
      price: 5,
      isOwned: false,
    },
    {
      id: 'wings',
      price: 30,
      isOwned: false,
    },
    {
      id: 'police-vest',
      price: 25,
      isOwned: false,
    },
    {
      id: 'leather-vest',
      price: 12,
      isOwned: false,
    },
    {
      id: 'donut-necklace',
      price: 12,
      isOwned: false,
    },
    {
      id: 'cow-boy-hat',
      price: 30,
      isOwned: false,
    },
    {
      id: 'samurai-hat',
      price: 30,
      isOwned: false,
    },
    {
      id: 'clown-hat',
      price: 5,
      isOwned: false,
    },
    {
      id: 'arrow-hat',
      price: 8,
      isOwned: false,
    },
    {
      id: 'tinker-glasses',
      price: 18,
      isOwned: false,
    },
    {
      id: 'sun-glasses',
      price: 12,
      isOwned: false,
    },
    {
      id: 'bicycle-hat',
      price: 15,
      isOwned: false,
    },
    {
      id: 'katana',
      price: 12,
      isOwned: false,
    },
    {
      id: 'miraz-sword',
      price: 16,
      isOwned: true,
    },
    {
      id: 'persian-sword',
      price: 30,
      isOwned: true,
    },
    {
      id: 'balloon',
      price: 5,
      isOwned: true,
    },
    {
      id: 'goblin-shield',
      price: 30,
      isOwned: true,
    },
    {
      id: 'apollos-shield',
      price: 22,
      isOwned: true,
    },
    {
      id: 'gold-belt',
      price: 30,
      isOwned: true,
    },
  ];

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
