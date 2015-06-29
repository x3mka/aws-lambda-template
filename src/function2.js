// Config options usage example
var config = require('config').get('functions.function2.configOptions');

exports.handler = function(event, context) {
    context.done(null, config.prop);
}
