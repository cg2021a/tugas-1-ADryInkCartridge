import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/GLTFLoader.js';

function main() {
  
  const scene = new THREE.Scene();
  const canvas = document.querySelector('#bg');
  

  const size = {
    w : window.innerWidth * 1 ,
    h : window.innerHeight * 1 
  }

  const camera = new THREE.PerspectiveCamera(90, size.w / size.h,0.1,1000);
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.setSize( size.w , size.h);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();


  const pointlight = new THREE.PointLight( 0xffffff, 1, 0, 1.5 );
  pointlight.position.set(10,20,-5);
  pointlight.castShadow = true;
  pointlight.shadow.mapSize.width = 1024;
  pointlight.shadow.mapSize.height = 1024;
  pointlight.shadow.camera.near = 1;
  pointlight.shadow.camera.far = 100;
  scene.add( pointlight );
  // scene.add(new THREE.PointLightHelper(pointlight, 0.1, 0xff0000));

  const spotLight = new THREE.SpotLight( 0xffffff, 1.5 );
  spotLight.position.set(10,20,-1.5);;

  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 100;
  spotLight.shadow.camera.fov = 30;

  scene.add( spotLight );
  // const spotLightHelper = new THREE.SpotLightHelper( spotLight );
  // scene.add( spotLightHelper );

  const ambientlight = new THREE.AmbientLight( 0xffffff, 0.75 );
  scene.add( ambientlight );
  scene.fog = new THREE.Fog(0x556064, 5, 80);

  const loader2 = new THREE.TextureLoader();
  const texture2 = loader2.load("assets/photo_studio_broadway_hall.jpg", () => {
    const rt2 = new THREE.WebGLCubeRenderTarget(texture2.image.height);
    rt2.fromEquirectangularTexture(renderer, texture2);
    console.log(rt2);
    scene.background = rt2.texture;
  });

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geometry, color, x, y, z) {
    const material = new THREE.MeshStandardMaterial({color});

    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);

    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;

    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88,  -2,8,10),
  ];

  
  var texture, material, plane;

  texture = THREE.ImageUtils.loadTexture( "assets/Marble.jpg" );

  // assuming you want the texture to repeat in both directions:
  texture.wrapS = THREE.RepeatWrapping; 
  texture.wrapT = THREE.RepeatWrapping;

  // how many times to repeat in each direction; the default is (1,1),
  //   which is probably why your example wasn't working
  texture.repeat.set( 4, 4 ); 

  material = new THREE.MeshLambertMaterial({ map : texture });
  plane = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), material);
  plane.material.side = THREE.DoubleSide;
  plane.position.y = -3;
  plane.receiveShadow = true
  plane.rotation.x = Math.PI / 2;

  scene.add(plane);

  

    const gltfLoader = new GLTFLoader();

    gltfLoader.load('assets/rita_floor_lamp_brass_and_marble/scene.gltf', (gltf) => {
      const root = gltf.scene;
      root.scale.set(0.15,0.15,0.15)
      root.position.set(10,-3,-5)
      root.traverse((o) => {
        o.castShadow = true
        o.receiveShadow = true
        if (o.name == 'Rita_Floor_Lamp_BlackMarble_and_Brass_LAMP_SHADE_0') {
          o.material.emissive = new THREE.Color( 0xffffff );
          o.material.emissiveIntensity = 1;
        }
      });
      scene.add(root);
    });

    gltfLoader.load('assets/free__womb_chair/scene.gltf', (gltf) => {
      const root = gltf.scene;
      root.scale.set(0.5,0.5,0.5)
      root.position.set(-2,1.5,0)
      root.traverse((o) => {
        o.castShadow = true
        o.receiveShadow = true
      });
      scene.add(root);
    });

    gltfLoader.load('assets/belgrave_extending_dining_table_dark_oak/scene.gltf', (gltf) => {
      const root = gltf.scene;
      root.scale.set(0.1,0.1,0.1)
      root.position.set(-2,-3,10)
      root.traverse((o) => {
        o.castShadow = true
        o.receiveShadow = true
        console.log(o)
      });
      scene.add(root);
    });

    var cubeRenderTarget1 = new THREE.WebGLCubeRenderTarget(256, {
      format: THREE.RGBFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      encoding: THREE.sRGBEncoding,
    });
  
    var cubeCamera1 = new THREE.CubeCamera(1, 1000, cubeRenderTarget1);
  
    var cubeRenderTarget2 = new THREE.WebGLCubeRenderTarget(256, {
      format: THREE.RGBFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      encoding: THREE.sRGBEncoding,
    });
  
    var cubeCamera2 = new THREE.CubeCamera(1, 1000, cubeRenderTarget2);
  
    const refGeometry = new THREE.SphereGeometry(2, 32, 32);
    const refMaterial = new THREE.MeshBasicMaterial({
      envMap: cubeRenderTarget2.texture,
      combine: THREE.MultiplyOperation,
      reflectivity: 1,
    });
    const reflective = new THREE.Mesh(refGeometry, refMaterial);
  
    reflective.castShadow = true;
    reflective.receiveShadow = true;
  
    reflective.position.set(-2,15,10);
    scene.add(reflective);

  var count = 0;
  function render(time) {
    time *= 0.001;


    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    reflective.visible = false
    if (count % 2 === 0) {
      cubeCamera1.update(renderer, scene);
    } else {
      cubeCamera2.update(renderer, scene);
    }

    count++;
    reflective.visible = true
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
