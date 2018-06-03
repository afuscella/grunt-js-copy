# grunt-js-copy v0.1.1

> Create directories with Grunt (based on grunt-mkdir)

## Getting Started
This plugin requires Grunt `^0.4.0` or higher.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-js-mkdir --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-js-copy');
```

## The "copy" task

### Overview
In your project's Gruntfile, add a section named `copy` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  copy: {
    options: {
      // Task-specific options go here.
    },
    files: {
      // Target-specific directories lists.
    }
  },
});
```

### Options

#### compress
Type: `String`
Default value: `false`

A boolean which indicates a compress. If defined as `true`, source files will ne compressed. Available format for compression:

format | extension | description
-------|-----------|--------------
JS     | `.js`     | JavaScript
XML    | `.xml`    | XML
JSON   | `.json`   | JSON
CSS    | `.css`    | CSS (style)
SQL    | `.sql`    | SQL query formats

### Usage Examples

#### Copy all
In this example, the whole content on directory `tmp` it is copies to the subdirectory `tmp/copy_all` without any restriction. 

The parameter `src` represents which files needs to be copied, and in this case `*` means everything under directory `tmp`.

```js
grunt.initConfig({
  copy: {
    all: {
      files: [
        { cwd: 'tmp', src: '*', dest: 'tmp/copy_all' }
      ]
    }
  }
});
```

#### Copy files according with its extension
In this example, only a specific file extension needs to be copied. The content from directory `tmp` it is copies to the following subdirectory `tmp/copy_all` according to the constraint specified. 

The parameter `src` represents which files needs to be copied. For each array entry, it is specified a different file type on the `src` parameter, consequently it also a different destination.

```js
grunt.initConfig({
  copy: {
    extension: {
      files: [
        { expand: true, cwd: 'tmp', src: ['*.html'], dest:  'tmp/copy_ext/html' },
        { expand: true, cwd: 'tmp', src: ['**/*.js'], dest: 'tmp/copy_ext/js' },
        { expand: true, cwd: 'tmp', src: ['**/*.xml'], dest: 'tmp/copy_ext/xml' }
      ]}
  }
});
```

#### Copy and rename
In this example, there's a need not only for a copy, but renaming the copied files also. The content from directory `tmp` it is copied to the following subdirectory `tmp/copy_rename`, and files ending with `.js` will be replaced with `-dbg.js` using a replace function.

The parameter `rename` is the one responsible for renaming the copied files. Both parameters `dest` and `src` from the anonymous function Rename refers to the same parameters from the `files` entry.

```js
grunt.initConfig({
  copy: {
    rename: {
      files: [{ 
          expand: true, 
          cwd: 'tmp', 
          src: ['**/*.js'], 
          dest: 'tmp/copy_rename',
          // The 'dest' and 'src' values are passed into the function
          rename: function(dest, src) {
            // The 'src' is being renamed; the 'dest' remains the same
            return dest + "/" + src.replace(".js", "-dbg.js");
          }
      }]
    }
  }
});
```

#### Copy and rename using regular expression
In this example, there's a need not only for a copy, but renaming the copied files also. The content from directory `tmp` it is copied to the following subdirectory `tmp/copy_rename_regex`, and files ending with `.js`, `.xml`, `.css`, `.html` will have the suffix `-dbg` added before the file extension using a regular expression on the replace function.

```js
grunt.initConfig({
  copy: {
    renameWithRegex: {
      files: [{ 
          expand: true, 
          cwd: 'tmp', 
          src: ['**/*.js', '**/*.xml', '*.css', '*.html'], 
          dest: 'tmp/copy_rename_regex',
          // The 'dest' and 'src' values are passed into the function
          rename: function(dest, src) {
            // The 'src' is being renamed; the 'dest' remains the same
            return dest + '/' + src.replace(/(\.js|\.xml|\.css|\.html)/, "-dbg$1");
          }
      }]
    }
}
});
```

#### Copy files and compress (minify)
In this example, it is necessary to minify every file copied under extension `.js` from `tmp` to subdirectory `tmp/copy_compress`. The module used for file compression is [UglifyJS](https://www.npmjs.com/package/uglify-es), and it is available for compression file extensions `.js`, `.xml`, `.json`, `.css`, `.sql`. 

```js
grunt.initConfig({
  copy: {
    compress: {
      options: {
        compression: true,
      },
      files: [
        { expand: true, cwd: 'tmp', src: ['**/*.js'], dest: 'tmp/copy_compress' }
      ]}
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2018-06-03  v0.1.1  First official release for Grunt 0.4.0.