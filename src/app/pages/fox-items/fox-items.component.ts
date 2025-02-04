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

  currentEquipedItem!: IEquipmentServiceItem;
  itemsSlot!: { key: string; thumbnailUrl: string | null }[];

  constructor(private FoxService: FoxService) {}

  ngOnInit(): void {
    this.listenToItemChange();
  }

  listenToItemChange() {
    this.subscription$.add(
      this.FoxService.currentEquipedItem$.subscribe((itemsSlot) => {
        this.currentEquipedItem = itemsSlot;
        this.loadItems();
      })
    );
  }

  loadItems() {
    const thumbnailPath = 'assets/characters/Thumbnails/';
    this.itemsSlot = Object.keys(this.currentEquipedItem).map((key) => ({
      key,
      thumbnailUrl: this.currentEquipedItem[key]
        ? `${thumbnailPath}${this.currentEquipedItem[key]}.png`
        : null,
    }));
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
