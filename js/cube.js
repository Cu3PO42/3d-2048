(function() {
  define(["text_renderer", "three", "underscore", "jquery"], function(renderText, THREE, _, $) {
    var Cube;
    return Cube = (function() {
      function Cube(options) {
        var color, cube, cubeGeometry, cubeMaterialDefault, cubeMaterials, cubeSize, i, j, k, last_1d, last_2d, mousePos, num, number, numberGeometry, origin, planeGeometry, planeMap, planeMaterial, planeScene, planes, tmp, _i, _j, _k, _l, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
        options || (options = {});
        _.defaults(options, {
          size: 4,
          cubeSize: 1,
          numberSize: 0.8,
          cubeSpacing: 0.2,
          color: 0x87cefa,
          opacity: 0.2,
          opacityEmpty: 0.05,
          opacityHighlight: 0.5,
          cameraPos: new THREE.Vector3(-10, 0, 0),
          colors: {
            "2": 0xE8BF19,
            "4": 0xE68A2E,
            "8": 0xA34242,
            "16": 0xE62E00,
            "32": 0xB82E00,
            "64": 0xE60000,
            "128": 0x00FF00,
            "256": 0x00A300,
            "512": 0x00B85C,
            "1024": 0x009999,
            "2048": 0x990099,
            "4096": 0xFFFFFF
          }
        });
        this.score = 0;
        this.options = options;
        this.state = [];
        this.gameover = false;
        for (i = _i = 1, _ref = options.size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
          this.state.push([]);
          last_1d = this.state[this.state.length - 1];
          for (j = _j = 1, _ref1 = options.size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
            last_1d.push([]);
            last_2d = last_1d[last_1d.length - 1];
            for (k = _k = 1, _ref2 = options.size; 1 <= _ref2 ? _k <= _ref2 : _k >= _ref2; k = 1 <= _ref2 ? ++_k : --_k) {
              last_2d.push(0);
            }
          }
        }
        this.mainScene = new THREE.Scene();
        this.mainScene.matrixAutoUpdate = true;
        this.numbers = [];
        numberGeometry = new THREE.PlaneGeometry(options.numberSize, options.numberSize);
        cubeGeometry = new THREE.BoxGeometry(options.cubeSize, options.cubeSize, options.cubeSize);
        cubeMaterials = {
          "0": new THREE.MeshPhongMaterial({
            color: options.color,
            opacity: options.opacityEmpty,
            transparent: true
          })
        };
        _ref3 = options.colors;
        for (num in _ref3) {
          color = _ref3[num];
          cubeMaterials[num] = new THREE.MeshPhongMaterial({
            color: color,
            opacity: options.opacity,
            transparent: true
          });
        }
        cubeMaterialDefault = new THREE.MeshPhongMaterial({
          color: options.color,
          opacity: options.opacity,
          transparent: true
        });
        this.getCubeMaterials = function(num) {
          return cubeMaterials[num] || cubeMaterialDefault;
        };
        this.numberMaterials = (function() {
          var cache, clearMaterial;
          cache = {};
          clearMaterial = new THREE.MeshPhongMaterial({
            map: renderText(0),
            transparent: true,
            opacity: 0,
            color: 0
          });
          return {
            get: function(num) {
              var colorCode, material, texture;
              if (!num) {
                return clearMaterial;
              }
              num = "" + num;
              if (num in cache) {
                return cache[num];
              }
              colorCode = options.colors[num].toString(16);
              while (colorCode.length < 6) {
                colorCode = "0" + colorCode;
              }
              texture = renderText(num, {
                color: "#" + colorCode
              });
              material = new THREE.MeshPhongMaterial({
                map: texture,
                alphaTest: 0.5,
                color: 0xffffff,
                useScreenCoordinates: true
              });
              cache[num] = material;
              return material;
            }
          };
        })();
        this.cubes = [];
        for (i = _l = 0, _ref4 = options.size; 0 <= _ref4 ? _l < _ref4 : _l > _ref4; i = 0 <= _ref4 ? ++_l : --_l) {
          for (j = _m = 0, _ref5 = options.size; 0 <= _ref5 ? _m < _ref5 : _m > _ref5; j = 0 <= _ref5 ? ++_m : --_m) {
            for (k = _n = 0, _ref6 = options.size; 0 <= _ref6 ? _n < _ref6 : _n > _ref6; k = 0 <= _ref6 ? ++_n : --_n) {
              cube = new THREE.Mesh(cubeGeometry, this.getCubeMaterials(0));
              cube.position.set((i - 1.5) * (options.cubeSize + options.cubeSpacing), (j - 1.5) * (options.cubeSize + options.cubeSpacing), (k - 1.5) * (options.cubeSize + options.cubeSpacing));
              number = new THREE.Mesh(numberGeometry, this.numberMaterials.get(0));
              number.lookAt(options.cameraPos);
              cube.add(number);
              this.cubes.push(cube);
              this.numbers.push(number);
              this.mainScene.add(cube);
            }
          }
        }
        cubeSize = options.size * options.cubeSize + (options.size - 1) * options.cubeSpacing;
        planeGeometry = new THREE.PlaneGeometry(cubeSize, cubeSize);
        planeMaterial = new THREE.MeshBasicMaterial({
          alphaTest: 0.5,
          opacity: 0,
          side: THREE.BackSide,
          color: 0
        });
        origin = new THREE.Vector3(0, 0, 0);
        planeScene = new THREE.Scene();
        this.mainScene.add(planeScene);
        planes = [];
        planeMap = {};
        tmp = new THREE.Mesh(planeGeometry, planeMaterial);
        tmp.position.set(0, 0, cubeSize / 2);
        tmp.lookAt(origin);
        planeMap[tmp.uuid] = 0;
        planes.push(tmp);
        planeScene.add(tmp);
        tmp = new THREE.Mesh(planeGeometry, planeMaterial);
        tmp.position.set(0, 0, -cubeSize / 2);
        tmp.lookAt(origin);
        planeMap[tmp.uuid] = 1;
        planes.push(tmp);
        planeScene.add(tmp);
        tmp = new THREE.Mesh(planeGeometry, planeMaterial);
        tmp.position.set(0, cubeSize / 2, 0);
        tmp.lookAt(origin);
        planeMap[tmp.uuid] = 2;
        planes.push(tmp);
        planeScene.add(tmp);
        tmp = new THREE.Mesh(planeGeometry, planeMaterial);
        tmp.position.set(0, -cubeSize / 2, 0);
        tmp.lookAt(origin);
        planeMap[tmp.uuid] = 3;
        planes.push(tmp);
        planeScene.add(tmp);
        tmp = new THREE.Mesh(planeGeometry, planeMaterial);
        tmp.position.set(cubeSize / 2, 0, 0);
        tmp.lookAt(origin);
        planeMap[tmp.uuid] = 4;
        planes.push(tmp);
        planeScene.add(tmp);
        tmp = new THREE.Mesh(planeGeometry, planeMaterial);
        tmp.position.set(-cubeSize / 2, 0, 0);
        planeMap[tmp.uuid] = 5;
        tmp.lookAt(origin);
        planes.push(tmp);
        planeScene.add(tmp);
        this.addNumber();
        this.addNumber();
        this.addNumber();
        this.addNumber();
        this.projector = new THREE.Projector();
        this.prevMaterial = this.getCubeMaterials(0);
        this.prevOpacity = options.opacityEmpty;
        this.mousePos = {
          x: 0,
          y: 0
        };
        mousePos = this.mousePos;
        $(document).on("mousedown", (function(_this) {
          return function(e) {
            var dir, intersects, raycaster, vector;
            vector = new THREE.Vector3((e.pageX / window.innerWidth) * 2 - 1, -(e.pageY / window.innerHeight) * 2 + 1, 0.5);
            _this.projector.unprojectVector(vector, options.camera);
            raycaster = new THREE.Raycaster(options.cameraPos, vector.sub(options.cameraPos).normalize());
            intersects = raycaster.intersectObjects(planes);
            if (intersects.length) {
              dir = planeMap[intersects[0].object.uuid];
              if (e.which === 3) {
                dir ^= 1;
              }
              return _this.next(dir);
            }
          };
        })(this));
        $(document).on("contextmenu", function(e) {
          return e.preventDefault();
        });
        $(document).on("mousemove", function(e) {
          mousePos.x = e.pageX;
          return mousePos.y = e.pageY;
        });
      }

      Cube.prototype.next = function(dir) {
        var before, beforeIndex, border, change, current, i, iter, iterators, j, k, state, _i, _j, _k, _l, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
        if (this.gameover) {
          return;
        }
        state = this.state;
        iterators = {
          0: function(row, col, depth) {
            return {
              get: function() {
                return state[row][col][depth];
              },
              set: function(val) {
                return state[row][col][depth] = val;
              }
            };
          },
          1: function(row, col, depth) {
            return {
              get: function() {
                return state[row][col][state.length - 1 - depth];
              },
              set: function(val) {
                return state[row][col][state.length - 1 - depth] = val;
              }
            };
          },
          2: function(row, col, depth) {
            return {
              get: function() {
                return state[row][depth][col];
              },
              set: function(val) {
                return state[row][depth][col] = val;
              }
            };
          },
          3: function(row, col, depth) {
            return {
              get: function() {
                return state[row][state.length - 1 - depth][col];
              },
              set: function(val) {
                return state[row][state.length - 1 - depth][col] = val;
              }
            };
          },
          4: function(row, col, depth) {
            return {
              get: function() {
                return state[depth][col][row];
              },
              set: function(val) {
                return state[depth][col][row] = val;
              }
            };
          },
          5: function(row, col, depth) {
            return {
              get: function() {
                return state[state.length - 1 - depth][col][row];
              },
              set: function(val) {
                return state[state.length - 1 - depth][col][row] = val;
              }
            };
          }
        };
        iter = iterators[dir];
        change = false;
        for (i = _i = 0, _ref = this.state.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          for (j = _j = 0, _ref1 = this.state.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
            for (k = _k = 1, _ref2 = this.state.length; 1 <= _ref2 ? _k < _ref2 : _k > _ref2; k = 1 <= _ref2 ? ++_k : --_k) {
              current = iter(i, j, k).get();
              if (current === 0) {
                continue;
              }
              beforeIndex = k - 1;
              border = 0;
              while (beforeIndex >= border) {
                before = iter(i, j, beforeIndex).get();
                if (before === 0) {
                  iter(i, j, beforeIndex).set(current);
                  iter(i, j, beforeIndex + 1).set(0);
                  beforeIndex--;
                  change = true;
                } else if (before === current) {
                  iter(i, j, beforeIndex + 1).set(0);
                  iter(i, j, beforeIndex).set(current * 2);
                  this.score += current * 2;
                  $("#score").text("Score : " + this.score);
                  border = beforeIndex + 1;
                  change = true;
                } else {
                  break;
                }
              }
            }
          }
        }
        for (i = _l = 0, _ref3 = this.state.length; 0 <= _ref3 ? _l < _ref3 : _l > _ref3; i = 0 <= _ref3 ? ++_l : --_l) {
          for (j = _m = 0, _ref4 = this.state.length; 0 <= _ref4 ? _m < _ref4 : _m > _ref4; j = 0 <= _ref4 ? ++_m : --_m) {
            for (k = _n = 0, _ref5 = this.state.length; 0 <= _ref5 ? _n < _ref5 : _n > _ref5; k = 0 <= _ref5 ? ++_n : --_n) {
              this.updateVisualNumber(i, j, k);
            }
          }
        }
        if (change) {
          this.addNumber();
          this.addNumber();
        }
        return void 0;
      };

      Cube.prototype.rotate = function(rotateX, rotateY) {
        var matrix, number, up, vector, _i, _len, _ref, _results;
        this.mainScene.rotation.x += rotateX;
        this.mainScene.rotation.y += rotateY;
        vector = this.options.cameraPos.clone();
        matrix = new THREE.Matrix4();
        matrix.getInverse(this.mainScene.matrix);
        vector.applyMatrix4(matrix);
        up = new THREE.Vector3(0, 1, 0);
        up.applyMatrix4(matrix);
        _ref = this.numbers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          number = _ref[_i];
          number.up = up;
          _results.push(number.lookAt(vector));
        }
        return _results;
      };

      Cube.prototype.addNumber = function() {
        var freeFields, i, j, k, num, rand, _i, _j, _k, _ref, _ref1, _ref2;
        num = 2 * (1 + (Math.random() > 0.8));
        freeFields = [];
        for (i = _i = 0, _ref = this.state.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          for (j = _j = 0, _ref1 = this.state.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
            for (k = _k = 0, _ref2 = this.state.length; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; k = 0 <= _ref2 ? ++_k : --_k) {
              if (this.state[i][j][k] === 0) {
                freeFields.push([i, j, k]);
              }
            }
          }
        }
        if (freeFields.length) {
          rand = Math.floor(Math.random() * freeFields.length);
          if (rand === this.state.length) {
            rand--;
          }
          rand = freeFields[rand];
          this.state[rand[0]][rand[1]][rand[2]] = num;
          this.updateVisualNumber.apply(this, rand);
        } else {
          $("#gameover").show();
          this.gameover = true;
        }
        return void 0;
      };

      Cube.prototype.updateVisualNumber = function(i, j, k) {
        var num, visualNum;
        visualNum = this.numbers[i * this.state.length * this.state.length + j * this.state.length + k];
        num = this.state[i][j][k];
        visualNum.material = this.numberMaterials.get(num);
        this.cubes[i * this.state.length * this.state.length + j * this.state.length + k].material = this.getCubeMaterials(num);
        return void 0;
      };

      Cube.prototype.highlightCube = function() {
        var intersects, obj, raycaster, vector, _i, _len, _results;
        vector = new THREE.Vector3((this.mousePos.x / window.innerWidth) * 2 - 1, -(this.mousePos.y / window.innerHeight) * 2 + 1, 0.5);
        this.projector.unprojectVector(vector, this.options.camera);
        raycaster = new THREE.Raycaster(this.options.cameraPos, vector.sub(this.options.cameraPos).normalize());
        intersects = raycaster.intersectObjects(this.cubes);
        this.prevMaterial.opacity = this.prevOpacity;
        _results = [];
        for (_i = 0, _len = intersects.length; _i < _len; _i++) {
          obj = intersects[_i];
          if (obj.object.material !== this.getCubeMaterials(0)) {
            this.prevOpacity = obj.object.material.opacity;
            this.prevMaterial = obj.object.material;
            obj.object.material.opacity = this.options.opacityHighlight;
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      return Cube;

    })();
  });

}).call(this);
