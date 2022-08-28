<template>
  <div ref="canvas"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

export default {
  name: "ModelViewer",
  data() {
    const scene = new THREE.Scene();


    const camera = new THREE.PerspectiveCamera(35, 16 / 9, 1, 1000);

    const cameraTarget = new THREE.Vector3(0, 5, 0);
    const material = new THREE.MeshPhongMaterial({ color: 0xAAAAAA, specular: 0x111111, shininess: 200 });
    const light = new THREE.HemisphereLight(0x443333, 0x111122)
    const loader = new STLLoader();
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    return {
      baseUrl: import.meta.env.VITE_API_URL,
      scene: scene,
      camera: camera,
      cameraTarget: cameraTarget,
      material: material,
      controls: [],
      loader: loader,
      renderer: renderer,
      light: light,
      speed: 0.01,
      rendered: {}
    };
  },
  created: function () {
    this.scene.add(this.camera)
    this.scene.add(this.light)
    this.scene.background = new THREE.Color('hsl(0, 100%, 100%)')
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.light.position.set(0, 0, 10)
    this.addShadowedLight(1, 1, 1, 0xffffff, 1.35);
    this.addShadowedLight(0.5, 1, - 1, 0xffaa00, 1);
    this.camera.position.set(15, 5, 15);
  },
  mounted: function () {

    this.$refs.canvas.appendChild(this.renderer.domElement)
    const h = this.$refs.canvas.offsetWidth * (9 / 16);
    this.renderer.setSize(this.$refs.canvas.offsetWidth, h);
    this.controls = new OrbitControls(this.camera, this.$refs.canvas);
    this.controls.target.set(0, 0, 0);
    this.controls.enablePan = true;
    this.controls.enableDamping = true;
    this.animate()
  },
  methods: {
    animate: function () {
      requestAnimationFrame(this.animate)
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    },
    addShadowedLight(x, y, z, color, intensity) {

      const directionalLight = new THREE.DirectionalLight(color, intensity);
      directionalLight.position.set(x, y, z);
      this.scene.add(directionalLight);

      directionalLight.castShadow = true;

      const d = 1;
      directionalLight.shadow.camera.left = - d;
      directionalLight.shadow.camera.right = d;
      directionalLight.shadow.camera.top = d;
      directionalLight.shadow.camera.bottom = - d;

      directionalLight.shadow.camera.near = 1;
      directionalLight.shadow.camera.far = 4;

      directionalLight.shadow.bias = - 0.002;

    },
    addModel: function (model) {
      let that = this;
      this.loader.load(this.baseUrl +'/models/get/' + model.sha1, function (geometry) {

        console.log("loaded")
        const mesh = new THREE.Mesh(geometry, that.material);

        mesh.position.set(0, -5, 0);
        mesh.rotation.set(-1, 0, 0);
        mesh.scale.set(0.1, 0.1, 0.1);

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = model.sha1;
        that.rendered[model.sha1] = mesh.uuid;
        that.scene.add(mesh);
      })
    },
    remove: function (model) {
      const object = this.scene.getObjectByProperty('uuid', model.sha1);
      this.scene.remove(object);
      object.geometry.dispose();
      object.material.dispose();
      this.renderer.renderLists.dispose();
      delete (this.redered[model.sha1]);
    }
  },
  watch: {
    models: {
      immediate: true,
      deep: true,
      handler(val, oldVal) {
        console.log(val, oldVal)
        for (let sha1 in this.rendered) {
          if (!val.find(x => x.sha1 == sha1)) {
            console.log('removing', sha1)
            this.remove(sha1);
          }
        }
        for (let i = 0; i < val.length; i++) {
          if (!this.rendered[val[i].sha1]) {
            console.log('adding', val[i].sha1)
            this.addModel(val[i]);
          }
        }
      }
    }
  },
  props: {
    models: {
      type: Array,
      required: true
    }
  },
};
</script>

<style scoped>
</style>