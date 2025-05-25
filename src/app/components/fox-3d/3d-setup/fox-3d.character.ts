import { trigger } from '@angular/animations';
import {
  IEquipmentItem,
  IEquipmentPosition,
  IItemInUse,
  equipmentType,
} from '../../../shared/interfaces/three.interfaces';
import {
  AnimationMixer,
  Bone,
  Group,
  LoadingManager,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import {
  FoxItems,
  bonePosition,
  defaultEquipmentSlot,
  foxLevelConfigs,
  grassData,
  grassStonePositions,
  stoneData,
  treePositions,
} from './fox-3d.config';
import { GUI } from 'dat.gui';
import { folderPath } from '../../../shared/constants/path.constant';

export default class Character {
  scene!: Scene;
  mixer!: AnimationMixer;
  glTFLoader!: GLTFLoader;
  camera!: PerspectiveCamera;
  triggerLoaded!: () => void;

  loadingElement!: HTMLDivElement;
  fox!: Group<Object3DEventMap>;

  totalLoadingObjects: number = 5;
  loadedObjects: number = 0;

  pendingItemsId: string[] = [];

  syncItem!: (item: IEquipmentPosition) => void;
  addLoadingModel!: (f: Function) => void;

  loadingManager = new LoadingManager();

  equipment: IEquipmentPosition = JSON.parse(
    JSON.stringify(defaultEquipmentSlot)
  );

  constructor(
    scene: Scene,
    camera: PerspectiveCamera,
    syncItem: (item: IEquipmentPosition) => void,
    pendingItemsId: string[],
    triggerFoxLoaded: () => void,
    addLoadingModel: (f: Function) => void
  ) {
    this.scene = scene;
    this.camera = camera;
    this.syncItem = syncItem;
    this.pendingItemsId = pendingItemsId;
    this.triggerLoaded = triggerFoxLoaded;
    this.addLoadingModel = addLoadingModel;

    const dracoLoader = new DRACOLoader(this.loadingManager);
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    this.glTFLoader = new GLTFLoader(this.loadingManager);
    this.glTFLoader.setDRACOLoader(dracoLoader);
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
      this.totalLoadingObjects = 0;
      this.loadedObjects = 0;
      this.loadingElement.style.display = 'none';
      this.triggerLoaded();
    }
  }

  updateFoxSizeLevel(level: number) {
    const levelConfig =
      foxLevelConfigs[level - 1] ?? foxLevelConfigs[foxLevelConfigs.length - 1];
    this.fox.scale.set(levelConfig, levelConfig, levelConfig);
  }

  async init() {
    this.loadingElement = document.getElementById(
      'three-loading'
    ) as HTMLDivElement;

    this.glTFLoader.load(`${folderPath.characters}fox.glb`, (gltf) => {
      this.fox = gltf.scene;
      this.mixer = new AnimationMixer(this.fox);
      this.mixer.clipAction(gltf.animations[0]).play();

      this.fox.position.set(0, 0.2, 0);
      this.fox.scale.set(0, 0, 0);
      this.scene.add(this.fox);

      this.updateLoading();
      this.initItems();
      // this.updateEquipment('donut-necklace');
    });

    await this.initBackground();
  }

  initItems() {
    this.pendingItemsId.forEach((itemId) => {
      this.updateEquipment(itemId);
    });
  }

  async initBackground() {
    this.glTFLoader.load(
      `${folderPath.characters}rock-flat-grass.glb`,
      (gltf) => {
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
      }
    );

    // Tree
    this.glTFLoader.load(`${folderPath.characters}tree.glb`, (gltf) => {
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
      `${folderPath.characters}resource-stone-large.glb`,
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
    this.glTFLoader.load(
      `${folderPath.characters}patch-grass-large.glb`,
      (gltf) => {
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
      }
    );
  }

  updateEquipment(itemId: string) {
    const item = FoxItems.find((item) => item.id === itemId);

    // No Item in the list
    if (!item) {
      console.log('Item not found', itemId);
      return;
    }

    const currentEquipItem = this.equipment[item.position];

    // Not equip anything
    if (!currentEquipItem) {
      // Load new item & equip
      this.addItem(item, this.getBonesList(item.position));
      return;
    }

    // Item is currently equiped -> Remove from scene
    if (item.id === currentEquipItem.id) {
      this.removeItem(currentEquipItem, item);
      return;
    }

    // Item is different -> Remove current & Equip new item
    this.removeItem(currentEquipItem, item);
    this.addItem(item, this.getBonesList(item.position));
  }

  addItem(item: IEquipmentItem, boneName: bonePosition[]) {
    this.loadingElement.style.display = 'block';
    const path = `${folderPath.item}${item.id}-compressed.glb`;

    const bones: Bone[] = [];

    boneName.forEach((_bone) => {
      this.fox.traverse((child) => {
        if (child.type === 'Bone' && child.name === _bone) {
          bones.push(child as Bone);
        }
      });
    });

    bones.forEach((_boneIdx) => {
      this.totalLoadingObjects++;
      this.addLoadingModel(() => this.loadingManager.itemEnd(path));
      this.glTFLoader.load(path, (gltf) => {
        const model = gltf.scene;

        model.scale.set(item.scale.x, item.scale.y, item.scale.z);
        model.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
        model.position.set(
          item.translation.x,
          item.translation.y,
          item.translation.z
        );

        // this.addItemGui(model);
        _boneIdx.add(model);
        this.equipment[item.position] = { id: item.id, model };

        this.syncItem({ ...this.equipment });
        this.updateLoading();
      });
    });
  }

  addItemGui(item: Group<Object3DEventMap>) {
    const gui = new GUI();

    const scaleFolder = gui.addFolder('scale');
    scaleFolder.open();
    scaleFolder.add(item.scale, 'x', -20, 20);
    scaleFolder.add(item.scale, 'y', 0, 20);
    scaleFolder.add(item.scale, 'z', 0, 20);

    // const rotationFolder = gui.addFolder('rotation');
    // rotationFolder.open();
    // rotationFolder.add(item.rotation, 'x', 0, Math.PI * 2);
    // rotationFolder.add(item.rotation, 'y', 0, Math.PI * 2);
    // rotationFolder.add(item.rotation, 'z', 0, Math.PI * 2);

    const positionFolder = gui.addFolder('position');
    positionFolder.open();
    positionFolder.add(item.position, 'x', -20, 20);
    positionFolder.add(item.position, 'y', -20, 20);
    positionFolder.add(item.position, 'z', -20, 20);
  }

  removeItem(currentEquipItem: IItemInUse, item: IEquipmentItem) {
    const boneName = this.getBonesList(item.position);
    const bones: Bone[] = [];

    boneName.forEach((_bone) => {
      this.fox.traverse((child) => {
        if (child.type === 'Bone' && child.name === _bone) {
          bones.push(child as Bone);
        }
      });
    });

    bones.forEach((_bone) => {
      _bone.remove(currentEquipItem.model);
    });

    this.equipment[item.position] = null;
    this.syncItem({ ...this.equipment });
  }

  getBonesList(position: equipmentType) {
    let bone: bonePosition[] = [];
    switch (position) {
      case 'head':
        bone = [bonePosition.head];
        break;
      case 'rightHand':
        bone = [bonePosition.handRight];
        break;
      case 'leftHand':
        bone = [bonePosition.handLeft];
        break;
      case 'body':
        bone = [bonePosition.body01];
        break;
      case 'legs':
        bone = [bonePosition.body01];
        break;
      case 'feet':
        bone = [bonePosition.feetLeft, bonePosition.feetRight];
        break;
      default:
        break;
    }

    return bone;
  }

  update(delta: number) {
    this.mixer?.update(delta);
  }
}

// gltf-transform optimize './tinker-glasses.glb' './compressed/tinker-glasses-compressed.glb' --compress draco --texture-compress webp
