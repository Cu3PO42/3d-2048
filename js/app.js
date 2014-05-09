(function() {
  define(["cube", "keymap", "three", "stats", "jquery", "underscore"], function(Cube, Keymap, THREE, Stats, $, _) {
    var Game;
    return Game = (function() {
      function Game(options) {
        var light, tmp, _i, _len, _ref;
        options || (options = {});
        _.defaults(options, {
          cameraFocal: 45,
          cameraNear: 1,
          cameraFar: 1000,
          container: "#container",
          cameraPos: [0, 0, 10],
          rotationSpeed: 3,
          rotateEndX: 0.5,
          rotateEndY: 0.3,
          lights: [
            {
              pos: [0, -5, 10],
              color: 0xff,
              intensity: 0.2
            }, {
              pos: [0, 5, 10],
              color: 0xffff00,
              intensity: 0.2
            }
          ]
        });
        this.options = options;
        this.container = $(options.container);
        $("#gameover").hide();
        this.scene = new THREE.Scene();
        this.stats = new Stats();
        this.clock = new THREE.Clock();
        this.renderer = new THREE.WebGLRenderer({
          alpha: true
        });
        this.container.append(this.renderer.domElement);
        this.camera = new THREE.PerspectiveCamera(options.cameraFocal, 1, options.cameraNear, options.cameraFar);
        this.camera.position.set.apply(this.camera.position, options.cameraPos);
        this.scene.add(this.camera);
        _ref = options.lights;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          light = _ref[_i];
          tmp = new THREE.DirectionalLight(light.color, light.intensity);
          tmp.position.set.apply(tmp.position, light.pos);
          this.scene.add(tmp);
        }
        this.scene.add(new THREE.AmbientLight(0xaaaaaa));
        $(window).on("resize", (function(_this) {
          return function() {
            _this.camera.aspect = _this.container.width() / _this.container.height();
            _this.renderer.setSize(_this.container.width(), _this.container.height());
            return _this.camera.updateProjectionMatrix();
          };
        })(this));
        $(window).trigger("resize");
        this.cube = new Cube({
          cameraPos: this.camera.position,
          camera: this.camera
        });
        window.cube = this.cube;
        this.scene.add(this.cube.mainScene);
      }

      Game.prototype.loop = function() {
        var delta, down, gameover, left, right, rotateX, rotateY, up;
        this.stats.begin();
        delta = this.clock.getDelta();
        gameover = this.cube.gameover;
        if (gameover) {
          rotateX = this.options.rotateEndX * delta;
          rotateY = this.options.rotateEndY * delta;
        } else {
          down = Keymap.isPressed("DOWN") || Keymap.isPressed("S");
          up = Keymap.isPressed("UP") || Keymap.isPressed("W");
          left = Keymap.isPressed("LEFT") || Keymap.isPressed("A");
          right = Keymap.isPressed("RIGHT") || Keymap.isPressed("D");
          rotateX = this.options.rotationSpeed * delta * (down - up);
          rotateY = this.options.rotationSpeed * delta * (left - right);
        }
        this.cube.rotate(rotateX, rotateY);
        this.cube.highlightCube();
        this.renderer.render(this.scene, this.camera);
        this.stats.end();
        return requestAnimationFrame((function(_this) {
          return function() {
            return _this.loop();
          };
        })(this));
      };

      return Game;

    })();
  });

}).call(this);
