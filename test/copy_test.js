/*
 * grunt-js-copy
 * https://github.com/afuscella/grunt-js-copy
 *
 * Copyright (c) 2018 Arthur Silva
 * Licensed under the MIT license.
 */

'use strict';

var grunt = require('grunt'),
  fs = require('fs');

exports.copy = {
  setUp: function (done) {
    // no setup is necessary
    done();
  },

  /**
   * Test the task 'all' which consist in copying every content from on place
   * to another.
   * @param {grunt.test} test the grunt test class
   */
  all: function (test) {
    test.expect(1);

    var actual = fs.readdirSync('test/fixtures').sort();
    var expected = fs.readdirSync('tmp/copy_test_all').sort();
    test.deepEqual(expected, actual, 'Should copy all files');

    test.done();
  },

  /**
   * Test the task 'extension' which copies files with certain extensions
   * defined on task on the grunt initial configuration.
   * @param {grunt.test} test the grunt test class
   */
  extension: function (test) {
    test.expect(3);

    ['html', 'js', 'xml'].forEach(function (ext, i) {

      var actual = fs.readdirSync('test/fixtures/test_' + ext).sort();
      var expected = fs.readdirSync('tmp/copy_extension/' + ext).sort();
      test.deepEqual(expected, actual, 'Should copy ' + ext + ' files');

    });

    test.done();
  },

  /**
   * Test the task 'rename' by renaming the source files according to the result
   * of the function defined on the grunt initial configuration.
   * @param {grunt.test} test the grunt test class
   */
  rename: function (test) {
    test.expect(1);

    var actual = fs.readdirSync('test/fixtures/test_js').sort();
    var expected = fs.readdirSync('tmp/copy_rename').sort();
    test.notStrictEqual(expected, actual, 'Should copy renamed files');

    test.done();
  },

  /**
   * Test the task 'renameWithRegex' by renaming the source files according to 
   * the regular expression defined on the grunt initial configuration.
   * @param {grunt.test} test the grunt test class
   */
  renameWithRegex: function (test) {
    test.expect(1);

    var actual = fs.readdirSync('test/fixtures/test_js').sort();
    var expected = fs.readdirSync('tmp/copy_rename').sort();
    test.notStrictEqual(expected, actual, 'Should copy renamed files');

    test.done();
  },

  /**
   * Test the task 'compress' which copy and minify JavaScript files from 
   * one place to another.
   * @param {grunt.test} test the grunt test class
   */
  compress: function (test) {
    test.expect(1);

    var actual = fs.readdirSync('test/fixtures').sort();
    var expected = fs.readdirSync('tmp/copy_test_compress').sort();
    test.notStrictEqual(expected, actual, 'Should copy compressed files');

    test.done();
  }

};
