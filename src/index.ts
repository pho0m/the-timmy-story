import { KeyDisplay } from "./utils";
import { CharacterControls } from "./characterControls";
import * as THREE from "three";
import { CameraHelper } from "three";
import { Scene3D, PhysicsLoader, Project, ExtendedObject3D } from "enable3d";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8def0);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.y = 5;
camera.position.z = 5;
camera.position.x = 0;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

// CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.minDistance = 5;
orbitControls.maxDistance = 30;
orbitControls.enablePan = true;
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
orbitControls.update();

// LIGHTS
light();

// FLOOR
generateFloor();

// MODEL WITH ANIMATIONS
var characterControls: CharacterControls;
new GLTFLoader().load("models/Timmy.glb", function (gltf) {
  const model = gltf.scene;
  model.traverse(function (object: any) {
    if (object.isMesh) object.castShadow = true;
  });
  scene.add(model);

  const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
  const mixer = new THREE.AnimationMixer(model);
  const animationsMap: Map<string, THREE.AnimationAction> = new Map();
  gltfAnimations
    .filter((a) => a.name != "TPose")
    .forEach((a: THREE.AnimationClip) => {
      animationsMap.set(a.name, mixer.clipAction(a));
      console.log(a);
    });
  console.log(gltfAnimations);

  characterControls = new CharacterControls(
    model,
    mixer,
    animationsMap,
    orbitControls,
    camera,
    "Idle"
  );
});

var manager = new THREE.LoadingManager();
manager.onProgress = function (item, loaded, total) {
  console.log(item, loaded, total);
};

var loader = new GLTFLoader(manager);

loader.load("models/components/grass.glb", function (gltf) {
  const model = gltf.scene;
  model.traverse(function (object: any) {
    if (object.isMesh) object.castShadow = true;
  });
  scene.add(model);

  model.position.x = Math.floor(Math.random() * 22 - 20);
  model.position.z = Math.floor(Math.random() * 22 - 20);
  model.position.y = Math.floor(0);
});

loader.load("models/components/label.glb", function (gltf) {
  const model = gltf.scene;
  model.traverse(function (object: any) {
    if (object.isMesh) object.castShadow = true;
  });
  scene.add(model);

  model.position.x = Math.floor(Math.random() * 22 - 20);
  model.position.z = Math.floor(Math.random() * 22 - 20);
  model.position.y = Math.floor(0);
});

loader.load("models/components/Lowpolycar.glb", function (gltf) {
  const model = gltf.scene;
  model.traverse(function (object: any) {
    if (object.isMesh) object.castShadow = true;
  });
  scene.add(model);

  model.position.x = Math.floor(Math.random() * 22 - 20);
  model.position.z = Math.floor(Math.random() * 22 - 20);
  model.position.y = Math.floor(0);
});

loader.load("models/info/pp.glb", function (gltf) {
  const model = gltf.scene;
  model.traverse(function (object: any) {
    if (object.isMesh) object.castShadow = true;
  });
  scene.add(model);

  model.position.x = Math.floor(0);
  model.position.z = Math.floor(-100);
  model.position.y = Math.floor(15);
});

loader.load("models/info/mm.glb", function (gltf) {
  const model = gltf.scene;
  model.traverse(function (object: any) {
    if (object.isMesh) object.castShadow = true;
  });
  scene.add(model);

  model.position.x = Math.floor(10);
  model.position.z = Math.floor(-80);
  model.position.y = Math.floor(9);
});

loader.load("models/info/tct.glb", function (gltf) {
  const model = gltf.scene;
  model.traverse(function (object: any) {
    if (object.isMesh) object.castShadow = true;
  });
  scene.add(model);

  model.position.x = Math.floor(40);
  model.position.z = Math.floor(-120);
  model.position.y = Math.floor(20);
});

loader.load("models/info/by.glb", function (gltf) {
  const model = gltf.scene;
  model.traverse(function (object: any) {
    if (object.isMesh) object.castShadow = true;
  });
  scene.add(model);

  model.position.x = Math.floor(-30);
  model.position.z = Math.floor(-120);
  model.position.y = Math.floor(23);
});

// CONTROL KEYS
const keysPressed = {};
//const keyDisplayQueue = new KeyDisplay();
document.addEventListener(
  "keydown",
  (event) => {
    // keyDisplayQueue.down(event.key);
    if (event.shiftKey && characterControls) {
      characterControls.switchRunToggle();
    } else {
      (keysPressed as any)[event.key.toLowerCase()] = true;
    }
  },
  false
);
document.addEventListener(
  "keyup",
  (event) => {
    // keyDisplayQueue.up(event.key);
    (keysPressed as any)[event.key.toLowerCase()] = false;
  },
  false
);

const clock = new THREE.Clock();
// ANIMATE
function animate() {
  let mixerUpdateDelta = clock.getDelta();
  if (characterControls) {
    characterControls.update(mixerUpdateDelta, keysPressed);
  }
  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();

// RESIZE HANDLER
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  //  keyDisplayQueue.updatePosition();
}
window.addEventListener("resize", onWindowResize);

function generateFloor() {
  // TEXTURES
  const textureLoader = new THREE.TextureLoader();
  const placeholder = textureLoader.load(
    "./textures/placeholder/placeholder.png"
  );
  const roadmap = textureLoader.load("./textures/road/roadmap.png");

  const WIDTH = 100;
  const LENGTH = 100;

  const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);

  const material = new THREE.MeshPhongMaterial({ map: roadmap });

  const floor = new THREE.Mesh(geometry, material);

  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI / 2;

  scene.add(floor);
}

function light() {
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-60, 100, -10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 50;
  dirLight.shadow.camera.bottom = -50;
  dirLight.shadow.camera.left = -50;
  dirLight.shadow.camera.right = 50;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 200;
  dirLight.shadow.mapSize.width = 4096;
  dirLight.shadow.mapSize.height = 4096;
  scene.add(dirLight);
  //scene.add(new THREE.CameraHelper(dirLight.shadow.camera));
}
