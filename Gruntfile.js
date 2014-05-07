module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            dev: ['dev/']
        },
        coffee: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'src/js/',
                    src: ['**/*.coffee'],
                    dest: 'dev/js/',
                    ext: '.js'
                }]
            }
        },
        copy: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.html', '**/*.js', '**/*.css'],
                    dest: 'dev/'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['clean:dev', 'coffee:dev', 'copy:dev']);
};