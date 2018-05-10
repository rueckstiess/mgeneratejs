var _ = require('lodash');
var chance = require('chance')();
// var debug = require('debug')('mgenerate:array');

/**
 * $pickset operator takes an array and an `quantity` number and returns an
 * array of length n containing unique values of the input array. If the number is
 * larger than the length of the array, return `$missing` instead, which will
 * remove the key from the resulting document.
 *
 * @example Returns a set of ["blue", "red"]
 *
 * {"color": {"$pickset": {"array": ["green", "red", "blue"], "quantity": 2}}}
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                array of `quantity` elements
 */
module.exports = function(evaluator, options) {
  var replacement;

  // default returns one element
  options = evaluator(_.defaults(options, {
    quantity: 1
  }));

  if (_.isArray(options.array) && _.isInteger(options.quantity) &&
  options.quantity >= 0 && options.quantity <= options.array.length) {
    replacement = chance.pickset(options.array, options.quantity);
  } else {
    replacement = '$missing';
  }

  return evaluator(replacement, true);
};
