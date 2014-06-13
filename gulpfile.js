var path = require('path');
var gulp = require('gulp');

var shell = require('gulp-shell');
var serveBundle = require('gulp-serve-bundle');
var nodemon = require('gulp-nodemon');

var env = {
    DEBUG: 'info',
    NODE_ENV: 'development'
};

gulp.task('serve-bundle', ['enb'], serveBundle({
    name: 'pages',
    files: ['pages.min.css', 'pages.min.js'],
    staticDir: 'static',
    bhFile: 'pages.server.bh.js',
    outputDir: 'server'
}));

gulp.task('enb', shell.task('./node_modules/enb/bin/enb make'));

gulp.task('server', ['watch'],function () {
  nodemon({
      script: 'server/worker.js',
      watch: ['server/'],
      ext: 'js json',
      nodeArgs: ['--harmony-generators'],
      env: env,
      stdout: true,
      stderr: true
  });
});

gulp.task('watch', ['build'], function() {
    gulp.watch(['blocks/*', 'blocks/*/*', 'bundle/*/*.bemdecl.js'], ['build']);
});

gulp.task('build', ['serve-bundle']);

