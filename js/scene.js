'use strict';

/*global THREE*/
var camera, scene, renderer;

var chair;

var flag = false;

var time_stamp = Date.now();

var bbox;

var sceneWidth, sceneHeight;


function Table(x, y, z) {

	this.object = new THREE.Object3D();

	this.material = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true});

	this.object.position.set(x, y, z);

	this.addTableLeg = function(table, x, y, z) {

		let geometry = new THREE.CylinderGeometry( 3, 3, 10, 12);

		let	mesh = new THREE.Mesh(geometry, table.material);

		mesh.position.set(x, y-5, z);

		table.object.add(mesh);

	};

	this.addTableTop = function(table, x, y, z) {

		let geometry = new THREE.CubeGeometry(60, 2, 20);

		let mesh = new THREE.Mesh(geometry, table.material);

		mesh.position.set(x, y, z);

		table.object.add(mesh);

	};

	this.addTableTop(this, 0, 0, 0);

	this.addTableLeg(this, -23, -1, -6);

	this.addTableLeg(this, -23, -1, 6);

	this.addTableLeg(this, 23, -1, 6);

	this.addTableLeg(this, 23, -1, -6);

	scene.add(this.object);

}





function Lamp(x, y, z) {

	this.object = new THREE.Object3D();

	this.material = new THREE.MeshBasicMaterial( {color: 0x0000ff, wireframe: true});

	this.object.position.set(x, y, z);

	this.addLampPost = function(lamp, x, y, z) {

		let geometry = new THREE.CylinderGeometry( 1, 1, 30, 12);

		let mesh = new THREE.Mesh(geometry, lamp.material);

		mesh.position.set(x, y + 4, z);

		lamp.object.add(mesh);
	};

	this.addLampBulb = function(lamp, x, y, z) {

		let geometry = new THREE.SphereGeometry(4, 12, 12);

		let mesh = new THREE.Mesh(geometry, lamp.material);

		mesh.position.set(x, y, z);

		lamp.object.add(mesh);

	};

	this.addLampCone = function(lamp, x, y, z) {


		let geometry = new THREE.ConeGeometry(9,12, 25);

		let mesh = new THREE.Mesh(geometry, lamp.material);

		mesh.position.set(x, y + 2, z);

		lamp.object.add(mesh);

	};


	this.addLampBase = function (lamp, x, y, z ){

	let geometry = new THREE.CylinderGeometry( 5, 5, 2, 30);

	let mesh = new THREE.Mesh(geometry, lamp.material);

	mesh.position.set(x, y - 10, z);


	lamp.object.add(mesh);

	};


	this.addLampPost(this, 0, 0, 0);

	this.addLampBulb(this, 0, 23, 0);

	this.addLampCone(this, 0, 23, 0);

	this.addLampBase(this, 0, 0, 0);

	scene.add(this.object);

}






function Chair(x, y, z) {

	this.object = new THREE.Object3D();

	this.material = new THREE.MeshBasicMaterial( {color: 0xff0000, wireframe: true});

	this.object.position.set(x, y, z);

	this.wheelWrapper = new THREE.Object3D();

	this.wheelWrapper.scale.x = 5;

	this.object.add(this.wheelWrapper);

	this.wheelWrapper.position.set(0, -7, 0);

	this.v_z = 0;

	this.ac_z = 0;

	this.stopping = false;

	this.rotate_direction = 0;

	this.moveChair = function(delta_t) {

		let delta_z = this.v_z*delta_t  + 0.5*this.ac_z*(delta_t**2);

		this.object.rotateY(((2*Math.PI)/3000)*delta_t*this.rotate_direction);

		this.object.translateZ(delta_z);

		for (var i = 0; i < 4; i++)
			this.wheelWrapper.children[i].rotateX(delta_z / Math.PI);

		this.v_z = this.v_z + this.ac_z* delta_t;

		if (this.stopping  && (this.v_z * this.ac_z > 0)) {
			this.v_z = 0;

			this.ac_z = 0;

			this.stopping = false;
		}

	};


	this.addChairSupport = function(chair, x, y, z, theta) {

		let geometry = new THREE.CubeGeometry(10, 1, 12);

		geometry.rotateX(theta);

		let mesh = new THREE.Mesh(geometry, chair.material);

		mesh.position.set(x, y, z);

		chair.object.add(mesh);
	};


	this.addChairBase = function(chair, x, y, z) {

		let geometry = new THREE.CubeGeometry(1, 6, 1);

		let mesh = new THREE.Mesh(geometry, chair.material);

		mesh.position.set(x, y, z);

		chair.object.add(mesh);

	};


	this.addChairLegs = function(chair, x, y, z, theta) {


		let geometry = new THREE.CubeGeometry(12, 1, 1);

		geometry.rotateY(theta);

		let mesh = new THREE.Mesh(geometry, chair.material);

		mesh.position.set(x, y, z);

		chair.object.add(mesh);

	};

	this.addChairWheel = function(chair, x, y, z) {

		let geometry = new THREE.TorusGeometry(0.8, 0.2, 20, 60);

		geometry.rotateY(Math.PI/2);

		let mesh = new THREE.Mesh(geometry, chair.material);

		mesh.position.set(x, y, z);

		chair.wheelWrapper.add(mesh);

	};

	this.addChairSupport(this, 0 , 0 , 0, 0);

	this.addChairSupport(this, 0, 5.5, -5.5, Math.PI/2);

	this.addChairBase(this, 0, -3, 0 );

	this.addChairLegs(this,0, -6.5, 0, 0);

	this.addChairLegs(this, 0, -6.5, 0, Math.PI/2);

	this.addChairWheel(this, 0, -1, 5);

	this.addChairWheel(this, 0, -1, -5);

	this.addChairWheel(this, -1, -1, 0);

	this.addChairWheel(this, 1, -1, 0);

	scene.add(this.object);



}

