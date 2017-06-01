var gulp = require('gulp');

var ts = require('gulp-typescript');
var sass = require('gulp-sass');

var merge = require('merge2');

var spawn = require('child_process').spawn;
var node;

/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', ['build'], function() {
  if (node)
    node.kill()

  node = spawn('node', ['bin/startup.js'], {stdio: 'inherit'})

  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
})

var tsProject = ts.createProject('src/tsconfig.json');

gulp.task('build-typescript', function() {
    var tsResult = gulp.src('src/**/*.ts', {base: 'src'})
        .pipe(tsProject());

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done.
        tsResult.dts.pipe(gulp.dest('dist')),
        tsResult.js.pipe(gulp.dest('dist'))
    ]);
});

gulp.task('build-sass', function() {
    return gulp.src('src/**/*.scss', {base: 'src'})
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['build-typescript', 'build-sass'], function() {
    var systemResult = gulp.src('system/*', {base: 'system'});
    var fileResult = gulp.src('src/**/*.{html,css}', {base: 'src'});

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done.
        systemResult.pipe(gulp.dest('dist/client')),
        fileResult.pipe(gulp.dest('dist'))
    ]);
});

gulp.task('watch', ['build', 'server'], function() {
    gulp.watch('src/**/*.{ts,html,css,scss}', ['build', 'server']);
});

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node)
      node.kill()
})
