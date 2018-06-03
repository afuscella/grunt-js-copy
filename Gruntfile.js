/*
 * grunt-js-copy
 * https://github.com/afuscella/grunt-js-copy
 *
 * Copyright (c) 2018 Arthur Silva
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    copy: {

      // Copy everything from one place to another.
      all: {
        files: [
          { cwd: 'test/fixtures/', src: '*', dest: 'tmp/copy_test_all' }
        ]
      },

      // Copy files according with its extension.
      extension: {
        files: [
          { expand: true, cwd: 'test/fixtures/test_html', src: ['*.html'], dest: 'tmp/copy_extension/html' },
          { expand: true, cwd: 'test/fixtures/test_js', src: ['**/*.js'], dest: 'tmp/copy_extension/js' },
          { expand: true, cwd: 'test/fixtures/test_xml', src: ['**/*.xml'], dest: 'tmp/copy_extension/xml' }
        ]
      },

      // Copy and rename.
      rename: {
        files: [
          { 
            expand: true, 
            cwd: 'test/fixtures/test_js', 
            src: ['**/*.js'], 
            dest: 'tmp/copy_rename',
            // The 'dest' and 'src' values are passed into the function
            rename: function(dest, src) {
              // The 'src' is being renamed; the 'dest' remains the same
              return dest + "/" + src.replace(".js", "-dbg.js");
					  }
          },
        ]
      },

      // Copy and rename using regular expression.
      renameWithRegex: {
        files: [
          { 
            expand: true, 
            cwd: 'test/fixtures', 
            src: ['**/*.js', '**/*.xml', '*.html'], 
            dest: 'tmp/copy_rename_regex',
            // The 'dest' and 'src' values are passed into the function
            rename: function(dest, src) {
              // The 'src' is being renamed; the 'dest' remains the same
              return dest + '/' + src.replace(/(\.js|\.xml|\.html)/, "-dbg$1");
					  }
          },
        ]
      }, 

      // Copy files and compress (minify).
      compress: {
        options: {
          compression: true,
        },
        files: [
          { expand: true, cwd: 'test/fixtures', src: ['**/*.js'], dest: 'tmp/copy_test_compress' }
        ]
      }
      
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'copy', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};