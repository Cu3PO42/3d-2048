define ["underscore","three"], (_,THREE) ->
    canvas = document.createElement('canvas')
    context = canvas.getContext('2d')
    cache = {}
    
    (text, options) ->
        options or (options = {})
        _.defaults options,
            willCache: true
            font: "30pt Courier New"
            color: "black"
        id = {text: text, font: options.font, color: options.color}
        return cache[id] if id of cache
        context.font = options.font
        context.fillStyle = options.color
        metrics = context.measureText(text)
        canvas.width = metrics.width
        canvas.height = metric.height
        context.clearRect(0,0,canvas.width,canvas.height)
        context.fillText(text,0,0)
        texture = new THREE.Texture(canvas)
        if options.willCache
            cache[id] = texture
        return texture