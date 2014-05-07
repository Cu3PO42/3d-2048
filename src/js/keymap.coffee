define ["jquery"], ($) ->
        state = {}
        $(document).on "keyup", (e) =>
            state[e.keyCode] = false
        $(document).on "keydown", (e) =>
            state[e.keyCode] = true

        keycodes =
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

        isPressed: (keycode) ->
            !!state[keycodes[keycode]]
