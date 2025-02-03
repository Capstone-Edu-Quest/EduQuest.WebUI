import {
  AnimationMixer,
  Mesh,
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

  loadingElement!: HTMLDivElement;
  totalLoadingObjects: number = 5;
  loadedObjects: number = 0;

  constructor(
    scene: Scene,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer
  ) {
    this.scene = scene;
    this.camera = camera;
    this.glTFLoader = new GLTFLoader();
  }

  updateLoading() {
    const percentEle = document.querySelector(
      '#three-loading #percent'
    ) as HTMLDivElement;
    const runningEle = document.querySelector(
      '#three-loading #running'
    ) as HTMLDivElement;

    this.loadedObjects++;

    percentEle.innerText = `${Math.floor(
      (this.loadedObjects / this.totalLoadingObjects) * 100
    )}%`;
    runningEle.style.width =
      (this.loadedObjects / this.totalLoadingObjects) * 100 + '%';

    if (this.loadedObjects === this.totalLoadingObjects) {
      this.loadingElement.style.display = 'none';
    }
  }

  async init() {
    this.loadingElement = document.getElementById(
      'three-loading'
    ) as HTMLDivElement;
    this.loadingElement.style.display = 'block';

    this.glTFLoader.load('/assets/characters/fox.glb', (gltf) => {
      const fox = gltf.scene;
      this.mixer = new AnimationMixer(fox);
      this.mixer.clipAction(gltf.animations[0]).play();

      fox.position.set(0, 0.2, 0);
      this.scene.add(fox);
      //   this.camera?.lookAt(fox.position);
      // console.log('added fox to the scene', fox);

      this.updateLoading();
    });

    await this.initBackground();
  }

  async initBackground() {
    this.glTFLoader.load('/assets/characters/rock-flat-grass.glb', (gltf) => {
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
      // console.log('added grass to the scene', grass);
      this.updateLoading();
    });

    // Tree
    this.glTFLoader.load('/assets/characters/tree.glb', (gltf) => {
      const tree = gltf.scene;
      const trees = [tree.clone(), tree.clone(), tree.clone()];
      trees[0].position.set(1, 0, -0.3);
      trees[1].position.set(-1, 0, -0.2);
      trees[2].position.set(-0.4, 0, -1.2);

      trees.forEach((_tree) => {
        this.scene.add(_tree);
      });

      this.updateLoading();
      // console.log('added tree to the scene', tree);
    });

    // Stone
    this.glTFLoader.load(
      '/assets/characters/resource-stone-large.glb',
      (gltf) => {
        const stone = gltf.scene;
        const stones = [stone.clone(), stone.clone(), stone.clone()];
        stones[0].position.set(1.5, 0, 0.2);
        stones[0].scale.set(3, 3, 3);
        stones[1].position.set(1.2, 0.2, -0.5);
        stones[1].scale.set(4, 4, 4);
        stones[2].position.set(0.7, 0.2, -0.5);
        stones[2].scale.set(4, 4, 4);
        stones.forEach((_stone) => {
          this.scene.add(_stone);
        });

        this.updateLoading();
      }
    );

    // Grass
    this.glTFLoader.load('/assets/characters/patch-grass-large.glb', (gltf) => {
      const grass = gltf.scene;
      const grasses = [grass.clone(), grass.clone(), grass.clone()];
      grasses[0].position.set(-0.7, 0, -0.7);
      grasses[0].scale.set(1.5, 1.5, 1.5);
      grasses[1].position.set(-1, 0, -0);
      grasses[1].scale.set(1.5, 1.5, 1.5);
      grasses[2].position.set(0.7, 0.2, -0.5);
      grasses[2].scale.set(1.5, 1.5, 1.5);
      grasses.forEach((_grass) => {
        this.scene.add(_grass);
      });

      this.updateLoading();
    });
  }

  update(delta: number) {
    this.mixer?.update(delta);
  }
}
