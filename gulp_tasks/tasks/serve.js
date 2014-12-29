'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
//var webserver = $.webserver;
var browserSync = require('browser-sync');
//var openBrowser = require('open');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var chalk = require('chalk');
var gmux = require('gulp-mux');
var exec = require('child_process').exec;
var constants = require('../common/constants')();
var helper = require('../common/helper');

var taskBrowsersyncstart = function(constants) {
    var dest = constants.dist.distFolder;
    dest = helper.isMobile(constants) ? dest + '/www' : dest;

    var config = {
        files: [dest + '/index.html', dest + '/scripts/bundle.js', dest + '/styles/main.css'],
        tunnel: constants.serve.localtunnel,
        server: {
            baseDir: dest,
            middleware: [
                function(req, res, next) {
                    //console.log("Hi from middleware");
                    next();
                }
            ]
        },
        host: constants.serve.host,
        port: constants.serve.port,
        logLevel: 'info', // info, debug , silent
        open: constants.serve.open,
        browser: constants.serve.browser, //['google chrome'], // ['google chrome', 'firefox'],
        notify: true,
        logConnections: false
    };

    browserSync(config);

    var platform = global.options.platform || constants.cordova.platform;
    if(helper.isMobile(constants)) {
        gutil.log('Launching ' + platform + ' emulator');
        exec('ionic emulate ' + platform + ' --livereload', {
            cwd: constants.dist.distFolder
        }, helper.execHandler);
    }
};

var taskBrowsersync = function(constants) {
    runSequence(
        ['watchify', 'style', 'style:watch', 'image', 'html', 'html:watch'],
        'browsersyncstart'
    );
};

gulp.task('browsersyncstart', false, function() {
    var taskname = 'browsersyncstart';
    gmux.targets.setClientFolder(constants.clientFolder);
    if(global.options === null) {
        global.options = gmux.targets.askForSingleTarget(taskname);
    }
    return gmux.createAndRunTasks(gulp, taskBrowsersyncstart, taskname, global.options.target, global.options.mode, constants);
});

gulp.task('browsersync', 'Launches a browserSync server.', function() {
    var taskname = 'browsersync';
    gmux.targets.setClientFolder(constants.clientFolder);
    if(global.options === null) {
        global.options = gmux.targets.askForSingleTarget(taskname);
    }
    return gmux.createAndRunTasks(gulp, taskBrowsersync, taskname, global.options.target, global.options.mode, constants);
});

var taskCordovaRun = function(constants) {
    if(!helper.isMobile(constants)) {
        gutil.log(chalk.red('Error: ' + chalk.bold(constants.targetName) + ' is not a cordova application'));
        return;
    }
    var platform = global.options.platform || constants.cordova.platform;
    gutil.log('ionic run ' + platform);
    exec('ionic run ' + platform, {
        cwd: constants.dist.distFolder
    }, helper.execHandler);
};

gulp.task('cordova:run', 'Execute cordova run', function() {
    var taskname = 'cordova:run';
    gmux.targets.setClientFolder(constants.clientFolder);
    if(global.options === null) {
        global.options = gmux.targets.askForSingleTarget(taskname);
    }
    return gmux.createAndRunTasks(gulp, taskCordovaRun, taskname, global.options.target, global.options.mode, constants);

});

gulp.task('bowersync', false, function() {
    gutil.log(chalk.red('\n', 'Task \'bowersync\' is not in your gulpfile.'), '\n', chalk.red('Did you mean this?'), '\n', chalk.yellow('gulp browsersync'), '\n');
});
