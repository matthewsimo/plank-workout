module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    compass: {
      dist: {
        options: {
          sassDir: 'assets/scss/',
          cssDir: 'assets/css/',
          trace: true,
          force: true,
          environment: 'production'
        }
      }
    },

    jshint: {
      all: ['assets/js/app/**/*.js', 'Gruntfile.js']
    },

    concat: {
      basic: {
        src: ['assets/js/app/**/*.js'],
        dest: 'assets/build/main.js'
      },
      vendor: {
        src: [
          'assets/vendor/angular/angular.min.js',
        ],
        dest: 'assets/build/vendor.js'
      },
      vendor_css: {
        src: [
          'assets/vendor/ionicons/css/ionicons.min.css',
        ],
        dest: 'assets/build/vendor.css'
      }
    },

    uglify: {
      basic: {
        options: {
          mangle: false
        },
        files: {
          'assets/js/build/main.js': ['assets/js/build/main.js'],
        }
      },
    },

    watch: {
      css: {
        files: 'assets/scss/**/*.scss',
        tasks: ['compass']
      },
      scripts: {
        files: ['assets/js/app/**/*.js', 'assets/js/vendor/**/*.js', 'Gruntfile.js'],
        tasks: ['jshint', 'concat'],//, 'uglify'],
        options: {
          interrupt: true,
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default',['watch']);
  grunt.registerTask('lint',['jshint']);
  grunt.registerTask('build',['jshint', 'concat', 'uglify']);

};
