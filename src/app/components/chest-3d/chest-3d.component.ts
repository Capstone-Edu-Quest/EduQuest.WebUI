import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  type OnInit,
} from '@angular/core';
import {
  AnimationMixer,
  Clock,
  LoadingManager,
  LoopOnce,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

@Component({
  selector: 'app-chest-3d',
  templateUrl: './chest-3d.component.html',
  styleUrl: './chest-3d.component.scss',
})
export class Chest3dComponent implements OnInit, AfterViewInit {
  @Output('onFinished') onFinished = new EventEmitter<void>();

  @ViewChild('threeChestContainer', { static: true })
  threeChestContainer!: ElementRef;
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private mixer!: AnimationMixer;
  private clock = new Clock();

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initThree();
    this.loadModel();
    this.animate();
  }

  private initThree(): void {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.camera.position.set(0, 1, 5);

    this.renderer = new WebGLRenderer({ alpha: true });
    this.renderer.setClearColor(0xfafbfc, 0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.threeChestContainer.nativeElement.appendChild(
      this.renderer.domElement
    );
  }

  private loadModel(): void {
    const loadingManager = new LoadingManager();
    const dracoLoader = new DRACOLoader(loadingManager);
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    const glTFLoader = new GLTFLoader(loadingManager);
    glTFLoader.setDRACOLoader(dracoLoader);

    glTFLoader.load(
      '/assets/animations/handpainted_animated_chest-compressed.glb',
      (gltf) => {
        const model = gltf.scene;
        this.scene.add(model);
        model.scale.set(3, 3, 3);

        this.mixer = new AnimationMixer(model);

        // Assuming you only need to play the first animation
        const clip = gltf.animations[0];
        const action = this.mixer.clipAction(clip);
        action.loop = LoopOnce;
        action.clampWhenFinished = true;
        action.play();

        // Dispose when finished
        this.mixer.addEventListener('finished', () => {
          this.onFinished.emit();
          this.dispose();
        });
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    if (this.mixer) this.mixer.update(delta);

    this.renderer.render(this.scene, this.camera);
  };

  ngOnDestroy(): void {
    this.dispose();
  }

  private dispose(): void {
    this.renderer.dispose();
    this.scene.clear();
  }
}
