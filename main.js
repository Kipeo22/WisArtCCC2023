import "./style.css";

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
// console.log(THREE);

window.addEventListener("DOMContentLoaded", init);

function init() {
  // console.log("ok");
  //前進か後進か変数宣言
  let moveForward = false;
  let moveback = false;
  let moveleft = false;
  let moveright = false;
  // 上下
  let moveup = false;
  let movedown = false;
  //移動速度と移動方向の定義
  const velocity = new THREE.Vector3();
  const directioin = new THREE.Vector3(0, 0, -1);

  // レンダラー
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#webgl"),
    antialias: true,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement);

  // シーン
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x12223b);
  // scene.fog = new THREE.Fog(0x12223b, 0, 1000);
  scene.fog = new THREE.FogExp2(0xffffff, 0.01);

  // カメラ
  const camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 7, 13); //カメラの位置を指定

  // ライト
  const light1 = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  light1.position.set(0.5, 1, 0.75);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0xffffff, 1);
  light2.position.set(15, 10, 3);
  light2.castShadow = true;
  scene.add(light2);

  light2.shadow.mapSize.width = 1024; // default
  light2.shadow.mapSize.height = 1024; // default
  light2.shadow.camera.near = 0.5; // default
  light2.shadow.camera.far = 500; // default

  light2.shadow.camera.right = 12;
  light2.shadow.camera.left = -12;
  light2.shadow.camera.top = -12;
  light2.shadow.camera.bottom = 12;

  const directionalLightHelper = new THREE.DirectionalLightHelper(light2);
  // scene.add(directionalLightHelper);

  // fps設定
  const controls = new PointerLockControls(camera, renderer.domElement);
  window.addEventListener("click", () => {
    // console.log("え");
    controls.lock();
  });

  // オブジェクト
  const planeGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotateX(-Math.PI / 2);
  plane.receiveShadow = true;
  scene.add(plane);

  // 仮オブジェクト
  const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.castShadow = true;
  sphere.receiveShadow = false;
  // scene.add(sphere);

  // 3Dモデルの読み込み
  const islandLoader = new GLTFLoader();
  const islandWrap = new THREE.Object3D();
  scene.add(islandWrap);

  islandLoader.load(
    "./models/house_model/scene.gltf",
    (gltf) => {
      const island1 = gltf.scene;

      island1.traverse((Object) => {
        if (Object.isMesh) {
          Object.castShadow = true;
        }
      });

      island1.scale.set(0.03, 0.03, 0.03);
      island1.rotation.set(0.0, 4.7, 0.0);
      island1.position.set(-5, 0, -3);

      islandWrap.add(island1);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  islandLoader.load(
    "./models/santa_model/scene.gltf",
    (gltf) => {
      const island2 = gltf.scene;

      island2.traverse((Object) => {
        if (Object.isMesh) {
          Object.castShadow = true;
        }
      });

      island2.scale.set(2, 2, 2);
      island2.rotation.set(0.0, -1, 0.0);
      island2.position.set(5, 0, -3);

      island2.castShadow = true;
      island2.receiveShadow = false;
      islandWrap.add(island2);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
  // キーボード操作
  const onKeyDown = (e) => {
    //キーを押した時
    switch (e.code) {
      case "KeyW":
        moveForward = true;
        // console.log("ok");
        break;
      case "KeyS":
        moveback = true;
        break;
      case "KeyA":
        moveleft = true;
        break;
      case "KeyD":
        moveright = true;
        break;
      case "ShiftLeft": //下
        moveup = true;
        break;
      case "Space": //上
        movedown = true;
        break;
    }
  };

  const onKeyUp = (e) => {
    //キーを話した時
    switch (e.code) {
      case "KeyW":
        moveForward = false;
        break;
      case "KeyS":
        moveback = false;
        break;
      case "KeyA":
        moveleft = false;
        break;
      case "KeyD":
        moveright = false;
        break;
      case "ShiftLeft": //下
        moveup = false;
        break;
      case "Space": //上
        movedown = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  let prevTime = performance.now(); //前

  // アニメーション関係
  // 初回実行
  // tick();

  function tick() {
    requestAnimationFrame(tick);

    const time = performance.now(); //今

    // 前進後進判定
    directioin.z = Number(moveForward) - Number(moveback);
    directioin.x = Number(moveright) - Number(moveleft);

    // 上下
    directioin.y = Number(moveup) - Number(movedown);

    //ポインターがONになった
    if (controls.isLocked) {
      const delta = (time - prevTime) / 1000;

      // 減衰
      velocity.z -= velocity.z * 10.0 * delta;
      velocity.x -= velocity.x * 10.0 * delta;
      velocity.y -= velocity.y * 10.0 * delta;

      if (moveForward || moveback) {
        velocity.z -= directioin.z * 100 * delta;
      }
      if (moveleft || moveright) {
        velocity.x -= directioin.x * 100 * delta;
      }
      if (moveup || movedown) {
        velocity.y -= directioin.y * 100 * delta;
      }

      controls.moveForward(-velocity.z * delta);
      controls.moveRight(-velocity.x * delta);
    }
    prevTime = time;

    // レンダリング
    renderer.render(scene, camera);
  }
  tick();

  // リザイズ;
  window.addEventListener("resize", onWindowResize);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
