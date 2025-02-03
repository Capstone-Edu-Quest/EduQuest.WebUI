import { AmbientLight, DirectionalLight, Scene } from 'three';

export default class Enviroment {
  scene!: Scene;
  light!: DirectionalLight;

  constructor(scene: Scene) {
    this.scene = scene;

    this.light = new DirectionalLight(0xffffff, Math.PI);
    this.light.position.set(65.7, 19.2, 50.2);
    this.light.castShadow = true;
    this.scene.add(this.light);
    
    const light = new AmbientLight(0xffffff);
    this.scene.add(light);
  }
}
