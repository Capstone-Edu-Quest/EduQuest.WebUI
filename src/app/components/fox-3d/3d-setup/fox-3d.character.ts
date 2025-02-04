import { equipmentType } from './../../../shared/interfaces/ThreeInterfaces';
import {
  AnimationMixer,
  Group,
  Mesh,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  grassData,
  grassStonePositions,
  stoneData,
  treePositions,
} from './fox-3d.config';

export default class Character {
  scene!: Scene;
  mixer!: AnimationMixer;
  glTFLoader!: GLTFLoader;
  camera!: PerspectiveCamera;

  loadingElement!: HTMLDivElement;
  fox!: Group<Object3DEventMap>;

  totalLoadingObjects: number = 5;
  loadedObjects: number = 0;

  equipment = {
    head: null,
    rightHand: null,
    leftHand: null,
    body: null,
    legs: null,
    feet: null,
  };

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

    this.glTFLoader.load('/assets/characters/fox.glb', (gltf) => {
      this.fox = gltf.scene;
      this.mixer = new AnimationMixer(this.fox);
      this.mixer.clipAction(gltf.animations[0]).play();

      this.fox.position.set(0, 0.2, 0);
      this.scene.add(this.fox);

      this.updateLoading();
    });

    await this.initBackground();
  }

  async initBackground() {
    this.glTFLoader.load('/assets/characters/rock-flat-grass.glb', (gltf) => {
      const grass = gltf.scene;
      const grasses = grassStonePositions.map((_grass) => grass.clone());
      grasses.forEach((_grass, index) => {
        _grass.position.set(
          grassStonePositions[index].x,
          grassStonePositions[index].y,
          grassStonePositions[index].z
        );
      });

      grasses.forEach((_grass) => {
        this.scene.add(_grass);
      });

      this.updateLoading();
    });

    // Tree
    this.glTFLoader.load('/assets/characters/tree.glb', (gltf) => {
      const tree = gltf.scene;
      const trees = treePositions.map((_tree) => tree.clone());
      trees.forEach((_tree, index) => {
        _tree.position.set(
          treePositions[index].x,
          treePositions[index].y,
          treePositions[index].z
        );
      });

      trees.forEach((_tree) => {
        this.scene.add(_tree);
      });

      this.updateLoading();
    });

    // Stone
    this.glTFLoader.load(
      '/assets/characters/resource-stone-large.glb',
      (gltf) => {
        const stone = gltf.scene;
        const stones = stoneData.map((_stone) => stone.clone());

        stones.forEach((_stone, index) => {
          _stone.position.set(
            stoneData[index].position.x,
            stoneData[index].position.y,
            stoneData[index].position.z
          );
          _stone.scale.set(
            stoneData[index].scale.x,
            stoneData[index].scale.y,
            stoneData[index].scale.z
          );
        });

        stones.forEach((_stone) => {
          this.scene.add(_stone);
        });

        this.updateLoading();
      }
    );

    // Grass
    this.glTFLoader.load('/assets/characters/patch-grass-large.glb', (gltf) => {
      const grass = gltf.scene;
      const grasses = grassData.map((_grass) => grass.clone());

      grasses.forEach((_grass, index) => {
        _grass.position.set(
          grassData[index].position.x,
          grassData[index].position.y,
          grassData[index].position.z
        );
        _grass.scale.set(
          grassData[index].scale.x,
          grassData[index].scale.y,
          grassData[index].scale.z
        );
      });

      grasses.forEach((_grass) => {
        this.scene.add(_grass);
      });

      this.updateLoading();
    });
  }

  updateEquipment(equimentId: string, equipmentType: equipmentType) {}

  update(delta: number) {
    this.mixer?.update(delta);
  }
}
