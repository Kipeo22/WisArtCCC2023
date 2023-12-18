import "./style.css";

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
// console.log(THREE);

window.addEventListener("DOMContentLoaded", init);

function init() {
  console.log("ok");
  //前進か後進か変数宣言
  let moveForward = false;
  let moveback = false;
  let moveleft = false;
  let moveright = false;
  //移動速度と移動方向の定義
  const velocity = new THREE.Vector3();
  const directioin = new THREE.Vector3();

  // レンダラー
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#webgl"),
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement);

  // シーン
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x12223b);
  // scene.fog = new THREE.Fog(0x12223b, 0, 1000);

  // カメラ
  const camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 5); //カメラの位置を指定

  // ライト
  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  // fps設定
  const controls = new PointerLockControls(camera, renderer.domElement);
  window.addEventListener("click", () => {
    // console.log("え");
    controls.lock();
  });

  // オブジェクト

  // 平面
  const planeGeometry = new THREE.PlaneGeometry(400, 400, 1, 1);
  const material = new THREE.MeshLambertMaterial({
    color: "orange",
  });
  const plane = new THREE.Mesh(planeGeometry, material);
  plane.rotateX(-Math.PI / 2);
  scene.add(plane);

  // 3Dモデルの読み込み
  const islandLoader = new GLTFLoader();
  const islandWrap = new THREE.Object3D();
  scene.add(islandWrap);

  islandLoader.load(
    "./models/scene.gltf",
    (gltf) => {
      const island = gltf.scene;

      island.scale.set(0.03, 0.03, 0.03);
      island.position.setY(0.5);
      island.position.set(0, 0, -3);

      islandWrap.add(island);
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
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  let prevTime = performance.now(); //前

  // アニメーション関係
  // 初回実行
  tick();

  function tick() {
    requestAnimationFrame(tick);

    const time = performance.now(); //今

    // 前進後進判定
    directioin.z = Number(moveForward) - Number(moveback);
    directioin.x = Number(moveright) - Number(moveleft);

    //ポインターがONになった
    if (controls.isLocked) {
      const delta = (time - prevTime) / 1000;

      // 減衰
      velocity.z -= velocity.z * 5.0 * delta;
      velocity.x -= velocity.x * 5.0 * delta;

      if (moveForward || moveback) {
        velocity.z -= directioin.z * 200 * delta;
      }
      if (moveleft || moveright) {
        velocity.x -= directioin.x * 200 * delta;
      }

      controls.moveForward(-velocity.z * delta);
      controls.moveRight(-velocity.x * delta);
    }
    prevTime = time;

    // レンダリング
    renderer.render(scene, camera);
  }

  リザイズ;
  window.addEventListener("resize", onWindowResize);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
