import { Subscription } from 'rxjs';
import { IEquipmentServiceItem } from '../../shared/interfaces/ThreeInterfaces';
import { FoxService } from './../../core/services/fox.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-fox-items',
  templateUrl: './fox-items.component.html',
  styleUrl: './fox-items.component.scss',
})
export class FoxItemsComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();
  thumbnailPath = 'assets/characters/Thumbnails/';

  currentEquipedItem!: IEquipmentServiceItem;

  constructor(private FoxService: FoxService) {}

  ngOnInit(): void {
    this.listenToItemChange();
  }

  listenToItemChange() {
    this.subscription$.add(
      this.FoxService.currentEquipedItem$.subscribe((itemsSlot) => {
        this.currentEquipedItem = itemsSlot;
      })
    );
  }

  changeItem(itemId: string | undefined) {
    if (!itemId) return;

    this.FoxService.equipItem(itemId);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
