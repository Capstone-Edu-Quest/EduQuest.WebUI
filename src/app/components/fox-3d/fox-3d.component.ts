import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import Fox3DMain from './3d-setup/fox-3d.main';
import { GUI } from 'dat.gui';

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
    ) as HTMLCanvasElement;

    if (!container) {
      console.error('Can not find three container');
      return;
    }

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      30,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(-1, 2, 8.4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    console.log(
      'container size: ',
      container.clientHeight,
      container.clientWidth
    );

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

      renderer.render(scene, camera);
    }

    animate();
  }
}
