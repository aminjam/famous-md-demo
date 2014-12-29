'use strict';
var controllername = 'bottomSheetCtrl';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = [];

    function controller() {
        var vm = this;
        vm.items = [{
            name: 'Hangout',
            icon: 'hangout'
        }, {
            name: 'Mail',
            icon: 'mail'
        }, {
            name: 'Message',
            icon: 'message'
        }, {
            name: 'Copy',
            icon: 'copy'
        }, {
            name: 'Facebook',
            icon: 'facebook'
        }, {
            name: 'Twitter',
            icon: 'twitter'
        }];
        var activate = function() {

        };
        activate();
    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};