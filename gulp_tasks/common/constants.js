'use strict';

var path = require('path');

module.exports = function() {
    var cwd = process.env.INIT_CWD || '';
    var clientFolder = 'client'; // the source file folder
    var defaultTarget = 'app'; // the name of the app that corresponds to index.html
    var constants = {
        appname: 'famous-md-demo',
        cwd: cwd,
        defaultTarget: defaultTarget,
        targetName: '{{targetName}}',
        targetSuffix: '{{targetSuffix}}',
        mode: '{{mode}}',
        clientFolder: clientFolder,
        repository: 'https://github.com/user/repo',
        versionFiles: ['./package.json', './bower.json', './' + clientFolder + '/config*.xml'],
        growly: {
            notify: false,
            successIcon: path.join(cwd, 'node_modules/karma-growl-reporter/images/success.png'),
            failedIcon: path.join(cwd, 'node_modules/karma-growl-reporter/images/failed.png')
        },
        cordova: {
            src: './' + clientFolder + '/cordova/{{targetName}}',
            icon: './' + clientFolder + '/icons/{{targetName}}/icon.png',
            platform: 'ios',
            iconBackground: '#3D4860'
        },
        lint: [
            './' + clientFolder + '/scripts/*/**/*.js',
            '!./' + clientFolder + '/scripts/bundle*.js',
            './server/**/*.js', 'gulpfile.js', './gulp_tasks/**/*.js', 'karam.conf.js', './test/**/*.js'
        ],
        fonts: {
            src: ['./bower_components/ionic/release/fonts/*.*'], // you can also add a specific src_appname
            dest: 'fonts'
        },
        html: {
            src: './' + clientFolder + '/index{{targetSuffix}}.html'
        },
        images: {
            src: [
                './' + clientFolder + '/images/{{targetName}}/**/*', './' + clientFolder + '/images/*.*',
                './' + clientFolder + '/icons/{{targetName}}/**/*', './' + clientFolder + '/icons/*.*'
            ]
        },
        style: {
            src: [
                './' + clientFolder + '/styles/main{{targetSuffix}}.scss'
            ],
            dest: 'styles',
            destName: 'main.css',
            sass: {
                src: ['./' + clientFolder + '/styles/main{{targetSuffix}}.scss']
            },
            css: {
                src: ['./bower_components/famous-angular/dist/famous-angular.css',
                        './bower_components/angular-material/angular-material.min.css',
                        './bower_components/angular-material/themes/cyan-theme.css'
                    ] // you can also add a specific src_appname
            }
        },

        browserify: {
            src: './' + clientFolder + '/scripts/main{{targetSuffix}}.js',
            dest: 'scripts',
            bundleName: 'bundle.js'
        },

        serve: {
            host: 'localhost', //'0.0.0.0',
            port: 5000,
            open: true,
            browser: ['google chrome'], // ['google chrome', 'firefox'],
            localtunnel: false // true, false or 'famous-md-demo'
        },
        mocha: {
            libs: ['server/**/*.js'],
            tests: ['test/mocha/**/*.js'],
            globals: 'test/mocha/helpers/globals.js',
            timeout: 5000
        },
        dist: {
            distFolder: './dist/{{targetName}}/{{mode}}'
        }
    };

    return constants;
};