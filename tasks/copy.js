/*
 * grunt-js-copy
 * https://github.com/afuscella/grunt-js-copy
 *
 * Copyright (c) 2018 Arthur Silva
 * Licensed under the MIT license.
 */

'use strict';

// Private attributes
var chalk = require('chalk');
var path = require('path');

/**
 * Converts the src (filePath) for the current platform format
 * @param {String} src the current filePath
 */
function unixifyPath (src) {
  if (process.platform === 'win32') {
    return src.replace(/\\/g, '/'); // windows based
  }
  return src; // unix based
}

/**
 * Adjusts filePath by removing the unwanted character of last
 * string position
 * @param {String} filePath 
 */
function adjustDirPath (filePath) {
  var i = filePath.length;
  return filePath.substring(0, i-1);
}

/**
 * Uglify JS, XML, JSON, CSS and SQL files
 * @param {String} fileExtension 
 * @param {String} filePath 
 */
function uglifyFile (fileName, fileContent) {
  var pd = require('pretty-data').pd,
    uglify = require('uglify-es'),
    fileExtension = path.extname(fileName),

    // object used for returning data
    oReturn = {
      success: true,
      data: null
    };

  try {
    switch (fileExtension) {
      case '.js':
        oReturn.data = uglify.minify(fileContent).code;
        break;

      case '.xml':
        oReturn.data = pd.xmlmin(fileContent, false);
        break;

      case '.json':
        oReturn.data = JSON.stringify(JSON.parse(fileContent));
        break;

      case '.css':
        oReturn.data = pd.cssmin(fileContent);
        break;

      case '.sql':
        oReturn.data = pd.sqlmin(fileContent);
        break;
    }
  } catch (error) {
    oReturn.data = null;
  }

  if (!oReturn.data) {
    oReturn.success = false;
    oReturn.message = ('... Failed to compress. Check for sintax errors on the file.');
  }
  return oReturn;
}

/**
 * The copy module
 * 
 * @param {Grunt} grunt 
 */
module.exports = function (grunt) {

  grunt.registerMultiTask(
    'copy',
    'Copy and compress using Grunt',
    function () {

      // Merge task-specific and/or target-specific options with these defaults.
      var options = this.options({
        compression: false
      });

      if (typeof options.compression !== 'boolean') {
        return grunt.log.warn(
          chalk.cyan('Unsupported `compression` type: ') + 'Boolean expected');
      }

      if (options.compression) {
        grunt.log.writeflags(options, "Parameter (Options)");
      }

      // Initialize variables.
      var oResourceMap, iTotal = 0, isExpanded, dest;

      this.files.forEach(function (file) {

        isExpanded = file.orig.expand || false;

        file.src.forEach(function (src) {
          // Restore object to its original state.
          oResourceMap = {};

          src = unixifyPath(isExpanded ? src : path.join(file.orig.cwd, src));

          while (grunt.util._.endsWith(file.orig.cwd, '/')) {
            console.log(file.orig.cwd);
            file.orig.cwd = adjustDirPath(file.orig.cwd);
          }
          // Proceed in case the object being a directory
          if (grunt.file.isDir(src)) {

            try {
              grunt.file.recurse(src, function (fileRecurse) {
                if (grunt.file.exists(fileRecurse)) {

                  oResourceMap[fileRecurse] = {
                    fileName: path.basename(fileRecurse),
                    fileNameDest: grunt.file.isFile(file.dest) ? path.basename(file.dest) : path.basename(fileRecurse),
                    dirNameDest: unixifyPath(fileRecurse.replace(file.orig.cwd, file.orig.dest))
                  };
                }
              });

            } catch (oError) {
              return grunt.log.warn('Error while reading source: "' + src + '" ' + oError);
            }

          } else if (grunt.file.isFile(src)) {

            // Otherwise, include the file on Array 
            oResourceMap[src] = {
              fileName: path.basename(src),
              fileNameDest: path.basename(unixifyPath(isExpanded ? file.dest : path.join(file.dest, src))),
              dirNameDest: unixifyPath(src.replace(file.orig.cwd, file.orig.dest))
            };
          }

          // Get the objects key by rearranging them
          var oResourceKeys = Object.keys(oResourceMap).sort();

          if (!oResourceKeys.length) {
            return grunt.log.warn('No such files found. Check "cwd" option!');
          }

          // Iterate over the Keys ...
          oResourceKeys.forEach(function (resourceKey) {
            var oResource = oResourceMap[resourceKey],
              fileName = oResource.fileName,
              fileNameDest = oResource.fileNameDest,
              fileContent = grunt.file.read(resourceKey),
              oResult = { success: true };

            grunt.log.writeln('>> ... copying: ' +
              chalk.cyan(fileName) + ' => ' +
              chalk.cyan(oResource.dirNameDest.replace(fileName, fileNameDest)));

            if (options.compression) {
              oResult = uglifyFile(fileName, fileContent);

              if (!oResult.success) {
                grunt.log.warn(chalk.yellow(oResult.message));
                return grunt.log.writeln();
              }
              fileContent = oResult.data;
            }

            // ... and copy files synchronously
            grunt.file.write(oResource.dirNameDest.replace(fileName, fileNameDest), fileContent);
            iTotal++;

          });
        });
      });

      grunt.log.writeln();

      // Display the total of files copied
      if (iTotal) {
        return grunt.log.writeln(
          chalk.green('Total ' +
            (iTotal === 1 ? 'file' : 'files') + ' copied: [' + iTotal + ']')
        );
      }
    });
};