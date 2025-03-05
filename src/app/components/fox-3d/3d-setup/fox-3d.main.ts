import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import Character from './fox-3d.character';
import Enviroment from './fox-3d.enviroment';
import { IEquipmentPosition } from '../../../shared/interfaces/three.interfaces';

export default class Fox3DMain {
  scene!: Scene;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;
  character!: Character;
  syncItem!: (item: IEquipmentPosition) => void;
  triggerFoxLoaded!: () => void;
  pendingItemsId: string[] = [];

  constructor(
    scene: Scene,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer,
    syncItem: (item: IEquipmentPosition) => void,
    pendingItemsId: string[],
    triggerFoxLoaded: () => void
  ) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.syncItem = syncItem;
    this.pendingItemsId = pendingItemsId;
    this.triggerFoxLoaded = triggerFoxLoaded;
  }

  async init() {
    this.character = new Character(this.scene, this.camera, this.syncItem, this.pendingItemsId, this.triggerFoxLoaded);
    await this.character.init();

    const environment = new Enviroment(this.scene);
  }

  update(delta: number) {
    this.character?.update(delta);
  }

  updateItem(itemId: string) {
    this.character?.updateEquipment(itemId);
  }
}
