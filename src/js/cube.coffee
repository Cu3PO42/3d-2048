define ["text_renderer", "three", "underscore"], (renderText, THREE, _) ->
    class Cube
        constructor: (options) ->
            options or (options = {})
            _.defaults options,
                size: 4,
                cubeSize: 1,
                numberSize : 0.8
                cubeSpacing: 0.2
                color: 0x87cefa
                opacity: 0.5
                cameraPos: new THREE.Vector3(-10,0,0)
            @options = options
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
            @mainScene.matrixAutoUpdate = true
            @numbers = []
            numberGeometry = new THREE.PlaneGeometry(options.numberSize, options.numberSize)
            cubeGeometry = new THREE.BoxGeometry(options.cubeSize,options.cubeSize,options.cubeSize)
            cubeMaterial = new THREE.MeshPhongMaterial(color: options.color, opacity: options.opacity, transparent: true)
            @numberMaterials = do ->
                cache = {}
                clearMaterial = new THREE.MeshPhongMaterial(map: renderText(0), transparent: true, opacity: 0, color: 0)
                get: (num) ->
                    return clearMaterial unless num
                    num = ""+num
                    return cache[num] if num of cache
                    texture = renderText(num)
                    material = new THREE.MeshPhongMaterial(map: texture,alphaTest:0.5, color: 0xffffff, useScreenCoordinates: true)
                    cache[num] = material
                    return material
            for i in [0...options.size]
                for j in [0...options.size]
                    for k in [0...options.size]
                        cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
                        cube.position.set (i-1.5)*(options.cubeSize+options.cubeSpacing),
                            (j-1.5)*(options.cubeSize+options.cubeSpacing),
                            (k-1.5)*(options.cubeSize+options.cubeSpacing)
                        number = new THREE.Mesh(numberGeometry,@numberMaterials.get(0))
                        number.lookAt(options.cameraPos)
                        cube.add(number)
                        @numbers.push(number)
                        @mainScene.add(cube)
        next: (dir) ->
            state = @state
            iterators =
                1: (row, col, depth) ->
                    get: -> state[row][col][depth]
                    set: (val) -> state[row][col][depth] = val
                2: (row, col, depth) ->
                    get: -> state[row][col][state.length - 1 - depth]
                    set: (val) -> state[row][col][state.length - 1 - depth] = val
                3: (row, col, depth) ->
                    get: -> state[row][depth][col]
                    set: (val) -> state[row][depth][col] = val
                4: (row, col, depth) ->
                    get: -> state[row][state.length - 1 - depth][col]
                    get: -> state[row][state.length - 1 - depth][col] = val
                5: (row, col, depth) ->
                    get: -> state[depth][col][row]
                    set: (val) -> state[depth][col][row] = val
                6: (row, col, depth) ->
                    get: -> state[state.length - 1 - depth][col][row]
                    set: -> state[state.length - 1 - depth][col][row] = val
            iter = iterators[dir]
            for i in [0...@state.length]
                for j in [0...@state.length]
                    if iter(i,j,0).get() == 0
                        first_available = 0
                    else
                        first_available = 1
                    for k in [1...@state.length]
                        it = iter(i,j,k)
                        if it.get() != 0
                            if first_available and iter(i,k,first_available-1).get() == it.get()
                                iter(i,k,first_available-1).set(it.get() * 2)
                                it.set(0)
                            else if first_available != k
                                iter(i,j,first_available).set(it.get())
                                first_available += 1
                                it.set(0)
            for i in [0...@state.length]
                for j in [0...@state.length]
                    for k in [0...@state.length]
                        @updateVisualNumber(i,j,k)
            return undefined

        rotate: (rotateX,rotateY) ->
            @mainScene.rotation.x += rotateX
            @mainScene.rotation.y += rotateY
            vector = @options.cameraPos.clone()
            matrix = new THREE.Matrix4()
            matrix.getInverse(@mainScene.matrix)
            vector.applyMatrix4(matrix)
            up = new THREE.Vector3(0,1,0)
            up.applyMatrix4(matrix)
            for number in @numbers
                number.up = up
                number.lookAt(vector)

        addNumber: ->
            num = 2 * (1+(Math.random() > 0.8))
            freeFields = []
            for i in [0...@state.length]
                for j in [0...@state.length]
                    for k in [0...@state.length]
                        if @state[i][j][k] == 0
                            freeFields.push([i,j,k])
            if freeFields
                rand = Math.floor(Math.random() * freeFields.length)
                rand-- if rand == @state.length
                rand = freeFields[rand]
            else
                alert("Game over!")
            @state[rand[0]][rand[1]][rand[2]] = num
            @updateVisualNumber.apply(this, rand)

        updateVisualNumber: (i,j,k) ->
            visualNum = @numbers[i*@state.length*@state.length+j*@state.length+k]
            visualNum.material = @numberMaterials.get(@state[i][j][k])

