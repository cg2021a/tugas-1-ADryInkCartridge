function radInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createCube(color) { 
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(3, 3, 3),
      new THREE.MeshBasicMaterial({ color: color })
    );
    cube.oldcolor = color
    cube.tag = false;
    cube.position.set(radInt(-20,20),radInt(-20,20),radInt(-20,20))
    return cube;
};

function randColorGen(i) {
    var arr = []
    for (x = 0; x < i; x ++){
        arr.push(Math.floor(Math.random()*16777215));
    }
    return arr;
}

function coupling(colors) { 
    let idx = radInt(0,9)
    sceneBuffer.push(createCube(colors[idx]), createCube(colors[idx]));
}

function resetTag(cubes) {
    for (const cube of cubes) {
        cube.tag = false
        // console.log(cube)
        cube.material.color.set(cube.oldcolor)
    }
}

window.addEventListener("resize", () => {
    size.w = window.innerWidth * 0.8;
    size.h = window.innerHeight * 0.8;
    camera.aspect = s.w / s.w;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(window.devicePixelRatio);
  });