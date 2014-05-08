define ["text_renderer", "three", "underscore", "jquery"], (renderText, THREE, _, $) ->
    class Cube
        constructor: (options) ->
            options or (options = {})
            _.defaults options,
                size: 4,
                cubeSize: 1,
                numberSize : 0.8
                cubeSpacing: 0.2
                color: 0x87cefa
                opacity: 0.2
                opacityEmpty: 0.05
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
            @cubeMaterial = new THREE.MeshPhongMaterial(color: options.color, opacity: options.opacity, transparent: true)
            @cubeMaterialEmpty = new THREE.MeshPhongMaterial(color: options.color, opacity: options.opacityEmpty, transparent: true)
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
            @cubes = []
            for i in [0...options.size]
                for j in [0...options.size]
                    for k in [0...options.size]
                        cube = new THREE.Mesh(cubeGeometry, @cubeMaterialEmpty)
                        cube.position.set (i-1.5)*(options.cubeSize+options.cubeSpacing),
                            (j-1.5)*(options.cubeSize+options.cubeSpacing),
                            (k-1.5)*(options.cubeSize+options.cubeSpacing)
                        number = new THREE.Mesh(numberGeometry,@numberMaterials.get(0))
                        number.lookAt(options.cameraPos)
                        cube.add(number)
                        @cubes.push(cube)
                        @numbers.push(number)
                        @mainScene.add(cube)
            cubeSize = options.size * options.cubeSize + (options.size-1) * options.cubeSpacing
            planeGeometry = new THREE.PlaneGeometry(cubeSize, cubeSize)
            planeMaterial = new THREE.MeshBasicMaterial(alphaTest: 0.5, opacity: 0, side: THREE.BackSide, color: 0)
            origin = new THREE.Vector3(0,0,0)
            planeScene = new THREE.Scene()
            @mainScene.add(planeScene)
            planes = []
            planeMap = {}
            tmp = new THREE.Mesh(planeGeometry, planeMaterial)
            tmp.position.set(0, 0, cubeSize/2)
            tmp.lookAt(origin)
            planeMap[tmp.uuid] = 0
            planes.push(tmp)
            planeScene.add(tmp)
            tmp = new THREE.Mesh(planeGeometry, planeMaterial)
            tmp.position.set(0, 0, -cubeSize/2)
            tmp.lookAt(origin)
            planeMap[tmp.uuid] = 1
            planes.push(tmp)
            planeScene.add(tmp)
            tmp = new THREE.Mesh(planeGeometry, planeMaterial)
            tmp.position.set(0, cubeSize/2, 0)
            tmp.lookAt(origin)
            planeMap[tmp.uuid] = 2
            planes.push(tmp)
            planeScene.add(tmp)
            tmp = new THREE.Mesh(planeGeometry, planeMaterial)
            tmp.position.set(0, -cubeSize/2, 0)
            tmp.lookAt(origin)
            planeMap[tmp.uuid] = 3
            planes.push(tmp)
            planeScene.add(tmp)
            tmp = new THREE.Mesh(planeGeometry, planeMaterial)
            tmp.position.set(cubeSize/2, 0, 0)
            tmp.lookAt(origin)
            planeMap[tmp.uuid] = 4
            planes.push(tmp)
            planeScene.add(tmp)
            tmp = new THREE.Mesh(planeGeometry, planeMaterial)
            tmp.position.set(-cubeSize/2, 0, 0)
            planeMap[tmp.uuid] = 5
            tmp.lookAt(origin)
            planes.push(tmp)
            planeScene.add(tmp)
            @addNumber()
            @addNumber()
            @addNumber()
            @addNumber()
            projector = new THREE.Projector()
            $(document).on "mousedown", (e) =>
                vector = new THREE.Vector3( ( e.pageX / window.innerWidth ) * 2 - 1, - ( e.pageY / window.innerHeight ) * 2 + 1, 0.5 )
                projector.unprojectVector(vector, options.camera)
                raycaster = new THREE.Raycaster(options.cameraPos, vector.sub(options.cameraPos).normalize())
                intersects = raycaster.intersectObjects(planes)
                if intersects.length
                    dir = planeMap[intersects[0].object.uuid]
                    dir ^= 1 if e.which == 3
                    @next(dir)
            $(document).on "contextmenu", (e) ->
                e.preventDefault()


        next: (dir) ->
            state = @state
            iterators =
                0: (row, col, depth) ->
                    get: -> state[row][col][depth]
                    set: (val) -> state[row][col][depth] = val
                1: (row, col, depth) ->
                    get: -> state[row][col][state.length - 1 - depth]
                    set: (val) -> state[row][col][state.length - 1 - depth] = val
                2: (row, col, depth) ->
                    get: -> state[row][depth][col]
                    set: (val) -> state[row][depth][col] = val
                3: (row, col, depth) ->
                    get: -> state[row][state.length - 1 - depth][col]
                    set: (val) -> state[row][state.length - 1 - depth][col] = val
                4: (row, col, depth) ->
                    get: -> state[depth][col][row]
                    set: (val) -> state[depth][col][row] = val
                5: (row, col, depth) ->
                    get: -> state[state.length - 1 - depth][col][row]
                    set: (val) -> state[state.length - 1 - depth][col][row] = val
            iter = iterators[dir]
            for i in [0...@state.length]
                for j in [0...@state.length]
                    for k in [1...@state.length]
                        current = iter(i,j,k).get()
                        if current == 0
                            continue
                        beforeIndex = k-1
                        border = 0
                        while beforeIndex >= border
                            before = iter(i,j,beforeIndex).get()
                            if before == 0
                                iter(i,j,beforeIndex).set(current)
                                iter(i,j,beforeIndex+1).set(0)
                                beforeIndex--
                            else if before == current
                                iter(i,j,beforeIndex+1).set(0)
                                iter(i,j,beforeIndex).set(current * 2)
                                border = beforeIndex + 1
                            else
                                break

            for i in [0...@state.length]
                for j in [0...@state.length]
                    for k in [0...@state.length]
                        @updateVisualNumber(i,j,k)
            @addNumber()
            @addNumber()
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
            return undefined

        updateVisualNumber: (i,j,k) ->
            visualNum = @numbers[i*@state.length*@state.length+j*@state.length+k]
            num = @state[i][j][k]
            visualNum.material = @numberMaterials.get(num)
            @cubes[i*@state.length*@state.length+j*@state.length+k].material = (if num then @cubeMaterial else @cubeMaterialEmpty)
            return undefined

