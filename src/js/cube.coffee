define ["three", "underscore"], (THREE, _) ->
    class Cube
        constructor: (options) ->
            options or (options = {})
            _.defaults options,
                size: 4,
                cubeSize: 1,
                cubeSpacing: 0.2
            @state = []
            for i in [1..options.size]
                @state.push([])
                last_1d = @state[@state.length-1]
                for j in [1..options.size]
                    last_1d.push([])
                    last_2d = last_1d[last_1d.length-1]
                    for k in [1..options.size]
                        last_2d.push(0)
            @mainScene = new THREE.Scene()
            cubeGeometry = new THREE.BoxGeometry(options.cubeSize,options.cubeSize,options.cubeSize)
            cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff})
            for i in [0...options.size]
                for j in [0...options.size]
                    for k in [0...options.size]
                        cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
                        cube.position.set (i-1.5)*(options.cubeSize+options.cubeSpacing),
                            (j-1.5)*(options.cubeSize+options.cubeSpacing),
                            (k-1.5)*(options.cubeSize+options.cubeSpacing)
                        @mainScene.add(cube)
        
        next: (dir) ->
            iterators =
                1: (row, col, depth) ->
                    get: -> @state[row][col][depth]
                    set: (val) -> @state[row][col][depth] = val
                2: (row, col, depth) ->
                    get: -> @state[row][col][@state.length - depth]
                    set: (val) -> @state[row][col][@state.length - depth] = val
                3: (row, col, depth) ->
                    get: -> @state[row][depth][col]
                    set: (val) -> @state[row][depth][col] = val
                4: (row, col, depth) ->
                    get: -> @state[row][@state.length - depth][col]
                    get: -> @state[row][@state.length - depth][col] = val
                5: (row, col, depth) ->
                    get: -> @state[depth][col][row]
                    set: (val) -> @state[depth][col][row] = val
                6: (row, col, depth) ->
                    get: -> @state[@state.length - depth][col][row]
                    set: -> @state[@state.length - depth][col][row] = val
            iter = iterators[dir]
            for i in [0...@state.length]
                for j in [0...@state.length]
                    if iter(i,j,0).get() == 0
                        first_available = 0
                    else
                        first_available = 1
                    for k in [1...@state.length]
                        it = iterators(i,j,k)
                        if it.get() != 0
                            if first_available and iter(i,k,first_available-1).get() == it.get()
                                iter(i,k,first_available-1).set(it.get() * 2)
                                it.set(0)
                            else if first_available != k
                                iter(i,j,first_available).set(it.get())
                                first_available += 1
                                it.set(0)
            