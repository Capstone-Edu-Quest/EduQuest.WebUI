import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import Fox3DMain from './3d-setup/fox-3d.main';
import { GUI } from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-fox-3d',
  templateUrl: './fox-3d.component.html',
  styleUrls: ['./fox-3d.component.scss'],
})
export class Fox3dComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    this.initThree();
  }

  async initThree() {
    const container = document.getElementById(
      'three-container'
    ) as HTMLDivElement;

    if (!container) {
      console.error('Can not find three container');
      return;
    }

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      32,
      container.offsetWidth / container.offsetHeight,
      0.1,
      1000
    );
    camera.position.set(-1, 2, 8.4);
    camera.lookAt(0, 1.8, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      // canvas: container,
      antialias: true,
    });
    // renderer.setSize(container.offsetWidth, container.offsetHeight);
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const updateDimension = () => {
      camera.aspect = container.clientWidth / container.offsetHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(container.offsetWidth, container.offsetHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      // console.log(
      //   'resize',
      //   container.offsetWidth,
      //   container.offsetHeight,
      //   container
      // );
    };

    window.addEventListener('resize', updateDimension);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.8, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.02;
    controls.minPolarAngle = 0;
    controls.maxDistance = 11;
    controls.minDistance = 8.3;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enablePan = false;
    // controls.enableZoom = false;

    // console.log(
    //   'container size: ',
    //   container.offsetHeight,
    //   container.offsetWidth
    // );

    const foxScene = new Fox3DMain(scene, camera, renderer);
    await foxScene.init();

    // const gui = new GUI();
    // gui.add(camera.position, "x", -20, 20);
    // gui.add(camera.position, "y", 0, 20);
    // gui.add(camera.position, "z", 0, 20);

    const clock = new THREE.Clock();
    let delta = 0;

    function animate() {
      requestAnimationFrame(animate);
      delta = clock.getDelta();
      foxScene.update(delta);
      controls.update();
      renderer.render(scene, camera);
    }

    const dimensionTimeout = setTimeout(() => {
      updateDimension();
      clearTimeout(dimensionTimeout);
    }, 1);
    animate();
  }
}
