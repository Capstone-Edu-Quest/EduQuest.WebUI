import { Subscription } from 'rxjs';
import {
  IEquipmentItem,
  IEquipmentServiceItem,
} from '../../shared/interfaces/three.interfaces';
import { FoxService } from './../../core/services/fox.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FoxItems } from '../../components/fox-3d/3d-setup/fox-3d.config';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';

@Component({
  selector: 'app-fox-items',
  templateUrl: './fox-items.component.html',
  styleUrl: './fox-items.component.scss',
  animations: [fadeInOutAnimation]
})
export class FoxItemsComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();
  thumbnailPath = 'assets/characters/Thumbnails/';

  slots: string[] = ['head', 'body', 'legs', 'leftHand', 'rightHand'];
  currentEquipedItem!: IEquipmentServiceItem;
  equippedItems: string[] = [];
  allItems: IEquipmentItem[] = FoxItems;

  allowedItemsId = ['katana', 'wings', 'samurai-hat', 'gold-belt', 'apollos-shield'];

  lockIcon = faLock;

  constructor(private FoxService: FoxService) {}

  ngOnInit(): void {
    this.listenToItemChange();
  }

  listenToItemChange() {
    this.subscription$.add(
      this.FoxService.currentEquipedItem$.subscribe((itemsSlot) => {
        this.currentEquipedItem = itemsSlot;
        this.initEquipItems();
      })
    );
  }

  changeItem(itemId: string | undefined) {
    if (!itemId || !this.allowedItemsId.includes(itemId)) return;

    this.FoxService.equipItem(itemId);
  }

  initEquipItems() {
    this.equippedItems = [];
    Object.keys(this.currentEquipedItem).forEach((key) => {
      if (this.currentEquipedItem[key]) {
        this.equippedItems.push(this.currentEquipedItem[key]?.id as string);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
