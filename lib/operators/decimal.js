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

  var getnum = function() {
    return String(chance.floating({
      min: options.min, max: options.max, fixed: options.fixed
    }))
  }

  var num = getnum();

  // Ensure that fixed decimal value contains no trailing zeroes
  if(options.fixed > 0 && options.min < options.max) {
    while(num.match(/\.\d+$/)[0].length < options.fixed + 1) {
      num = getnum();
    }
  }

  return bson.Decimal128.fromString(num);
};
