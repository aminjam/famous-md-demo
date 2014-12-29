'use strict';

module.exports = function(app) {
    // inject:start
    require('./bottomSheetCtrl')(app);
    require('./home')(app);
    // inject:end
};