//Basics

var p_data = [["Earth",1,[7,30,30],'#33ba2f',true,51],["Mars",1.5,[6,30,30],'#ffa500',true,52],["Venus",0.7,[7,30,30],'#a8161d',false,50],["Mercury",0.4,[6,30,30],'#ffffff',true,49],["Jupiter",5.2,[13,30,30],'#a81100',true,53],["Saturn",9.5,[11,30,30],'#ffffff',true,54],["Uranus",19.8,[8,30,30],'#0000af',true,55],["Neptune",30,[8,30,30],'#0000aa',false,56]];


const center = (0,0,0);
var z_pos = 0;
var x_pos = 0;
var rad = 20;
var rot = 10;
var rot_mod = 0.004;
var planets = [];
var keys_to_names = {};
var cam_zoom = 50;
var cam_rot_y = 0;
var cam_rot_x = 0;
var mode = 'horizontal';
var lookat_radius = 0;
var lookat_angle = -90;
var x_lookat = Math.sin(lookat_angle)*lookat_radius;
var z_lookat = Math.cos(lookat_angle)*lookat_radius;
var zoomed = false;
var lookingat = true; //true = sun, null = free. otherwise its a planet object.
//modifiers
var dist_mod = 100;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(x_lookat,0,z_lookat);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canv").appendChild(renderer.domElement);

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
const boxText = terrain.load("img/night_text.png");
const box2Text = terrain.load("img/night_text_2.jpeg");


class Planet{
  constructor(name,dist,size,colour,norm=true){
    this.name = name;
    this.dist = dist * dist_mod;
    this.size = size;
    this.colour = colour;
    this.norm = norm;
    
    if (this.norm == true){
      this.speed = 1/dist;
    } else {
      this.speed = -1/dist;
    }
    
    this.geo = new THREE.SphereGeometry(this.size[0],this.size[1],this.size[2]);
    this.traj = new THREE.RingGeometry(this.dist,this.dist+1,3000);

    if (this.name == "Earth"){
      this.material = new THREE.MeshBasicMaterial({map: earth});   
    } else if (this.name == "Mars"){
      this.material = new THREE.MeshBasicMaterial({map: mars});
    } else if (this.name == "Mercury"){
      this.material = new THREE.MeshBasicMaterial({map: mercury});
    } else if (this.name == "Venus"){
      this.material = new THREE.MeshBasicMaterial({map: venus});
    } else if (this.name == "Jupiter"){
      this.material = new THREE.MeshBasicMaterial({map: jupiter});
    } else if (this.name == "Saturn"){
      this.material = new THREE.MeshBasicMaterial({map: saturn});
    } else if (this.name == "Uranus"){
      this.material = new THREE.MeshBasicMaterial({map: uranus});
    } else if (this.name == "Neptune"){
      this.material = new THREE.MeshBasicMaterial({map: neptune});
    } else {
      this.material = new THREE.MeshBasicMaterial({color: this.colour});   
    }
    
    this.mesh = new THREE.Mesh(this.geo,this.material);
    this.trmesh = new THREE.Mesh(this.traj,this.material);
    this.trmesh.material.side = THREE.DoubleSide;
    this.trmesh.rotateX(90*(Math.PI/180));
  }
}    

for (var x = 0; x<p_data.length; x++){
  planets.push(new Planet(p_data[x][0],p_data[x][1],p_data[x][2],p_data[x][3],p_data[x][4]));
  keys_to_names[p_data[x][5]] = p_data[x][0];
}


function lookatPlanet(name){
  lookingat = name;
  for (var x = 0; x<planets.length; x++){
    if (planets[x].name == name){
      selectedInfo(planets[x]);
      break;
    }
  }
}

const sunGeo = new THREE.SphereGeometry(21,30,30);
const sunMaterial = new THREE.MeshBasicMaterial({map: sunText});
const sun = new THREE.Mesh(sunGeo,sunMaterial);

