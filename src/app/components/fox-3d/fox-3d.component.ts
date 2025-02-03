import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import Fox3DMain from './3d-setup/fox-3d.main';
import { GUI } from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-fox-3d',
  templateUrl: './fox-3d.component.html',
  styleUrls: ['./fox-3d.component.scss'],
})
export class Fox3dComponent implements OnInit, OnDestroy {
  // @ViewChild('threeContainer', { static: true }) threeContainer!: ElementRef;

  randomId: number = Math.random() * new Date().getTime();
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  controls!: OrbitControls;
  animationFrameId!: number;

  constructor() {}

  ngOnInit() {
    const triggerTimeout = setTimeout(() => {
      this.initThree();
      clearTimeout(triggerTimeout);
    }, 100);
  }

  async initThree() {
    console.log('initThree');
    const container = document.getElementById(
      'three-container'
    ) as HTMLDivElement;

    if (!container) {
      console.error('Can not find three container');
      return;
    }

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      32,
      container.offsetWidth / container.offsetHeight,
      0.1,
      1000
    );
    this.camera.position.set(-1, 2, 8.4);
    this.camera.lookAt(0, 1.8, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      // canvas: container,
      antialias: true,
    });
    // renderer.setSize(container.offsetWidth, container.offsetHeight);
    // renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0);
    container.appendChild(this.renderer.domElement);

    const updateDimension = () => {
      this.camera.aspect = container.clientWidth / container.offsetHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(container.offsetWidth, container.offsetHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      // console.log(
      //   'resize',
      //   container.offsetWidth,
      //   container.offsetHeight,
      //   container
      // );
    };

    window.addEventListener('resize', updateDimension);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1.8, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.02;
    this.controls.minPolarAngle = 0;
    this.controls.maxDistance = 11;
    this.controls.minDistance = 8.3;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.enablePan = false;
    // controls.enableZoom = false;

    // console.log(
    //   'container size: ',
    //   container.offsetHeight,
    //   container.offsetWidth
    // );

    const foxScene = new Fox3DMain(this.scene, this.camera, this.renderer);
    await foxScene.init();

    // const gui = new GUI();
    // gui.add(camera.position, "x", -20, 20);
    // gui.add(camera.position, "y", 0, 20);
    // gui.add(camera.position, "z", 0, 20);

    const clock = new THREE.Clock();
    let delta = 0;

    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      delta = clock.getDelta();
      foxScene.update(delta);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };

    const dimensionTimeout = setTimeout(() => {
      updateDimension();
      clearTimeout(dimensionTimeout);
    }, 1);
    animate();
  }

  disposeThree() {
    console.log('clear three');
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
    if (this.scene) {
      this.scene.clear();
    }
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.controls) {
      this.controls.dispose();
    }
  }

  ngOnDestroy(): void {
    this.disposeThree();

    const container = document.getElementById('three-container');
    if (container) {
      console.log('Removing canvas from container');
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
  }
}
