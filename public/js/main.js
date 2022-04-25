import * as THREE from '../three/build/three.module.js';
import { FirstPersonControls } from '../three/examples/jsm/controls/FirstPersonControls.js'
import { FontLoader } from '../three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from '../three/examples/jsm/geometries/TextGeometry.js'


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .1, 30000 );
const loader_tex = new THREE.TextureLoader()
const fontLoader = new FontLoader()

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById('container').appendChild( renderer.domElement )

const floor_width = 50
const floor_length = 50

camera.position.z = 20
camera.position.y = 4

const clock = new THREE.Clock()
let controls = new FirstPersonControls( camera, renderer.domElement )
controls.movementSpeed = 10;
controls.lookSpeed = 0.1;

// SUN
const sun = new THREE.DirectionalLight( 0xffffff, 0.5 );
sun.position.z = 0.5
scene.add( sun )

// SPOTLIGHT
const spotLight = new THREE.SpotLight( {color: 0xffffff, intensity: 0.01} );
spotLight.position.set( 2, 10, 2 );

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

scene.add( spotLight );

// ART
fontLoader.load("./three/examples/fonts/helvetiker_regular.typeface.json", function(font) {

	var textGeo = new TextGeometry("ART", {
		font: font,
		size: 2,
		height: 0.05,
		curveSegments: 12,
		bevelThickness: 0.1,
		bevelSize: 0.1,
		bevelEnabled: true

	}).center();

var textMat = new THREE.MeshStandardMaterial( {
				color: 0xffdf00,
				metalness: 0.5,
				roughness: 0,

			} );
    var art = new THREE.Mesh(textGeo, textMat);
		art.position.y = 5
		art.name = "art"
		scene.add(art)
});


// OBELISK
const ob_geometry = new THREE.BoxGeometry(2, 6, 1)
const ob_material = new THREE.MeshStandardMaterial( {color: 'black'} )
const obelisk = new THREE.Mesh (ob_geometry, ob_material)
scene.add(obelisk)



// FLOOR
const floor_box_geometry = new THREE.BoxGeometry(floor_width, 1, floor_length);
const floor_box_material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const floor = new THREE.Mesh( floor_box_geometry, floor_box_material );
floor.position.y = -0.51
scene.add( floor );

const floor_texture = loader_tex.load( './assets/Marble012_1K/Marble012_1K_Color.png')
floor_texture.wrapS = floor_texture.wrapT = THREE.RepeatWrapping;
floor_texture.repeat.set(3, 3);
const floor_normal = loader_tex.load( './assets/Marble012_1K/Marble012_1K_NormalGL.png')
const floor_plane_geometry = new THREE.PlaneGeometry(floor_width, floor_length)
const floor_plane_material = new THREE.MeshStandardMaterial( {map: floor_texture, normalMap: floor_normal})
const floor_plane = new THREE.Mesh(floor_plane_geometry, floor_plane_material)
floor_plane.rotation.x = -Math.PI/2
floor_plane.receiveShadow = true
scene.add( floor_plane )

// SKYBOX
let materialArray = [];
let texture_ft = loader_tex.load( './assets/skybox/arid_ft.jpg');
let texture_bk = loader_tex.load( './assets/skybox/arid_bk.jpg');
let texture_up = loader_tex.load( './assets/skybox/arid_up.jpg');
let texture_dn = loader_tex.load( './assets/skybox/arid_dn.jpg');
let texture_rt = loader_tex.load( './assets/skybox/arid_rt.jpg');
let texture_lf = loader_tex.load( './assets/skybox/arid_lf.jpg');

materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

for (let i = 0; i < 6; i++)
	 materialArray[i].side = THREE.BackSide;
let skyboxGeo = new THREE.BoxGeometry( 10000, 10000, 10000);
let skybox = new THREE.Mesh( skyboxGeo, materialArray );
scene.add( skybox );



animate()

function animate() {
	requestAnimationFrame(animate)

	scene.getObjectByName("art").rotation.y += .01
	spotLight.rotation.x += 2
	controls.update( clock.getDelta() );
	renderer.render(scene, camera)

}
