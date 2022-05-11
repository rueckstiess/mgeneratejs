/* eslint new-cap: 0 */
var _ = require('lodash');
var chance = require('chance').Chance();

// var debug = require('debug')('mgenerate:integer');

/**
 * decimal returns a 32-bit integer.
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                Int32 value
 */

var MAX_VAL = Math.pow(2, 31);

module.exports = function(evaluator, options) {
  // default options
  options = evaluator(
    _.defaults(options, {
      min: -MAX_VAL,
      max: MAX_VAL
    })
  );
  return chance.integer({
    min: options.min,
    max: options.max
  });
};
