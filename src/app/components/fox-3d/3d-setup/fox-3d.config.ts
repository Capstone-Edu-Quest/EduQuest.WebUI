export enum bonePosition {
  foxName = 'metarig',
  head = 'head',
  earLeft = 'earL',
  earRight = 'earR',
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
  tail001 = 'tail001',
  tail002 = 'tail002',
  tail003 = 'tail003',
  tail004 = 'tail004',
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
