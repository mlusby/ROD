module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [
        './*.js'
      ],
      options: {
        // options here to override JSHint defaults
        globals: {
          console: true,
          module: true,
          document: true
        }
      }
    },
    open: {
      all: {
        path: 'http://localhost:<%= express.all.options.port%>/'
      }
    },
    express: {
      all: {
        options: {
          script: './web.js',
          port: 5000
        }
      }
    },
    watch: {
      all: {
        files: ['*.js', 'views/**/*.html', '**/*.json'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('default', ['jshint', 'express:all', 'open', 'watch']);
  grunt.registerTask('build', ['jshint']);
};