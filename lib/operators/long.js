/* eslint new-cap: 0 */
var _ = require('lodash');
var chance = require('chance').Chance();
var bson = require('bson');

// var debug = require('debug')('mgenerate:long');

/**
 * decimal returns a BSON Long.
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                Int64 value (technically only -2^53 to 2^53)
 */

// biggest number in Javascript
var MAX_VAL = Math.pow(2, 53);

module.exports = function(evaluator, options) {
  // default options
  options = evaluator(
    _.defaults(options, {
      min: -MAX_VAL,
      max: MAX_VAL
    })
  );
  return bson.Long.fromString(
    String(
      chance.integer({
        min: options.min,
        max: options.max
      })
    )
  );
};
