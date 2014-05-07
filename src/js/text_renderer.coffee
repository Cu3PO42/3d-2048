define ["underscore","three"], (_,THREE) ->
    cache = {}
    
    (text, options) ->
        options or (options = {})
        _.defaults options,
            willCache: true
            size: 30
            font: "Times Roman"
            color: "#ff0000"
        id = JSON.stringify({text: text, font: options.font, color: options.color})
        console.log("render text called")
        return cache[id] if id of cache
        canvas = document.createElement('canvas')
        $("#container").append(canvas)
        context = canvas.getContext('2d')
        context.font = "#{options.size}px #{options.font}"
        metrics = context.measureText(text)
        canvas.width = metrics.width
        canvas.height = options.size
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.font = "#{options.size}px #{options.font}"
        context.fillStyle = options.color
        context.fillText(text,0,canvas.height)
        texture = new THREE.Texture(canvas)
        texture.needsUpdate = true
        if options.willCache
            cache[id] = texture
        return texture