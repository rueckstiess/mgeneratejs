var _ = require('lodash');

// var debug = require('debug')('mgenerate:array');

module.exports = function(evaluator, options) {
  var item = options.of;
  var number = evaluator(options.number);
  var replacement = _.map(_.range(number), function() {
    return item;
  });
  var result = evaluator(replacement);
  return result;
};