/*executa quando fazemos resize da janela*/
function onResize() {
	'use strict';
	/*atualiza o renderer para o tamanho novo da janela*/
	renderer.setSize(window.innerWidth, window.innerHeight);


	bbox = new THREE.Box3().setFromObject(scene);/*bbox da cena*/

	if(camera.position.y != 0) {
	sceneWidth = (bbox.max.x - bbox.min.x);

	sceneHeight = (bbox.max.z - bbox.min.z);

	camera.near = 0;

	camera.far = 80;
	}

	else if(camera.position.x != 0) {
		sceneWidth = (bbox.max.z - bbox.min.z);

		sceneHeight = (bbox.max.y - bbox.min.y);

		camera.far =  camera.position.x - bbox.min.x;

		camera.near = camera.position.x -bbox.max.x;

	}

	else if(camera.position.z != 0 ) {
		sceneWidth = (bbox.max.x - bbox.min.x);

		sceneHeight = (bbox.max.y - bbox.min.y);

		camera.far =  camera.position.z - bbox.min.z;

		camera.near = camera.position.z -bbox.max.z;
	}

	let ratio = Math.min(window.innerWidth/ sceneWidth, window.innerHeight / sceneHeight);

	camera.top = window.innerHeight / ratio;
	camera.right = window.innerWidth / ratio;

	camera.bottom = -camera.top;
	camera.left = -camera.right;
	camera.updateProjectionMatrix();

}

function onKeyUp(e) {
	'use strict';
	switch (e.keyCode) {
		case 38:
		case 40:
			if (chair.v_z < 0)
				chair.ac_z = 0.00001;
			if(chair.v_z > 0)
				chair.ac_z = -0.00001;
				chair.stopping = true;
		break;


		case 37:
		case 39:
			chair.rotate_direction = 0;
			break;
	}
}

/*le do teclado (evento e)*/
function onKeyDown(e) {
	'use strict';


	switch(e.keyCode) {
		case 65: //A
		case 97: //a
			/*caso a tecla a seja premida desligamos os wireframes ou ligamos
			dependendo*/
			scene.traverse(function (node) {
				if (node instanceof THREE.Mesh) {

						node.material.wireframe = flag;

				}
			});
			flag = !flag;

			break;

		case 49://1

			camera.position.x = 50;
			camera.position.y = 0;
			camera.position.z = 0;
			onResize();
			camera.lookAt(scene.position);
			break;

		case 50://2
			camera.position.x = 0;
			camera.position.y = 0;
			camera.position.z = 50;
			onResize();
			camera.lookAt(scene.position);
			break;

		case 51://3
			camera.position.x = 0;
			camera.position.y = 50;
			camera.position.z = 0;
			onResize();
			camera.lookAt(scene.position);
			break;

		case 39: // tecla direita
		  	chair.rotate_direction = -1;
		  	break;

		case 37: // tecla esquerda

			chair.rotate_direction = 1;
			break;

		case 38:
			chair.ac_z = -0.00001;
			chair.stopping = false;
			break;

		case 40:
			chair.ac_z = 	0.00001;
			chair.stopping = false;
			break;
	}
}


function createCamera() {

	/*camera inicia com vista de topo*/

	bbox = new THREE.Box3().setFromObject(scene);/*bounding box da cena*/

	/*tamanho da cena*/
	sceneWidth = (bbox.max.x - bbox.min.x);

	sceneHeight = (bbox.max.z - bbox.min.z);

	/*para manter a cena na camera sempre*/
	let ratio = Math.min(window.innerWidth/ sceneWidth, window.innerHeight / sceneHeight);

	camera = new THREE.OrthographicCamera( 100); /*inicializa camera com near de 0.1 e far de 2000*/

	/*garante o ratio da janela e o mesmo da cena*/
	camera.top = window.innerHeight / ratio;
	camera.right = window.innerWidth / ratio;

	camera.bottom = -camera.top;
	camera.left = -camera.right;

	/*definir posicao da camera*/
	camera.position.x = 0;

	camera.position.y = 50;

	camera.position.z = 0;

	/*apontar camera*/
	camera.lookAt(scene.position);

}

function createScene() {

	scene = new THREE.Scene();

	/*adiciona eixos a camera*/
	scene.add(new THREE.AxesHelper(10));
}


function init() {

	renderer = new THREE.WebGLRenderer({antialias:true});

	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	createScene();

	createCamera();

	new Table(0, 0, 0);

	new Lamp(-50, 0, 0);

	chair = new Chair(0, -2, -25);

	onResize();

	render();

	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);

}


function render() {
	renderer.render(scene, camera);
}


function animate() {

	var frameTime = Date.now() - time_stamp;

	time_stamp = Date.now();

	chair.moveChair(frameTime);
	onResize();

	render();

	requestAnimationFrame(animate);


}
