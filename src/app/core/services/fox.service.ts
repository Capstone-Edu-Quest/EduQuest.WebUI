import { Injectable } from '@angular/core';
import {
  IEquipmentPosition,
  IEquipmentServiceItem,
} from '../../shared/interfaces/three.interfaces';
import { BehaviorSubject, Subject } from 'rxjs';
import { FoxItems } from '../../components/fox-3d/3d-setup/fox-3d.config';
import { UserService } from './user.service';
import { WebRole } from '../../shared/enums/user.enum';

@Injectable({
  providedIn: 'root',
})
export class FoxService {
  private defaultCurrentEquipedItem: IEquipmentServiceItem = {
    head: null,
    rightHand: null,
    leftHand: null,
    body: null,
    legs: null,
    feet: null,
  };

  private tempEquipment: IEquipmentServiceItem = {
    head: null,
    rightHand: null,
    leftHand: null,
    body: null,
    legs: null,
    feet: null,
  };

  private itemsAPIsSyncTimeout: any = null;
  public isFoxInit: boolean = false;
  public isSyncedItemAfterInit: boolean = false;
  private firstSyncedtimeout: any = null;

  // Store current equiped item
  public currentEquipedItem$: BehaviorSubject<IEquipmentServiceItem> =
    new BehaviorSubject<IEquipmentServiceItem>(this.defaultCurrentEquipedItem);

  // Trigger the fox to handle new item
  public equipStream$: Subject<string> = new Subject<string>();

  public loadedCheck: { waitingStack: any[]; foxIsLoaded: boolean } = {
    waitingStack: [],
    foxIsLoaded: false,
  };

  constructor(private user: UserService) {}

  initFox() {
    this.user.equippedItems$.subscribe((items) => {
      if (!this.user.user$.value || this.user.user$.value.roleId !== WebRole.LEARNER) {
        this.resetItems();
        this.isFoxInit = false;
      } else {
        if (this.isFoxInit) return;
        if (this.loadedCheck.foxIsLoaded) {
          items.forEach((item) => {
            this.equipItem(item);
          });
        } else {
          items.forEach((item) => {
            this.loadedCheck.waitingStack.push(() => this.equipItem(item));
          });
        }

        this.isSyncedItemAfterInit = items.length === 0;
        this.isFoxInit = true;
      }
    });
  }

  triggerFoxLoaded(isDestroy?: boolean) {
    this.loadedCheck.foxIsLoaded = !isDestroy;

    if (!this.loadedCheck.foxIsLoaded) {
      this.loadedCheck.waitingStack = [];
      return;
    }

    while (this.loadedCheck.waitingStack.length > 0) {
      const f = this.loadedCheck.waitingStack.pop();
      f();
    }
  }

  // trigger from outside to trigger update equipment
  // Use in other component except fox
  equipItem(itemId: string | undefined) {
    if (!itemId) return;

    this.equipStream$.next(itemId);
  }

  // trigger when three updated equipment
  // Only use in fox
  syncItem = (equipment: IEquipmentPosition) => {
    clearTimeout(this.itemsAPIsSyncTimeout);

    const currentEquipment = { ...this.currentEquipedItem$.value };

    Object.keys(equipment).forEach((key) => {
      if (!equipment[key]) {
        currentEquipment[key] = null;
      } else {
        currentEquipment[key] =
          FoxItems.find((item) => item.id === equipment[key]?.id) || null;
      }
    });

    this.currentEquipedItem$.next(currentEquipment);

    if (!this.isSyncedItemAfterInit) {
      clearTimeout(this.firstSyncedtimeout);
      this.firstSyncedtimeout = setTimeout(() => {
        this.isSyncedItemAfterInit = true;
      }, 1000);

      return;
    }

    this.itemsAPIsSyncTimeout = setTimeout(() => {
      const itemIds: string[] = [];
      Object.keys(currentEquipment).forEach((key) => {
        const item = currentEquipment[key];
        if (item) {
          itemIds.push(item.id);
        }
      });

      this.user.equipItem(itemIds);
    }, 1000);
  };

  tempEquipItem(itemId: string[] | null) {
    if (!this.loadedCheck.foxIsLoaded && itemId) {
      this.loadedCheck.waitingStack.push(() => this.tempEquipItem(itemId));
      return;
    }

    if (!itemId) {
      this.resetItems();
      Object.keys(this.tempEquipment).forEach((key) => {
        this.equipItem(this.tempEquipment[key]?.id);
      });
      return;
    }

    this.tempEquipment = JSON.parse(
      JSON.stringify(this.currentEquipedItem$.value)
    );
    this.resetItems();

    itemId.forEach((id) => this.equipItem(id));
  }

  resetItems() {
    const equipmentItems = this.currentEquipedItem$.value;
    Object.keys(equipmentItems).forEach((key) => {
      if (equipmentItems[key]) {
        // console.log('remove', equipmentItems[key]?.id);
        this.equipItem(equipmentItems[key]?.id);
      }
    });
  }
}
