'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var rename = $.rename;
var del = require('del');
var exec = require('child_process').exec;
var gutil = require('gulp-util');
var gmux = require('gulp-mux');
var runSequence = require('run-sequence');
var constants = require('../common/constants')();
var helper = require('../common/helper');
var fs = require('fs');

var taskClean = function(constants) {
    del([constants.dist.distFolder]);
};

gulp.task('clean', 'Clean distribution folder.', function(done) {
    var taskname = 'clean';
    gmux.targets.setClientFolder(constants.clientFolder);
    if(global.options === null) {
        global.options = gmux.targets.askForMultipleTargets(taskname);
    }
    return gmux.createAndRunTasks(gulp, taskClean, taskname, global.options.target, global.options.mode, constants, done);
});

var taskHtml = function(constants) {

    var dest = constants.dist.distFolder;
    dest = helper.isMobile(constants) ? dest + '/www' : dest;

    gulp.src(constants.html.src)
        .pipe(rename('index.html'))
        .pipe(gulp.dest(dest));

    gulp.src('./' + constants.clientFolder + '/404' + constants.targetSuffix + '.html')
        .pipe(rename('404.html'))
        .pipe(gulp.dest(dest));

    gulp.src('./' + constants.clientFolder + '/favicon' + constants.targetSuffix + '.ico')
        .pipe(rename('favicon.ico'))
        .pipe(gulp.dest(dest));

    gulp.src('./' + constants.clientFolder + '/robots' + constants.targetSuffix + '.txt')
        .pipe(rename('robots.txt'))
        .pipe(gulp.dest(dest));

    gulp.src('./' + constants.clientFolder + '/apple-touch-icon' + constants.targetSuffix + '.png')
        .pipe(rename('apple-touch-icon.png'))
        .pipe(gulp.dest(dest));

    gulp.src('./' + constants.clientFolder + '/config' + constants.targetSuffix + '.xml')
        .pipe(rename('config.xml'))
        .pipe(gulp.dest(constants.dist.distFolder));

    gulp.src(constants.cordova.src + '/hooks/**/*.*')
        .pipe(gulp.dest(constants.dist.distFolder + '/hooks'));
};

var taskImage = function(constants) {
    var dest = constants.dist.distFolder;
    dest = helper.isMobile(constants) ? dest + '/www' : dest;

    gulp.src(constants.images.src, {
            base: constants.clientFolder
        })
        .pipe(gulp.dest(dest));

};

var taskImageCordova = function(constants) {
    if(helper.isMobile(constants)) {
        if(fs.existsSync(constants.dist.distFolder + '/platforms/ios')) {
            gulp.src(constants.cordova.src + '/resources/ios/icons/**/*')
                .pipe(gulp.dest(constants.dist.distFolder + '/platforms/ios/' + constants.appname + '/Resources/icons'));

            gulp.src(constants.cordova.src + '/resources/ios/splash/**/*')
                .pipe(gulp.dest(constants.dist.distFolder + '/platforms/ios/' + constants.appname + '/Resources/splash'));
        }
        if(fs.existsSync(constants.dist.distFolder + '/platforms/android')) {
            gulp.src(constants.cordova.src + '/resources/android/**/*')
                .pipe(gulp.dest(constants.dist.distFolder + '/platforms/android/res'));
        }
    }
};

gulp.task('html', false, function() {
    var taskname = 'html';
    gmux.targets.setClientFolder(constants.clientFolder);
    if(global.options === null) {
        global.options = gmux.targets.askForMultipleTargets(taskname);
    }
    return gmux.createAndRunTasks(gulp, taskHtml, taskname, global.options.target, global.options.mode, constants);
});

var taskHtmlWatch = function(constants) {
    gulp.watch(constants.html.src, ['html']);
};

gulp.task('html:watch', false, function() {

    var taskname = 'html:watch';
    gmux.targets.setClientFolder(constants.clientFolder);
    if(global.options === null) {
        global.options = gmux.targets.askForSingleTarget(taskname);
    }
    gmux.createAndRunTasks(gulp, taskHtmlWatch, taskname, global.options.target, global.options.mode, constants);
});

gulp.task('image', false, ['image:cordova'], function() {
    var taskname = 'image';
    gmux.targets.setClientFolder(constants.clientFolder);
    if(global.options === null) {
        global.options = gmux.targets.askForMultipleTargets(taskname);
    }
    return gmux.createAndRunTasks(gulp, taskImage, taskname, global.options.target, global.options.mode, constants);
});

gulp.task('image:cordova', false, function() {
    // this task copy the cordova icons and splashes to dist, but only if the platforms exist
    var taskname = 'image:cordova';
    gmux.targets.setClientFolder(constants.clientFolder);
    if(global.options === null) {
        global.options = gmux.targets.askForMultipleTargets(taskname);
    }
    return gmux.createAndRunTasks(gulp, taskImageCordova, taskname, global.options.target, global.options.mode, constants);
});

var taskCordovaIcon = function(constants) {
    if(!helper.isMobile(constants)) {
        return;
    }
    exec('./bin/cordova-generate-icons ' + constants.cordova.icon + ' ' + constants.cordova.src, helper.execHandler);
    exec('./bin/cordova-generate-splashes ' + constants.cordova.icon + ' "' + constants.cordova.iconBackground + '" ' + constants.cordova.src, helper.execHandler);
};

gulp.task('cordova:icon', 'Generate the cordova icons and splashes.', function() {
    var taskname = 'cordova:icon';
    gmux.targets.setClientFolder(constants.clientFolder);
    if(global.options === null) {
        global.options = gmux.targets.askForMultipleTargets(taskname);
    }
    return gmux.createAndRunTasks(gulp, taskCordovaIcon, taskname, global.options.target, global.options.mode, constants);
});

gulp.task('dist', 'Distribute the application.', function(done) {
    return runSequence('html', 'image', 'browserify', 'style', done);
});

gulp.task('clean:all', 'Clean distribution folder for all targets and modes.', function() {
    var taskname = 'clean:all';
    gmux.targets.setClientFolder(constants.clientFolder);
    var targets = gmux.targets.getAllTargets();
    gmux.createAndRunTasks(gulp, taskClean, taskname, targets, 'dev', constants);
    gmux.createAndRunTasks(gulp, taskClean, taskname, targets, 'prod', constants);
});
