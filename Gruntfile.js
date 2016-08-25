module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        watch: {
            grunt: { files: ['Gruntfile.js'] },
            jade: {
                files: 'app/views/**/*.jade',
                tasks: ['jade']
            },
            coffee: {
                files: 'app/coffee/*.coffee',
                tasks: ['coffee:compile']
            }
        },
        jade: {
            compile: {
                options: {
                    pretty: true,
                },
                files: {
                    'public/index.html': 'app/views/index.jade'
                }
            }
        },
        coffee: {
            compile: {
                expand: true,
                flatten: true,
                cwd: "app/coffee/",
                src: ['*.coffee'],
                dest: 'public/js/',
                ext: '.js'
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default','Convert Jade templates into html templates', ['coffee','jade','watch']);
};
