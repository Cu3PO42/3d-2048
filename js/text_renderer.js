(function() {
  define(["underscore", "three"], function(_, THREE) {
    var cache;
    cache = {};
    return function(text, options) {
      var canvas, context, id, metrics, texture;
      options || (options = {});
      _.defaults(options, {
        willCache: true,
        size: 128,
        font: "Helvetica",
        color: "#ff0000"
      });
      id = JSON.stringify({
        text: text,
        font: options.font,
        color: options.color
      });
      if (id in cache) {
        return cache[id];
      }
      canvas = document.createElement('canvas');
      context = canvas.getContext('2d');
      context.font = "" + options.size + "px " + options.font;
      metrics = context.measureText(text);
      canvas.width = metrics.width;
      canvas.height = options.size;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = "" + options.size + "px " + options.font;
      context.fillStyle = options.color;
      context.fillText(text, 0, canvas.height);
      texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      if (options.willCache) {
        cache[id] = texture;
      }
      return texture;
    };
  });

}).call(this);
