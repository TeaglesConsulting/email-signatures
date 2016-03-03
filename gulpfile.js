//
//
//

var browserSync = require('browser-sync').create()

var gulp = require('gulp')
var plug = require('gulp-load-plugins')({ lazy: true })
var inky = require('inky')

var builders = []
var signatures = require('./src/signatures.json')
signatures.forEach(function(signature) {
  builders.push(function() {
    return gulp
      .src(['tmp/build/**/*.htm'])
      .pipe(plug.compileHandlebars(signature))
      .pipe(gulp.dest('dist/' + signature.email))
  })
})

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

function deploySignatures() {
  console.log('starting deploy')
  return gulp.src('dist/**/*')
    .pipe(plug.debug())
    .pipe(plug.ghPages())
}

gulp.task('build',  gulp.series(build, gulp.parallel.apply(gulp, builders)))
gulp.task('serve',  gulp.series(build, gulp.parallel.apply(gulp, builders), gulp.parallel(startLocalhost, watch)))
gulp.task('deploy', gulp.series(build, gulp.parallel.apply(gulp, builders), deploySignatures))