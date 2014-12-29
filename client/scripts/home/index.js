'use strict';
require('angular-ui-router');
require('angular-ionic');
require('famous-angular');
require('ngCordova');
require('ngMaterial');

var modulename = 'home';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;

    var angular = require('angular');
    var app = angular.module(fullname, [
        'ui.router', 'ionic', 'famous.angular',
        'ngCordova', 'ngMaterial'
    ]);
    // inject:folders start
    require('./controllers')(app);

    // inject:folders end

    app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider.state('home', {
                url: '/',
                template: require('./views/home.html'),
                controller: fullname + '.home',
                controllerAs: 'vm'
            });
        }
    ]);

    return app;
};