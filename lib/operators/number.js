var _ = require('lodash');

// var debug = require('debug')('mgenerate:number');

module.exports = function(evaluator, options) {
  options = evaluator(options, false);
  var replacement = {'$integer': options};
  return evaluator(replacement, true);
};
