import {
  AnimationMixer,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class Character {
  scene!: Scene;
  mixer!: AnimationMixer;
  glTFLoader!: GLTFLoader;
  camera!: PerspectiveCamera;

  constructor(
    scene: Scene,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer
  ) {
    this.scene = scene;
    this.camera = camera;
    this.glTFLoader = new GLTFLoader();
  }

  async init() {
    await this.glTFLoader.load('/assets/characters/fox.glb', (gltf) => {
      const fox = gltf.scene;
      this.mixer = new AnimationMixer(fox);
      this.mixer.clipAction(gltf.animations[0]).play();

      fox.position.set(0, 0.2, 0);
      this.scene.add(fox);
      //   this.camera?.lookAt(fox.position);
      console.log('added fox to the scene', fox);
    });

    await this.initBackground();
  }

  async initBackground() {
    await this.glTFLoader.load(
      '/assets/characters/rock-flat-grass.glb',
      (gltf) => {
        const grass = gltf.scene;
        const grasses = [
          grass.clone(),
          grass.clone(),
          grass.clone(),
          grass.clone(),
          grass.clone(),
          grass.clone(),
        ];
        grasses[0].position.set(-0.2, 0, 0.2);
        grasses[1].position.set(0.3, 0, 0.2);
        grasses[2].position.set(0.1, 0.1, -0.2);
        grasses[3].position.set(-0.5, 0, 0);
        grasses[4].position.set(0.6, 0, -0.5);
        grasses[5].position.set(-0, 0.2, -0.6);

        grasses.forEach((_grass) => {
          this.scene.add(_grass);
        });
        this.scene.add(grass);
        console.log('added grass to the scene', grass);
      }
    );

    // Tree
    await this.glTFLoader.load('/assets/characters/tree.glb', (gltf) => {
      const tree = gltf.scene;
      const trees = [tree.clone(), tree.clone(), tree.clone()];
      trees[0].position.set(1, 0, -0.3);
      trees[1].position.set(-1, 0, -0.2);
      trees[2].position.set(-0.4, 0, -1.2);

      trees.forEach((_tree) => {
        this.scene.add(_tree);
      });
      console.log('added tree to the scene', tree);
    });
  }

  update(delta: number) {
    this.mixer?.update(delta);
  }
}
