import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import Character from './fox-3d.character';
import Enviroment from './fox-3d.enviroment';

export default class Fox3DMain {
  scene!: Scene;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;
  character!: Character;

  constructor(
    scene: Scene,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer
  ) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
  }

  async init() {
    this.character = new Character(this.scene, this.camera, this.renderer);
    await this.character.init();

    const environment = new Enviroment(this.scene);
  }

  update(delta: number) {
    this.character?.update(delta);
  }
}
