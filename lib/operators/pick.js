var _ = require('lodash');
// var debug = require('debug')('mgenerate:array');

/**
 * $pick operator takes an array and an `element` number and returns the
 * element-th value of the array. if the number is larger than the length of
 * the array, return `$missing` instead, which will remove the key from the
 * resulting document. `element` is zero-based (`0` returns the first element).
 *
 * @example Returns the string "red"
 *
 * {"color": {"$pick": {"array": ["green", "red", "blue"], "element": 1}}}
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                array of `number` elements
 */
module.exports = function(evaluator, options) {
  var replacement;
  // evaluate options object first before picking
  options = evaluator(_.defaults(options, {
    element: 0
  }));
  if (_.isArray(options.array) && _.isInteger(options.element) &&
  options.element >= 0 && options.element < options.array.length) {
    replacement = options.array[options.element];
  } else {
    replacement = '$missing';
  }
  return evaluator(replacement, true);
};
