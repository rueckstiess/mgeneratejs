var _ = require('lodash');

// var debug = require('debug')('mgenerate:number');

module.exports = function(evaluator, options) {
  options = _.mapValues(options, evaluator);
  var replacement = {'$integer': options};
  return evaluator(replacement);
};
