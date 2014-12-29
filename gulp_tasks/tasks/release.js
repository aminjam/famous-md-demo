'use strict';

var _ = require('lodash');
var path = require('path');
var gulp = require('gulp');
var args = require('yargs').argv;
var $ = require('gulp-load-plugins')();
var exec = require('child_process').exec;
var fs = require('fs');
var stripJsonComments = require('strip-json-comments');
var bump = $.bump;
var tap = $.tap;
var XML = require('node-jsxml').XML;
var streamqueue = require('streamqueue');
var git = $.git;
var gulpif = $.
if;
var constants = require('../common/constants')();

var readTextFile = function(filename) {
    var body = fs.readFileSync(filename, 'utf8');
    return body;
};

var readJsonFile = function(filename) {
    var body = readTextFile(filename);
    return JSON.parse(stripJsonComments(body));
};

var filterFiles = function(files, extension) {
    return _.filter(files, function(file) {
        return path.extname(file) === extension;
    });
};

/**
 * Bumps any version in the constants.versionFiles
 *
 * USAGE:
 * gulp bump --minor (or --major or --prerelease or --patch which is the default)
 * - or -
 * gulp bump --ver=1.2.3
 * @returns {void}
 */
gulp.task('bump', false, function() {
    var bumpType = 'patch';
    // major.minor.patch
    if(args.patch) {
        bumpType = 'patch';
    }
    if(args.minor) {
        bumpType = 'minor';
    }
    if(args.major) {
        bumpType = 'major';
    }
    if(args.prerelease) {
        bumpType = 'prerelease';
    }
    bumpType = process.env.BUMP || bumpType;

    var version;
    var srcjson = filterFiles(constants.versionFiles, '.json');
    var srcxml = filterFiles(constants.versionFiles, '.xml');

    // preparing the queue for bumping json and then xml files
    var stream = streamqueue({
        objectMode: true
    });

    // first we bump the json files
    stream.queue(gulp.src(srcjson)
        .pipe(gulpif(args.ver !== undefined, bump({
            version: args.ver
        }), bump({
            type: bumpType
        })))
        .pipe(tap(function(file) {
            if(!version) {
                var json = JSON.parse(String(file.contents));
                version = json.version;
            }
        }))
        .pipe(gulp.dest('./')));

    // then after we have the correct value for version, we take care of the xml files
    if(srcxml.length > 0) {
        stream.queue(gulp.src(srcxml)
            .pipe(tap(function(file) {
                var xml = new XML(String(file.contents));
                xml.attribute('version').setValue(version);
                file.contents = Buffer.concat([new Buffer(xml.toXMLString())]);
            }))
            .pipe(gulp.dest('./' + constants.clientFolder)));
    }
    return stream.done();

});

gulp.task('commit', false, ['bump'], function() {
    var pkg = readJsonFile('./package.json');
    var message = 'docs(changelog): version ' + pkg.version;
    return gulp.src(constants.versionFiles)
        .pipe(git.add({
            args: '.'
        }))
        .pipe(git.commit(message));
});

gulp.task('tag', false, ['commit'], function() {
    var pkg = readJsonFile('./package.json');
    var v = 'v' + pkg.version;
    var message = pkg.version;
    git.tag(v, message, function(err) {
        if(err) {
            throw new Error(err);
        }
    });
});

gulp.task('push', false, ['tag'], function() {
    exec('git push origin master  && git push origin master --tags', function(err) {
        if(err) {
            throw new Error(err);
        }
    });
});

// gulp.task('npm', ['push'], function(done) {
//     spawm('npm', ['publish'], {
//         stdio: 'inherit'
//     }).on('close', done);
// });

gulp.task('release', 'Publish a new release version.', ['push']);