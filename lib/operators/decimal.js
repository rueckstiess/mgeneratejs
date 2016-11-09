/* eslint new-cap: 0 */
var _ = require('lodash');
var chance = require('chance').Chance();
var bson = require('bson');

// var debug = require('debug')('mgenerate:objectid');

/**
 * decimal returns a BSON Decimal128.
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                Decimal128 value
 */

module.exports = function(evaluator, options) {
  // default options
  options = evaluator(_.defaults(options, {
    min: 0,
    max: 1000,
    fixed: 2
  }));
  return bson.Decimal128.fromString(String(chance.floating({
    min: options.min, max: options.max, fixed: options.fixed
  })));
};
