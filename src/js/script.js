//Basics

var p_data = [["Earth",133,[7,30,30],'#33ba2f',true],["Mars",159,[6,30,30],'#ffa500',true],["Venus",118,[7,30,30],'#a8161d',false],["Mercury",80,[8,30,30],'#ffffff',true],["Jupiter",290,[13,30,30],'',true],["Saturn",320,[11,30,30],'',false],["Uranus",360,[8,30,30],'',true],["Neptune",400,[8,30,30],'',false]];


const center = (0,0,0)
var z_pos = 0;
var x_pos = 0;
var rad = 20;
var rot = 10;
var rot_mod = 0.004;
var planets = [];
var cam_zoom = 50;
var cam_rot_y = 0;
var cam_rot_x = 0;
var mode = 'vertical';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const terrain = new THREE.TextureLoader();
const earth = terrain.load("img/earth_texture.jpeg");
const mars = terrain.load("img/mars_texture.jpeg");
const mercury = terrain.load("img/mercury_texture.jpeg");
const venus = terrain.load("img/venus_texture.jpeg");
const jupiter = terrain.load("img/jupiter_texture.jpeg");
const saturn = terrain.load("img/saturn_texture.jpeg");
const uranus = terrain.load("img/uranus_texture.jpeg");
const neptune = terrain.load("img/neptune_texture.jpeg");
const sunText = terrain.load("img/sun_texture.jpeg");


class Planet{
  constructor(name,dist,size,colour,norm=true){
    this.name = name;
    this.dist = dist;
    this.size = size;
    this.colour = colour
    this.norm = norm
    
    if (this.norm == true){
      this.speed = 3000/dist**2*-1
    } else {
      this.speed = 3000/dist**2
    }
    
    this.geo = new THREE.SphereGeometry(this.size[0],this.size[1],this.size[2]);

    if (this.name == "Earth"){
      this.material = new THREE.MeshBasicMaterial({map: earth});   
    } else if (this.name == "Mars"){
      this.material = new THREE.MeshBasicMaterial({map: mars})
    } else if (this.name == "Mercury"){
      this.material = new THREE.MeshBasicMaterial({map: mercury})
    } else if (this.name == "Venus"){
      this.material = new THREE.MeshBasicMaterial({map: venus})
    } else if (this.name == "Jupiter"){
      this.material = new THREE.MeshBasicMaterial({map: jupiter})
    } else if (this.name == "Saturn"){
      this.material = new THREE.MeshBasicMaterial({map: saturn})
    } else if (this.name == "Uranus"){
      this.material = new THREE.MeshBasicMaterial({map: uranus})
    } else if (this.name == "Neptune"){
      this.material = new THREE.MeshBasicMaterial({map: neptune})
    } else {
      this.material = new THREE.MeshBasicMaterial({color: this.colour});   
    }
    this.mesh = new THREE.Mesh(this.geo,this.material);
  }
}    

for (var x = 0; x<p_data.length; x++){
  planets.push(new Planet(p_data[x][0],p_data[x][1],p_data[x][2],p_data[x][3],p_data[x][4]));
}


const sunGeo = new THREE.SphereGeometry(30,30,30);
const sunMaterial = new THREE.MeshBasicMaterial( {map: sunText} );
const sun = new THREE.Mesh(sunGeo,sunMaterial);

document.addEventListener("keydown",onPress,false);

function onPress(event){
  var code = event.which;
  //Orbiting
  if (code == 38){
    cam_rot_y -= 0.02;
    mode="vertical"
  } else if (code == 40){
    cam_rot_y += 0.02
    mode="vertical"
  } else if (code == 37){
    cam_rot_x -= 0.02;
    mode = "horizontal"
  } else if (code == 39){
    cam_rot_x += 0.02;
    mode = "horizontal"
  //Zoom
  } else if (code == 187){
    mode = "horizontal"
    if (cam_zoom > 0){
      cam_zoom -= 3;
    }
  } else if (code == 189){
    mode = "horizontal"
    cam_zoom += 3;
  //Time warp
  } else if (code == 190){
    rot_mod += 0.002
  } else if (code == 188){
    rot_mod -= 0.002
  }
}

for (var x = 0; x<planets.length; x++){
  scene.add(planets[x].mesh);
}
scene.add(sun);

camera.position.x = 90;
camera.position.z = cam_zoom;
camera.position.y = 90;
camera.rotation.y = 0;
camera.rotation.x = -1.8;
camera.lookAt(0,0,0);


function animate() {
  requestAnimationFrame(animate);

  if (mode=="vertical"){
    var posy = Math.cos(cam_rot_y)*cam_zoom;
    var posz = Math.sin(cam_rot_x)*cam_zoom;
    camera.position.y = posy;
    camera.position.z = posz;
  } else if (mode=="horizontal"){
    var posx = Math.cos(cam_rot_x)*cam_zoom;
    var posz = Math.sin(cam_rot_x)*cam_zoom; 
    camera.position.z = posz;
    camera.position.x = posx;
  }

  console.log(camera.position.x,camera.position.y,camera.position.z)


  for (var x = 0; x<planets.length; x++){
    planets[x].mesh.rotation.y += rot_mod;
  }


  for (var x = 0; x<planets.length; x++){

    var p = planets[x]

    posx = Math.cos(rot*p.speed)*p.dist;
    posz = Math.sin(rot*p.speed)*p.dist;

    
    p.mesh.position.x = posx;

    p.mesh.position.z = posz;
  }


  camera.lookAt(0,0,0)


  renderer.render(scene, camera);

  z_pos = 0;
  x_pos = 0;
  rot+=rot_mod;
};

animate();