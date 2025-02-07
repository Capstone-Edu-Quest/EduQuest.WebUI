import { Injectable } from '@angular/core';
import {
  IEquipmentPosition,
  IEquipmentServiceItem,
  equipmentType,
} from '../../shared/interfaces/three.interfaces';
import { BehaviorSubject, Subject } from 'rxjs';
import { FoxItems } from '../../components/fox-3d/3d-setup/fox-3d.config';

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

  // Store current equiped item
  public currentEquipedItem$: BehaviorSubject<IEquipmentServiceItem> =
    new BehaviorSubject<IEquipmentServiceItem>(this.defaultCurrentEquipedItem);

  // Trigger the fox to handle new item
  public equipStream$: Subject<string> = new Subject<string>();
  constructor() {
    // this.syncItem = this.syncItem.bind(this);
  }

  // trigger from outside to trigger update equipment
  equipItem(itemId: string) {
    this.equipStream$.next(itemId);
  }

  // trigger when three updated equipment
  syncItem = (equipment: IEquipmentPosition) => {
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
  };
}
