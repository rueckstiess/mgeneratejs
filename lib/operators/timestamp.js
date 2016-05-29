/* eslint new-cap: 0 */
var _ = require('lodash');
var chance = require('chance').Chance();
var bson = require('bson');

// var debug = require('debug')('mgenerate:objectid');

/**
 * $minkey returns a BSON MinKey.
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                array of `number` elements
 */

var MAX_TS = Math.pow(2, 31) - 1;

module.exports = function(evaluator, options) {
  // default options
  options = evaluator(_.defaults(options, {
    t: chance.integer({min: 0, max: MAX_TS}),
    i: chance.integer({min: 0, max: MAX_TS})
  }));
  return bson.Timestamp(options.t, options.i);
};
