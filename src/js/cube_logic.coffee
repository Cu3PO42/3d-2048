define [], ->
    iterators = (cube) ->
        1: (row, col, depth) ->
            get: -> cube[row][col][depth]
            set: (val) -> cube[row][col][depth] = val
        2: (row, col, depth) ->
            get: -> cube[row][col][cube.length - depth]
            set: (val) -> cube[row][col][cube.length - depth] = val
        3: (row, col, depth) ->
            get: -> cube[row][depth][col]
            set: (val) -> cube[row][depth][col] = val
        4: (row, col, depth) ->
            get: -> cube[row][cube.length - depth][col]
            get: -> cube[row][cube.length - depth][col] = val
        5: (row, col, depth) ->
            get: -> cube[depth][col][row]
            set: (val) -> cube[depth][col][row] = val
        6: (row, col, depth) ->
            get: -> cube[cube.length - depth][col][row]
            set: -> cube[cube.length - depth][col][row] = val

    next = (cube, dir) ->
        iter = iterators(cube)[dir]
        for i in [0...cube.length]
            for j in [0...cube.length]
                if iter(i,j,0).get() == 0
                    first_available = 0
                else
                    first_available = 1
                for k in [1...cube.length]
                    it = iterators(i,j,k)
                    if it.get() != 0
                        if first_available and iter(i,k,first_available-1).get() == it.get()
                            iter(i,k,first_available-1).set(it.get() * 2)
                            it.set(0)
                        else if first_available != k
                            iter(i,j,first_available).set(it.get())
                            first_available += 1
                            it.set(0)
