var KEYS = {
    W : 87,
    A : 65,
    S : 83,
    D : 68,
    Q : 81,
    E : 69,
    SPACE : 32,
    SHIFT : 16
};

var container = document.getElementById("container");
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
var clock = new THREE.Clock();
var keys = {};
var mouse = new Mouse();
var stats = new Stats();
var states = [];

function initialize() {
    container.addEventListener("mousedown",onMouseDown,false);
    container.addEventListener("mousemove",onMouseMove,false);
    container.addEventListener("mouseup",onMouseUp,false);
    window.addEventListener("resize",updateSize,false);
    window.addEventListener("keydown",onKeyDown,false);
    window.addEventListener("keyup",onKeyUp,false);
    container.appendChild(renderer.domElement);
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);
    updateSize();
    attach(new InitState());
    loop();
}

function attach(state) {
    states.push(state);
    state.begin();
}

function detach(state) {
    var index = states.indexOf(state);
    array.splice(index,1);
    state.end();
}

function update() {
    stats.begin();
    var delta = clock.getDelta();
    var speed = 9;
    var turn_speed = 3;
    if(isPressed(KEYS.W)) {
        camera.translateZ(-delta * speed);
    }
    if(isPressed(KEYS.S)) {
        camera.translateZ(delta * speed);
    }
    if(isPressed(KEYS.A)) {
        camera.translateX(-delta * speed);
    }
    if(isPressed(KEYS.D)) {
        camera.translateX(delta * speed);
    }
    if(isPressed(KEYS.SHIFT)) {
        camera.translateY(-delta * speed);
    }
    if(isPressed(KEYS.SPACE)) {
        camera.translateY(delta * speed);
    }
    if(isPressed(KEYS.Q)) {
        camera.rotateY(-delta * turn_speed);
    }
    if(isPressed(KEYS.E)) {
        camera.rotateY(delta * turn_speed);
    }
    for(var i in states) {
        states[i].update(delta);
    }
    renderer.render(scene,camera);
    mouse.resetMotion();
    stats.end();
}

function Entity(geometry,material) {
    THREE.Mesh.call(this, geometry, material);
}

Entity.prototype = Object.create(THREE.Mesh.prototype);

function CubeEntity(x,y,z,c) {
    var geom = new THREE.BoxGeometry(1,1,1);
    var mat = new THREE.MeshBasicMaterial({color:c});
    Entity.call(this,geom,mat);
    this.translateX(x);
    this.translateY(y);
    this.translateZ(z);
}

CubeEntity.prototype = Object.create(Entity.prototype);

function GameState() {}
GameState.prototype.begin = function() {};
GameState.prototype.end = function() {};
GameState.prototype.update = function(delta) {};

function isPressed(keyCode) {
    return keys[keyCode] == true;
}

function onKeyDown(event) {
    if(keys[event.keyCode] != true) {
        console.log("Pressed "+event.keyCode);
        keys[event.keyCode] = true;
    }
}

function onKeyUp(event) {
    keys[event.keyCode] = false;
}

function onMouseMove(event) {
    mouse.moveTo(event.clientX,event.clientY);
}

function onMouseDown(event) {
    mouse.buttons[event.button] = true;
}

function onMouseUp(event) {
    mouse.buttons[event.button] = false;
}

function Mouse() {
    this.relX = 0;
    this.relY = 0;
    this.buttons = {};
    this.motionX = 0;
    this.motionY = 0;
}

Mouse.prototype.moveTo = function(x,y) {
    var rx = x / container.offsetWidth;
    var ry = y / container.offsetHeight;
    this.motionX += rx - this.relX;
    this.motionY += ry - this.relY;
    this.relX = rx;
    this.relY = ry;
}

Mouse.prototype.resetPosition = function(x,y) {
    this.relX = x;
    this.relY = y;
    this.resetMotion();
}

Mouse.prototype.isPressed = function(button) {
    return mouse.buttons[button] == true;
}

Mouse.prototype.resetMotion = function() {
    this.motionX = 0;
    this.motionY = 0;
}

function updateSize() {
    renderer.setSize(container.offsetWidth , container.offsetHeight);
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
}

function InitState() {
    GameState.call(this);
    this.cube = new Cube2048();
    //this.w = 50;
    //this.h = 50;
    //this.c = new Array(this.w*this.h);
    //this.p = 0;
    //this.s = new THREE.Scene();
}

InitState.prototye = Object.create(GameState.prototype);

function randomColor() {
    return Math.round(Math.random() * 0xFFFFFF);
}

InitState.prototype.begin = function()  {
    /*camera.position.z = -5;
    camera.lookAt(new THREE.Vector3(0,0,0));
    //var text = new THREE.TextGeometry("Hello",{size:2,height:1,curveSegments:2,font:"helvetiker"});
    //var text_mesh = new THREE.Mesh(text,new THREE.MeshBasicMaterial({color:0xFFFFFF}));
    //scene.add(text_mesh);
    for(var x=0;x < this.w;x++) {
        for(var y=0; y < this.h; y++) {
            var cube = new CubeEntity(x * 2 - this.w,y * 2 - this.h,0,this.randomColor())
            this.c[x + y * this.w] = cube;
            this.s.add(cube);
        }
    }
    var light = new THREE.DirectionalLight(0xffffff,3);
    light.position.set(50,50,-2);
    light.target = this.c[0];
    var ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);
    scene.add(light);
    scene.add(this.s);
    this.p = 0;
    mouse.resetPosition(0.5,0.5);
    */
    scene.add(this.cube);
};

InitState.prototype.end = function() {

};

InitState.prototype.update = function(delta) {
    /*this.p += delta;
    if(this.p >= 1) {
        this.p %= 1;
        for(var i in this.c) {
            this.c[i].material.setValues({color:this.randomColor()});
        }
    }
    var speed = 4;
    for(var i in this.c) {
        var r = Math.random() * 3;
        if(r < 1) {
            this.c[i].rotateX(speed * delta);
        } else if(r < 2) {
            this.c[i].rotateY(speed * delta);
        } else {
            this.c[i].rotateZ(speed * delta);
        }
    }
    */
};

function Cube2048() {
    THREE.Scene.call(this);
    for(var x=0;x < 4; x++) {
        for(var y=0; y < 4; y++) {
            for(var z=0; z < 4; z++) {
                if(x == 0 || y == 0 || x == 3 || y == 3 || z == 0 || z == 3) {
                    var cube = new CubeEntity(x-1.5,y-1.5,z-1.5,randomColor());
                    this.add(cube);
                }
            }
        }
    }
}

Cube2048.prototype = Object.create(THREE.Scene.prototype);



function loop() {
    update();
    requestAnimationFrame(loop);
}

$(document).ready(
    function() {
        initialize();
    }
);

