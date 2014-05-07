require.config
    paths:
        "three": "vendor/three"
        "jquery": "vendor/jquery"
        "stats": "vendor/stats"
        "underscore": "vendor/underscore"

    shim:
        "three":
            exports: "THREE"
        "stats":
            deps: ["three"]
            exports: "Stats"
        "underscore":
            exports: "_"

require ["app"], (Game) ->
    (new Game({

    })).loop()