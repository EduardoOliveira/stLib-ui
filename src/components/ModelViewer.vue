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

    const material = new THREE.MeshPhongMaterial({ color: 0x468966, specular: 0x111111, shininess: 200 });
    const light = new THREE.HemisphereLight(0x443333, 0x111122)
    const loader = new STLLoader();
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    return {
      baseUrl: import.meta.env.VITE_API_URL,
      scene: scene,
      camera: camera,
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
    this.scene.background = new THREE.Color(0xFFFFFF )
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
    this.renderer.setSize(this.$refs.canvas.clientWidth, this.$refs.canvas.clientHeight);
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
      this.loader.load(this.baseUrl + '/projects/'+this.project.uuid+'/assets/' + model.sha1, function (geometry) {

        console.log("loaded")
        const mesh = new THREE.Mesh(geometry, that.material);

        mesh.position.set(0, -Math.PI, 0);
        mesh.rotation.set(-Math.PI / 2, 0, 0);
        mesh.scale.set(0.1, 0.1, 0.1);

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = model.sha1;
        that.rendered[model.sha1] = mesh.uuid;

        //const box = new THREE.BoxHelper(mesh, 0xffffff);
        //that.scene.add(box);
        that.scene.add(mesh);


        var boundingBox = new THREE.Box3()
        boundingBox.setFromObject(mesh);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = that.camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));

        cameraZ *= 1.5; // zoom out a little so that objects don't fill the screen

        that.camera.position.z = cameraZ;

        const minZ = boundingBox.min.z;
        const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

        that.camera.far = cameraToFarEdge * 3;
        that.camera.updateProjectionMatrix();

        if (that.controls) {

          // set camera to rotate around center of loaded object
          that.controls.target = center;

          // prevent camera from zooming out far enough to create far plane cutoff
          that.controls.maxDistance = cameraToFarEdge * 2;

          that.controls.saveState();

        } else {

          that.camera.lookAt(center)

        }

      })
    },
    remove: function (sha1) {
      const object = this.scene.getObjectByProperty('uuid',this.rendered[sha1]);
      this.scene.remove(object);
      object.geometry.dispose();
      object.material.dispose();
      this.renderer.renderLists.dispose();
      delete (this.rendered[sha1]);
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
    },
    project: {
      type: Object,
      required: true
    }
  },
};
</script>

<style scoped>
</style>