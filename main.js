import "./style.css";

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
// console.log(THREE);

window.addEventListener("DOMContentLoaded", init);

function init() {
  console.log("ok");
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
  camera.position.set(0, 50, 2); //カメラの位置を指定

  // ライト
  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  // fps設定

  // オブジェクト

  // 平面
  const planeGeometry = new THREE.PlaneGeometry(400, 400, 1, 1);
  const material = new THREE.MeshLambertMaterial({
    color: "orange",
  });
  const plane = new THREE.Mesh(planeGeometry, material);
  plane.rotateX(-Math.PI / 2);
  scene.add(plane);

  // 3dmodel
  const loader = new GLTFLoader();
  loader.load("");

  // キーボード操作

  // アニメーション関係
  // 初回実行
  tick();

  function tick() {
    requestAnimationFrame(tick);

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
