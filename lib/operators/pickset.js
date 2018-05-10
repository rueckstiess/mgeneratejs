var _ = require('lodash');
var chance = require('chance')();
// var debug = require('debug')('mgenerate:array');

/**
 * $pickset operator takes an array and an `element` number and returns an
 * array of length n containing unique values of the input array. If the number is
 * larger than the length of the array, return `$missing` instead, which will
 * remove the key from the resulting document.
 *
 * @example Returns a set of ["blue", "red"]
 *
 * {"color": {"$pickset": {"array": ["green", "red", "blue"], "element": 2}}}
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                array of `number` elements
 */
module.exports = function(evaluator, options) {
  var replacement;

  // default returns one element
  options = evaluator(_.defaults(options, {
    element: 1
  }));

  if (_.isArray(options.array) && _.isInteger(options.element) &&
  options.element >= 0 && options.element <= options.array.length) {
    replacement = chance.pickset(options.array, options.element);
  } else {
    replacement = '$missing';
  }

  return evaluator(replacement, true);
};