const skybox = new THREE.SphereGeometry(500,50,50);
const box_matt = new THREE.MeshBasicMaterial({map:boxText, transparent: true, opacity:0.5});

const box = new THREE.Mesh(skybox,box_matt);
box.material.side = THREE.DoubleSide;
box.rotation.y = Math.floor(Math.random()*6+0.13);

const skybox2 = new THREE.SphereGeometry(570,50,50);
const box2_matt = new THREE.MeshBasicMaterial({map:box2Text});

const box2 = new THREE.Mesh(skybox2,box2_matt);
box2.material.side = THREE.DoubleSide;
box2.rotation.y = Math.floor(Math.random()*6+0.13);

document.addEventListener("keydown",onPress,false);
document.addEventListener("wheel",onScroll);

document.getElementById("time warp").innerHTML = "Time Warp: "+String(rot_mod*250);
document.getElementById("zoom").innerHTML = "Distance: "+String(Math.abs(Math.round(cam_zoom)));

function selectedInfo(p){
  document.getElementById("selectedinfo").style.display = "block";
  document.getElementById("name").innerHTML = String(p.name);
  document.getElementById("size").innerHTML = "size: "+String(p.size);
  document.getElementById("distance").innerHTML = "distance: "+String(p.dist/100)+" AU";
  if (p.colour){
  document.getElementById('selectedinfo').style.backgroundColor = p.colour;
  } else {
    document.getElementById('selectedinfo').style.backgroundColor = "#cbaef9";
  }
}

function onPress(event){
  var code = event.which;
  //Orbiting
  if (code == 38){
    cam_rot_y -= 0.02;
    mode="vertical";
  } else if (code == 40){
    cam_rot_y += 0.02;
    mode="vertical";
  } else if (code == 37){
    cam_rot_x -= 0.02;
    mode = "horizontal";
  } else if (code == 39){
    cam_rot_x += 0.02;
    mode = "horizontal";
  //Zoom
  } else if (code == 187){  //we need to fix reverse zooming and only zooming out
    mode = "horizontal";
    if (cam_zoom > 0){
      cam_zoom -= (3+cam_zoom/100);
      zoomed = true;
    }
    if (cam_zoom < -3700){
      cam_zoom = -3700;
    }
    document.getElementById("zoom").innerHTML = "Distance: "+String(Math.abs(Math.round(cam_zoom)));
  } else if (code == 189){
    mode = "horizontal";
    cam_zoom += (3+cam_zoom/100);
    zoomed = true;
    if (cam_zoom > 3700){
      cam_zoom = 3700;
    }
    document.getElementById("zoom").innerHTML = "Distance: "+String(Math.abs(Math.round(cam_zoom)));
  //Time warp
  } else if (code == 190){
    rot_mod += 0.002;
    document.getElementById("time warp").innerHTML = "Time Warp: "+String(rot_mod*250);
  } else if (code == 188){
    rot_mod -= 0.002;
    document.getElementById("time warp").innerHTML = "Time Warp: "+String(rot_mod*250);
  //Changing direction
  } else if (lookingat == null){
      if (code == 87){
      lookat_radius += 4;
      x_lookat = (Math.sin(lookat_angle)*lookat_radius);
      z_lookat = (Math.cos(lookat_angle)*lookat_radius);
    } else if (code == 83){
      lookat_radius -= 4;
      x_lookat = (Math.sin(lookat_angle)*lookat_radius);
      z_lookat = (Math.cos(lookat_angle)*lookat_radius);
    } else if (code == 68){
      lookat_angle = (lookat_angle-0.07)%360;
      x_lookat = (Math.sin(lookat_angle)*lookat_radius);
      z_lookat = (Math.cos(lookat_angle)*lookat_radius);
    } else if (code == 65){
      lookat_angle = (lookat_angle+0.07)%360;
      x_lookat = (Math.sin(lookat_angle)*lookat_radius);
      z_lookat = (Math.cos(lookat_angle)*lookat_radius);
    }
  //Lookat objects
  } if (code == 81){
    z_lookat = 0;
    x_lookat = 0;
    lookat_angle = 0;
    lookat_radius = 0;
  } else if (code == 96 | code == 48){
    lookingat = true;
    z_lookat = 0;
    x_lookat = 0;
  } else if (code == 70){
    lookingat = null;
    x_lookat = (Math.sin(lookat_angle)*lookat_radius);
    z_lookat = (Math.cos(lookat_angle)*lookat_radius);
  } else if (code == 82){
    cam_zoom = 50;
    document.getElementById("zoom").innerHTML = "Distance: "+String(Math.abs(Math.round(cam_zoom)));
  } else if (code == 191){
    rot_mod = 0.004;
    document.getElementById("time warp").innerHTML = "Time Warp: "+String(rot_mod*250);
  } else if (code in keys_to_names) {
      lookatPlanet(keys_to_names[code]);
  }
}

