define ["cube", "three","stats", "jquery", "underscore"], (Cube, THREE, Stats, $, _) ->
    class Game
        constructor: (options) ->
            options or (options = {})
            _.defaults options,
                cameraFocal: 45
                cameraNear: 1
                cameraFar: 1000
                container: "#container",
                cameraPos: [0,0,10]
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
            @keymap = {}
            $(document).on "keyup", (e) =>
                @keymap[e.keyCode] = false
            $(document).on "keydown", (e) =>
                @keymap[e.keyCode] = true
            $(window).on "resize", =>
                @camera.aspect = @container.width() / @container.height()
                @renderer.setSize(@container.width(), @container.height())
                @camera.updateProjectionMatrix()
            $(window).trigger("resize")

            cube = new Cube()
            @scene.add(cube.mainScene)
        loop: ->
            @stats.begin()
            @renderer.render(@scene,@camera)
            @stats.end()
            requestAnimationFrame(=> @loop())