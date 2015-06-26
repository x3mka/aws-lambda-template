var common = require('./lib/common.js');

exports.handler = function(event, context) {
    var res = common.run('function2');
    context.done(null, res);
}
