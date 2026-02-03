import * as THREE from "three";

export default class SceneInit {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1, 5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  initialize() {
    // attach renderer to canvas container
    const canvasDiv = document.getElementById(this.canvasId);
    if (!canvasDiv) throw new Error(`Canvas container #${this.canvasId} not found`);

    canvasDiv.appendChild(this.renderer.domElement);

    // basic lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 7);
    this.scene.add(dir);

    // resize handling
    window.addEventListener("resize", this.onWindowResize);
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };
}
