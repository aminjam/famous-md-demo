'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var es = require('event-stream');
var sass = $.sass;
//var sourcemaps = $.sourcemaps;
var autoprefixer = $.autoprefixer;
var rename = $.rename;
var concat = $.concat;
var size = $.size;
var minifycss = require('gulp-minify-css');
var gulpif = require('gulp-if');
var constants = require('../common/constants')();
var helper = require('../common/helper');
var gmux = require('gulp-mux');

var taskFont = function(constants) {

    var dest = constants.dist.distFolder;
    dest = helper.isMobile(constants) ? dest + '/www/' + constants.fonts.dest : dest + '/' + constants.fonts.dest;

    var srcFont = constants.fonts['src_' + constants.targetName];
    if(!srcFont) {
        srcFont = constants.fonts.src;
    }
    return gulp.src(srcFont)
        .pipe(gulp.dest(dest))
        .pipe($.size({
            title: 'font:' + constants.targetName
        }));
};

gulp.task('font', 'Copy fonts.', function(done) {
    var taskname = 'font';
    gmux.targets.setClientFolder(constants.clientFolder);
    if(global.options === null) {
        global.options = gmux.targets.askForMultipleTargets(taskname);
    }
    return gmux.createAndRunTasks(gulp, taskFont, taskname, global.options.target, global.options.mode, constants, done);
});

var taskStyle = function(constants) {
    var dest = constants.dist.distFolder;
    dest = helper.isMobile(constants) ? dest + '/www/' + constants.style.dest : dest + '/' + constants.style.dest;

    var sassFiles = gulp.src(constants.style.sass.src)
        //.pipe(sourcemaps.init())
        .pipe(sass());
    //.pipe(sourcemaps.write());

    var srcCss = constants.style.css['src_' + constants.targetName];
    if(!srcCss) {
        srcCss = constants.style.css.src;
    }
    var cssFiles = gulp.src(srcCss);

    return es.concat(cssFiles, sassFiles)
        //.pipe(sourcemaps.init({
        //    loadMaps: true
        //}))
        .pipe(concat(constants.style.destName))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        //.pipe(sourcemaps.write())
        .pipe(gulpif(constants.mode === 'prod', minifycss()))
        .pipe(gulp.dest(dest))
        .pipe($.size({
            title: 'css files',
            showFiles: true
        }));
    /*
    .pipe(minifycss())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe($.size())
    .pipe(gulp.dest(constants.style.dest))
    .pipe(size({
        title: 'css files:' + constants.targetName,
        showFiles: true
    }));
    */
};

gulp.task('style', 'Generates a bundle for style files.', ['font'], function() {
    var taskname = 'style';
    gmux.targets.setClientFolder(constants.clientFolder);
    if(global.options === null) {
        global.options = gmux.targets.askForMultipleTargets(taskname);
    }
    gmux.createAndRunTasks(gulp, taskStyle, taskname, global.options.target, global.options.mode, constants);
});

var taskStyleWatch = function(constants) {
    gulp.watch(constants.style.src, ['style']);
};

gulp.task('style:watch', 'Watch changes for style files.', function() {

    var taskname = 'style:watch';
    gmux.targets.setClientFolder(constants.clientFolder);
    if(global.options === null) {
        global.options = gmux.targets.askForSingleTarget(taskname);
    }
    gmux.createAndRunTasks(gulp, taskStyleWatch, taskname, global.options.target, global.options.mode, constants);
});
