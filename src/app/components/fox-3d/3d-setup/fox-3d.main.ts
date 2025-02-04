import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import Character from './fox-3d.character';
import Enviroment from './fox-3d.enviroment';
import { IEquipmentPosition } from '../../../shared/interfaces/ThreeInterfaces';

export default class Fox3DMain {
  scene!: Scene;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;
  character!: Character;
  syncItem!: (item: IEquipmentPosition) => void

  constructor(
    scene: Scene,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer,
    syncItem: (item: IEquipmentPosition) => void
  ) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.syncItem = syncItem;
  }

  async init() {
    this.character = new Character(this.scene, this.camera, this.renderer, this.syncItem);
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
