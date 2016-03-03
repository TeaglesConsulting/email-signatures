//
//
//

var browserSync = require('browser-sync').create()

var gulp = require('gulp')
var plug = require('gulp-load-plugins')({ lazy: true })
var inky = require('inky')

var signatures = require('./src/signatures.json')
var builders = []
for (var i = 0; i < signatures.length; i++) {
  var signature = signatures[i]
  builders.push(function compileTemplate() {
    return gulp
      .src(['tmp/build/**/*.htm'])
      .pipe(plug.compileHandlebars(signature))
      .pipe(gulp.dest('dist/' + signature.email))
  })
}

gulp.task('build', gulp.series(build, gulp.parallel.apply(this, builders)))
gulp.task('serve', gulp.series(build, gulp.parallel.apply(this, builders), gulp.parallel(startLocalhost, watch)))

gulp.task('deploy', gulp.series(build, gulp.parallel.apply(this, builders)), deploy)

const inkyOpts = {}
function build() {
  return gulp.src(['src/**/*.htm'])
    .pipe(plug.inlineImageHtml('src'))
    .pipe(inky(inkyOpts))
    .pipe(gulp.dest('tmp/build'))
}

function watch() {
  gulp.watch(['src/**/*.htm'], build)
}

function startLocalhost() {
  return browserSync.init(null, {
    files: ['dist/**'],
    server: {
      baseDir: 'dist',
      index: 'signature.htm'
    }
  })
}

function deploy() {
  return gulp.src('./dist/**/*')
    .pipe(plug.ghPages());
}