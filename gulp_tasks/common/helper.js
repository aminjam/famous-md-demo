'use strict';

var fs = require('fs');
var gutil = require('gulp-util');
var chalk = require('chalk');

/**
 * Returns true if the target application is mobile
 * It checks the presence of a cordova config file
 * @param  {Object}  constants - The constants
 * @returns {Boolean} - True if the target app is mobile, false otherwise
 */
var isMobile = exports.isMobile = function(constants) {
    return fs.existsSync('./' + constants.clientFolder + '/config' + constants.targetSuffix + '.xml');
};

/**
 * A generic handler for require('child_process').exec
 * @param  {Object} err - The error object
 * @param  {String} stdout - The stdout string
 * @param  {String} stderr - The stderr string
 */
var execHandler = exports.execHandler = function(err, stdout, stderr) {
    if(err) {
        throw err;
    }
    if(stdout) {
        gutil.log(stdout);
    }
    if(stderr) {
        gutil.log(chalk.red('Error: ') + stderr);
    }
};