document.getElementById("canv").addEventListener("click",onClick)
const caster = new THREE.Raycaster();
const vector = new THREE.Vector2();

function onClick(e){
  vector.x = (e.clientX/window.innerWidth)*2-1;
  vector.y = - (e.clientY/window.innerHeight)*2+1.5;

  caster.setFromCamera(vector,camera);

  var inter = caster.intersectObjects(scene.children);

  document.getElementById("selectedinfo").style.display = "none";
  
  for (let i = 0; i < inter.length; i ++) {
		
    var obj = inter[i].object.material.map;


    for (var x = 0; x<planets.length; x++){
      if (planets[x].material.map == obj){
        selectedInfo(planets[x]);
      } 
    }
	}
} 


function onScroll(e){
  mode = "horizontal";
  cam_zoom += e.deltaY/10+(cam_zoom/100);
  if (cam_zoom < -3700){
      cam_zoom = -3700;
  } else if (cam_zoom > 3700){
      cam_zoom = 3700;
  }
  document.getElementById("zoom").innerHTML = "Distance: "+String(Math.abs(Math.round(cam_zoom)));
}


for (var x = 0; x<planets.length; x++){
  scene.add(planets[x].mesh);
  scene.add(planets[x].trmesh);
}
scene.add(sun);
scene.add(box);
scene.add(box2);


camera.position.x = 90;
camera.position.z = cam_zoom;
camera.position.y = 90;
camera.rotation.y = 0;
camera.rotation.x = -1.8;
camera.lookAt(x_lookat,0,z_lookat);



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


  for (var x = 0; x<planets.length; x++){
    planets[x].mesh.rotation.y += rot_mod;
  }


  for (var x = 0; x<planets.length; x++){

    var p = planets[x];

    posx = Math.cos(rot*p.speed)*p.dist;
    posz = Math.sin(rot*p.speed)*p.dist;
    
    p.mesh.position.x = posx;

    p.mesh.position.z = posz;

    if (lookingat == p.name){
      x_lookat = posx*0.75;
      z_lookat = posz*0.75;
    }
  }

  box.position.x = camera.position.x*0.95;
  box.position.y = camera.position.y*0.95;
  box.position.z = camera.position.z*0.95;

  box2.position.x = camera.position.x*0.885;
  box2.position.y = camera.position.y*0.885;
  box2.position.z = camera.position.z*0.885;

  if (lookingat){
    camera.lookAt(x_lookat,0,z_lookat);
  } else {
    camera.lookAt(camera.position.x+x_lookat,0,camera.position.z+z_lookat)
  }

  renderer.render(scene, camera);

  if (zoomed == false){
    camera.fov = 75
    camera.updateProjectionMatrix();
  }

  zoomed = false;

  z_pos = 0;
  x_pos = 0;
  rot+=rot_mod;
};

animate();