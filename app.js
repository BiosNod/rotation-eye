import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(5, 5, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// UI Container
const uiContainer = document.createElement('div');
uiContainer.style.position = 'absolute';
uiContainer.style.top = '10px';
uiContainer.style.left = '10px';
uiContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
uiContainer.style.padding = '10px';
uiContainer.style.borderRadius = '5px';
uiContainer.style.color = 'white';
uiContainer.style.fontFamily = 'Arial, sans-serif';
uiContainer.style.zIndex = '100';
document.body.appendChild(uiContainer);

// Checkbox for "Look at Camera"
const checkboxLabel = document.createElement('label');
checkboxLabel.style.display = 'flex';
checkboxLabel.style.alignItems = 'center';
checkboxLabel.style.gap = '8px';
checkboxLabel.style.cursor = 'pointer';

const lookAtCameraCheckbox = document.createElement('input');
lookAtCameraCheckbox.type = 'checkbox';
lookAtCameraCheckbox.checked = true;

const checkboxText = document.createElement('span');
checkboxText.textContent = 'Смотреть на камеру';

checkboxLabel.appendChild(lookAtCameraCheckbox);
checkboxLabel.appendChild(checkboxText);
uiContainer.appendChild(checkboxLabel);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Grid Helper (земля)
const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x666666);
scene.add(gridHelper);

// Axes Helper
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(-5, 5, -5);
scene.add(pointLight);

// Load Eye Model
let eye = null;
const loader = new GLTFLoader();
loader.load(
    'anatomical_eye_ball.glb',
    (gltf) => {
    eye = gltf.scene;
    eye.position.set(0, 3, 0);
    eye.scale.setScalar(0.01);
    eye.castShadow = true;
    eye.receiveShadow = true;
    scene.add(eye);
    console.log('Eye model loaded successfully');
    },
    undefined,
    (error) => {
    console.error('Error loading eye model:', error);
    }
);

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // Eye looks at camera (if checkbox is checked)
    if (eye && lookAtCameraCheckbox.checked)
        eye.lookAt(camera.position);

    renderer.render(scene, camera);
}

animate();