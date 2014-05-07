define ["cube", "keymap", "three","stats", "jquery", "underscore"], (Cube, Keymap, THREE, Stats, $, _) ->
    class Game
        constructor: (options) ->
            options or (options = {})
            _.defaults options,
                cameraFocal: 45
                cameraNear: 1
                cameraFar: 1000
                container: "#container",
                cameraPos: [0,0,10],
                rotationSpeed: 1,
                lights: [
                    {
                        pos: [0,-5, 10],
                        color: 0xffffff,
                        intensity: 0.2
                    }
                    {
                        pos: [0,5, 10],
                        color: 0xffffff,
                        intensity: 0.2
                    }
                ]
            @options = options
            @container = $(options.container)
            @scene = new THREE.Scene()
            @stats = new Stats()
            @container.append(@stats.domElement)
            @clock = new THREE.Clock()
            @renderer = new THREE.WebGLRenderer()
            @container.append(@renderer.domElement)
            @camera = new THREE.PerspectiveCamera(options.cameraFocal, 1, options.cameraNear, options.cameraFar)
            @camera.position.set.apply(@camera.position, options.cameraPos)
            @scene.add(@camera)
            for light in options.lights
                tmp = new THREE.DirectionalLight(light.color, light.intensity)
                tmp.position.set.apply(tmp.position, light.pos)
                @scene.add(tmp)
            @scene.add(new THREE.AmbientLight(0xaaaaaa))
            $(window).on "resize", =>
                @camera.aspect = @container.width() / @container.height()
                @renderer.setSize(@container.width(), @container.height())
                @camera.updateProjectionMatrix()
            $(window).trigger("resize")

            @cube = new Cube(cameraPos: @camera.position)
            window.cube = @cube
            @scene.add(@cube.mainScene)
        loop: ->
            @stats.begin()
            delta = @clock.getDelta()
            rotateX = @options.rotationSpeed * delta * (Keymap.isPressed("DOWN") - Keymap.isPressed("UP"))
            rotateY = @options.rotationSpeed * delta * (Keymap.isPressed("LEFT") - Keymap.isPressed("RIGHT"))
            @cube.rotate(rotateX,rotateY)
            @renderer.render(@scene,@camera)
            @stats.end()
            requestAnimationFrame(=> @loop())