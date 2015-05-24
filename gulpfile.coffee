# Load plugins
gulp = require 'gulp'
p = require('gulp-load-plugins')( camelize: true )
pg = require './package.json'
source = require 'vinyl-source-stream'
buffer = require 'vinyl-buffer'
browserify = require 'browserify'


gulp.task 'browserify', ->
  browserify
      entries: [ 'src/script.coffee' ]
      extensions: ['.coffee']
      transform: ['coffeeify', 'debowerify']
      debug: true
    .bundle()
    .pipe source 'script.js'
    .pipe buffer()
    .pipe gulp.dest 'build'

gulp.task 'browserify-release', ->
  browserify
      entries: [ 'src/script.coffee' ]
      extensions: ['.coffee']
      transform: ['coffeeify', 'debowerify']
      debug: true
    .bundle()
    .pipe source 'script.js'
    .pipe buffer()
    .pipe p.sourcemaps.init
      loadMaps: true
    .pipe p.uglify()
    .pipe p.sourcemaps.write()
    .pipe gulp.dest 'build'


gulp.task 'copy', ->
  gulp.src [
      'bower_components/jquery/dist/jquery.min.js'
    ]
    .pipe gulp.dest 'src/lib'

gulp.task 'manifest', ->
  gulp.src 'src/manifest.json'
    .pipe p.jsonEditor { version: pg.version }
    .pipe gulp.dest 'build/'


gulp.task 'zip', ->
  gulp.src 'build/**/*'
    .pipe p.zip "trello-mail-#{pg.version}.zip"
    .pipe gulp.dest './'

gulp.task 'clean', ->
  gulp.src 'build/**/*'
    .pipe p.zip "trello-mail-#{pg.version}.zip"
    .pipe gulp.dest 'build'


gulp.task 'default', ['build']

gulp.task 'build', ['manifest', 'browserify']

gulp.task 'release', ['manifest', 'browserify-release', 'zip']

gulp.task 'watch', ->
  gulp.watch 'src/**/*.coffee', ['browserify']

