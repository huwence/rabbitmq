module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        coffee: {
            glob_to_multiple: {
                expand: true,
                flatten: true,
                cwd: 'src/',
                src: ['*.coffee', '**/*.coffee'],
                dest: 'lib/',
                ext: '.js'
            }
        }
    });

    //grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.registerTask('mugeda_stats', ['coffee']);
}
