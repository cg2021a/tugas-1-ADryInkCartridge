const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)

console.log(window.innerWidth)
const renderer = new THREE.WebGLRenderer({
  canvas:document.querySelector('#bg')
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth,window.innerHeight)

camera.position.setZ(30)

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 32),
  new THREE.MeshPhongMaterial({
    color: 0x424242,
    
  })
);

scene.add(sphere)

const box = new THREE.Mesh(
  new THREE.BoxGeometry(2,10,2),
  new THREE.MeshStandardMaterial({
    color: 0x424242,
    roughness: 0,
    metalness: 0,
  })
);
box.position.set(10,0,0)
scene.add(box)

const octahed = new THREE.Mesh(
  new THREE.OctahedronGeometry(4,0),
  new THREE.MeshBasicMaterial({
    color:0x1b2d14,
  })
);
octahed.position.set(-20,0,0)
scene.add(octahed)

const cone = new THREE.Mesh(
  new THREE.ConeGeometry(5,10,32,32),
  new THREE.MeshNormalMaterial({
  })
);
cone.position.set(-10,20,0)
scene.add(cone)

const ring = new THREE.Mesh(
  new THREE.RingGeometry(5,10,32),
  new THREE.MeshToonMaterial({
    color:0x49ef4,
    emissive:true,
    emissiveIntensity:0.1,
    wireframe:true
  })
);
ring.position.set(25,0,0)
scene.add(ring)

const ambilight = new THREE.AmbientLight(0xffffff,1); 

const plight = new THREE.PointLight(0xffffff,2); 
plight.position.set(20,10,0);
const lightHelper = new THREE.PointLightHelper(plight);
scene.add(lightHelper)

const spotLight = new THREE.SpotLight( 0xffffff ,1);
spotLight.position.set( -40, 0, 0 );
const spotLightHelper = new THREE.SpotLightHelper( spotLight );
scene.add( spotLightHelper );

const hemilight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
hemilight.position.set(0,15,0);
const hemihelper = new THREE.HemisphereLightHelper( hemilight, 5 );
scene.add( hemihelper );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
const dirlighthelper = new THREE.DirectionalLightHelper( directionalLight, 5 );
scene.add( dirlighthelper );

const lights = [ambilight, plight, spotLight, hemilight, directionalLight];
const helper = [lightHelper,spotLightHelper,hemihelper,dirlighthelper]
lights.forEach((x) => {
  scene.add(x)
});
lights.forEach((x) => {
  x.visible = false;
});

helper.forEach((x) => {
  x.visible = false;
});
lights[0].visible = true;


const changeL = document.getElementById('light');
changeL.addEventListener('change', (x) => {
  const selected = x.target.value;
  lights.forEach((x) => {
    x.visible = false;
  });
  lights[selected].visible = true;
  helper.forEach((x) => {
    x.visible = false;
  });
  if(selected - 1 >= 0){
    helper[selected-1].visible = true;
  }
});


function inFrame(obj,now){
  camera.updateMatrix();
  camera.updateMatrixWorld();
  var frustum = new THREE.Frustum();
  frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));  

  var pos = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z);
  if (!frustum.containsPoint(pos)) {
      return -now
  }
  else return now
}
function translate(obj,x,y,z,inframe){
  obj.position.x += (x * inframe)
  obj.position.y += (y * inframe)
  obj.position.z -= (z * inframe)
}

let bounceOct = 1
let sx = 0.05
let sy = 0.01
function animate(){
  requestAnimationFrame(animate)
  bounceOct = inFrame(octahed,bounceOct)
  translate(octahed,0.1,0.2,0,bounceOct)

  octahed.rotation.x +=0.005
  octahed.rotation.y +=0.002
  cone.rotation.y += 0.001
  cone.rotation.x += 0.002
  box.rotation.y += 0.002
  box.rotation.z += 0.001
  sphere.rotation.y += 0.001
  sphere.rotation.z += 0.002
  ring.rotation.z +=0.005
  ring.rotation.x +=0.005
  
  if (sphere.position.x >= 30 || sphere.position.x <= -30) sx = -sx;
  sphere.position.x += sx;
  if (sphere.position.y >= 30 || sphere.position.y <= -30) sy = -sy;
  sphere.position.y += sy;
  renderer.render(scene,camera)
}

animate()




