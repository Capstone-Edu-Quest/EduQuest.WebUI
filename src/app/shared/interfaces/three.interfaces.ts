import { Object3D } from 'three';

export type equipmentType =
  | 'head'
  | 'rightHand'
  | 'leftHand'
  | 'body'
  | 'legs'
  | 'feet';

export interface IEquipmentPosition {
  [key: string]: IItemInUse | null;
}

export interface IEquipmentServiceItem {
  [key: string]: IEquipmentItem | null;
}

export interface IEquipmentItem {
  id: string;
  position: equipmentType;
  scale: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  translation: { x: number; y: number; z: number };
}

export interface IItemInUse {
  id: string;
  model: Object3D;
}

export interface IShopItem {
  id: string;
  price: number;
  isOwned: boolean;
}
