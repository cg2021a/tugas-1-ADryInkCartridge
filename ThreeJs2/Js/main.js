const scoreHTML = document.querySelector("#score");
const start = document.querySelector("#start")
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x121212);

const canvas = document.querySelector("#bg");

const size = {
  w : window.innerWidth * 0.8 ,
  h : window.innerHeight * 0.8 
}

scene.add(new THREE.DirectionalLight(0xffffbb, 1));
scene.add(new THREE.AmbientLight(0xffffff, 1));
const camera = new THREE.PerspectiveCamera(90, size.w / size.h,0.1,1000);
camera.position.set(0, 0, 50);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
const orbitControls = new THREE.OrbitControls(camera, canvas);
renderer.setSize( size.w , size.h);
renderer.setPixelRatio(window.devicePixelRatio);

const rayCast = new THREE.Raycaster();
const mouse = new THREE.Vector2();
mouse.x = mouse.y = -1;

var clock = new THREE.Clock();
var time = 0
var delta = 0
var speed = 2
var score = 0
const maxAmnt = 10
const colors = randColorGen(10);
var sceneBuffer = []

start.addEventListener('click',(e)=>{
  selected = []
  canvas.addEventListener("click", (e) => {
    mouse.x = ( e.offsetX / size.w) * 2 - 1;
    mouse.y = -( e.offsetY / size.h) * 2 + 1;
    rayCast.setFromCamera(mouse, camera);
    console.log(mouse)
    let items = rayCast.intersectObjects(scene.children, false);
    let flag = 1
    console.log(items)
    items.forEach((item) => {
      if (!item.object.tag && flag) {
        selected.push(item.object);
        item.object.material.color.set(0xffffff);
        item.object.tag = true;
        flag++;
      } 
    });
    if (selected.length == 2) {
      if (selected[0].oldcolor == selected[1].oldcolor){
        console.log('Noice')
        scene.remove(selected[0],selected[1]);
        selected = []
        amnt -= 2
        score++
        scoreHTML.innerHTML = ("Score: " + score)
      }
      else {
        console.log('nein')
        resetTag(selected)
        selected = []
      }
    }
    if(selected.length > 2){
      resetTag(selected)
      selected = []
    }
  });
  scoreHTML.innerHTML = ("Score: " + 0)
  while(scene.children.length > 0){ 
    scene.remove(scene.children[0]); 
  }
  time = 0
  delta = 0
  speed = 2
  score = 0
  sceneBuffer = []
  for (i = 0; i<5 ; i++) {
    coupling(colors)
  }
  var amnt = 0
  var spawntime = 0 + speed

  function animate(){
    delta = clock.getDelta();
    time += delta;
    if(time >= spawntime && amnt < maxAmnt){
      index = radInt(0,sceneBuffer.length-1)
      scene.add(sceneBuffer[index])
      sceneBuffer.splice(index,1)
      amnt += 1
      console.log(amnt,sceneBuffer)

      if(sceneBuffer.length < maxAmnt){
        coupling(colors)
      }
      if (speed>= 0.5){
        speed-=0.05
      }
      spawntime = speed + time
      console.log(speed)
    }
    

    orbitControls.update();
    renderer.render(scene,camera)
    requestAnimationFrame(animate);
  }

  animate()
})

