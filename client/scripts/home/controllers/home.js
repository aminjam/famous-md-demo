'use strict';
var controllername = 'home';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = ['$famous', '$mdBottomSheet'];

    function controller($famous, $mdBottomSheet) {
        var vm = this;
        vm.openBottomSheet = function() {
            $mdBottomSheet.show({
                template: require('../views/bottomSheet.html'),
                controller: app.name + '.bottomSheetCtrl',
                controllerAs: 'vm'
            });
        };
        var activate = function() {

        };
        activate();
    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};