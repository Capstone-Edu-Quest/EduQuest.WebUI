import {
  IEquipmentItem,
  IEquipmentPosition,
} from '../../../shared/interfaces/three.interfaces';

export const foxLevelConfigs = [0.25, 0.32, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1];

export enum bonePosition {
  foxName = 'metarig',
  head = 'Head',
  earLeft = 'EarL',
  earRight = 'EarR',
  shoulderLeft = 'shoulderL',
  shoulderRight = 'shoulderR',
  armLeft = 'upper_armL',
  armRight = 'upper_armR',
  forearmRight = 'forearmR',
  forearmLeft = 'forearmL',
  handLeft = 'handL',
  handRight = 'handR',
  body01 = 'spine001',
  body02 = 'spine002',
  body03 = 'spine003',
  pelvisLeft = 'pelvisL',
  pelvisRight = 'pelvisR',
  thighLeft = 'thighL',
  thighRight = 'thighR',
  feetLeft = 'shinL',
  feetRight = 'shinR',
  tail001 = 'Tail001',
  tail002 = 'Tail002',
  tail003 = 'Tail003',
  tail004 = 'Tail004',
}

export const grassStonePositions = [
  { x: 0, y: 0, z: 0.2 },
  { x: -0.2, y: 0, z: 0.2 },
  { x: 0.3, y: 0, z: 0.2 },
  { x: 0.1, y: 0.1, z: -0.2 },
  { x: -0.5, y: 0, z: 0 },
  { x: 0.6, y: 0, z: -0.5 },
  { x: 0, y: 0.2, z: -0.6 },
  { x: -0.3, y: 0, z: -1 },
  { x: 0.7, y: 0, z: -1.2 },
  { x: 1, y: 0, z: -1 },
  { x: 1.3, y: 0, z: -0.5 },
];

export const treePositions = [
  { x: 1, y: 0.3, z: -0.3 },
  { x: -1, y: 0, z: -0.2 },
  { x: -0.4, y: 0, z: -1.2 },
];

export const stoneData = [
  { position: { x: 1.5, y: 0, z: 0.2 }, scale: { x: 3, y: 3, z: 3 } },
  { position: { x: 1.2, y: 0.2, z: -0.5 }, scale: { x: 4, y: 4, z: 4 } },
  { position: { x: 0.7, y: 0.2, z: -0.5 }, scale: { x: 4, y: 4, z: 4 } },
];

export const grassData = [
  { position: { x: -0.7, y: 0, z: -0.7 }, scale: { x: 1.5, y: 1.5, z: 1.5 } },
  { position: { x: -1, y: 0, z: 0 }, scale: { x: 1.5, y: 1.5, z: 1.5 } },
  { position: { x: 0.7, y: 0.2, z: -0.5 }, scale: { x: 1.5, y: 1.5, z: 1.5 } },
];

export const FoxItems: IEquipmentItem[] = [
  {
    id: 'orange-vest',
    position: 'body',
    scale: { x: 2.6, y: 2, z: 3.82 },
    rotation: { x: 0, y: 0, z: 0 },
    translation: { x: 0.05, y: -0.35, z: 0.185 },
  },
  {
    id: 'wings',
    position: 'body',
    translation: { x: 0, y: -0.2, z: -0.3 },
    scale: { x: 0.05, y: 0.05, z: 0.05 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'police-vest',
    position: 'body',
    translation: { x: 0.05, y: 0.12, z: 0 },
    scale: { x: 0.0029, y: 0.00175, z: 0.0032 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'leather-vest',
    position: 'body',
    translation: { x: 0, y: -2.74, z: 0 },
    scale: { x: 2.5, y: 2.3, z: 4 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'donut-necklace',
    position: 'body',
    scale: { x: 3, y: 3, z: 3 },
    translation: { x: 0, y: 0.67, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'cow-boy-hat',
    position: 'head',
    translation: { x: 0, y: 1, z: 0 },
    scale: { x: 0.32, y: 0.31, z: 0.32 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'samurai-hat',
    position: 'head',
    translation: { x: 0, y: 1.2, z: 0 },
    scale: { x: 0.5, y: 0.6, z: 0.5 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'clown-hat',
    position: 'head',
    translation: { x: 0, y: 2.3, z: 0 },
    scale: { x: 0.65, y: 0.4, z: 0.65 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'arrow-hat',
    position: 'head',
    translation: { x: 0, y: 1.3, z: 0 },
    scale: { x: 0.0065, y: 0.006, z: 0.0055 },
    rotation: { x: -Math.PI / 3, y: 0, z: 0 },
  },
  {
    id: 'tinker-glasses',
    position: 'head',
    translation: { x: 0, y: 0.85, z: 0.78 },
    scale: { x: 0.23, y: 0.25, z: 0.25 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'sun-glasses',
    position: 'head',
    translation: { x: 0, y: 0.7, z: 0.9 },
    scale: { x: 0.007, y: 0.0066, z: 0.005 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'bicycle-hat',
    position: 'head',
    translation: { x: 0, y: -0.2, z: 0.12 },
    scale: { x: 0.105, y: 0.08, z: 0.07 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'katana',
    position: 'rightHand',
    translation: { x: 0, y: 0.33, z: 1 },
    scale: { x: 0.025, y: 0.025, z: 0.025 },
    rotation: { x: Math.PI, y: 0, z: 0 },
  },
  {
    id: 'miraz-sword',
    position: 'rightHand',
    translation: { x: 0, y: 0.15, z: 0.9 },
    scale: { x: 1, y: 1.3, z: 1 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'persian-sword',
    position: 'rightHand',
    translation: { x: 0, y: 0, z: 0.85 },
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: Math.PI, y: 0, z: 0 },
  },
  {
    id: 'balloon',
    position: 'leftHand',
    translation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.7, y: 0.7, z: 0.7 },
    rotation: { x: Math.PI / 2, y: 0, z: 0.6 },
  },
  {
    id: 'goblin-shield',
    position: 'leftHand',
    translation: { x: -0.1, y: 0, z: 0.15 },
    scale: { x: 0.01, y: 0.01, z: 0.01 },
    rotation: { x: 0, y: -Math.PI / 2, z: Math.PI },
  },
  {
    id: 'apollos-shield',
    position: 'leftHand',
    translation: { x: -0.2, y: 0, z: 0 },
    scale: { x: 0.7, y: 0.7, z: 0.7 },
    rotation: { x: 0, y: -Math.PI / 2, z: 0 },
  },
  {
    id: 'gold-belt',
    position: 'legs',
    translation: { x: 0, y: -0.3, z: 0.34 },
    scale: { x: 0.28, y: 0.15, z: 0.35 },
    rotation: { x: 0, y: 0, z: 0 },
  },
];

export const defaultEquipmentSlot: IEquipmentPosition = {
  head: null,
  rightHand: null,
  leftHand: null,
  body: null,
  legs: null,
  feet: null,
};
