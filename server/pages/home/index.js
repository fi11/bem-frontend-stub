var bemjson = require('./bemjson');
var render = require('bh-bundle')('server/pages.bundle.json');

exports.index = function *() {
    this.body = render(bemjson, {});
};
