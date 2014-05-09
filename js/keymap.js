(function() {
  define(["jquery"], function($) {
    var keycodes, state;
    state = {};
    $(document).on("keyup", (function(_this) {
      return function(e) {
        return state[e.keyCode] = false;
      };
    })(this));
    $(document).on("keydown", (function(_this) {
      return function(e) {
        return state[e.keyCode] = true;
      };
    })(this));
    keycodes = {
      "W": 87,
      "A": 65,
      "S": 83,
      "D": 68,
      "Q": 81,
      "E": 69,
      "SPACE": 32,
      "SHIFT": 16,
      "UP": 38,
      "DOWN": 40,
      "LEFT": 37,
      "RIGHT": 39
    };
    return {
      isPressed: function(keycode) {
        return !!state[keycodes[keycode]];
      }
    };
  });

}).call(this);
