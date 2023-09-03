var _ = require('lodash');
var chance = require('chance').Chance();

// var debug = require('debug')('mgenerate:array');

/**
 * $maxcard operator limits the cardinality of the generated values to a certain
 * ceiling. Requires options `value` and `max`.
 *
 * @example Creates 5 random numbers between 0 and 100 and uniformly samples from them.
 *
 * {"cities": {"$maxCard": {"value": {"$integer": {min: 0, max: 100}}, "max": 5}}}
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                random values, cardinality capped at options.max
 */

var valueSet = new Set();

module.exports = function(evaluator, options, globalState) {
  if (!_.has(globalState, 'maxCardSet')) {
    globalState.maxCardSet = new Set();
  }
  var maxNumber = evaluator(options.max, true);
  if (globalState.maxCardSet.size >= maxNumber) {
    // return a random element from the set
    return chance.pickone(Array.from(globalState.maxCardSet));
  } else {
    value = evaluator(options.value, true);
    globalState.maxCardSet.add(value);
    return value;
  }
};
