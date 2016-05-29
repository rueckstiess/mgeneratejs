/* eslint new-cap: 0 */
var bson = require('bson');
var chance = require('chance').Chance();
var _ = require('lodash');

// var debug = require('debug')('mgenerate:objectid');

/**
 * $binary returns a MongoDB Binary value.
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                array of `number` elements
 */
module.exports = function(evaluator, options) {
  // default options
  options = evaluator(_.defaults(options, {
    length: 10,
    subtype: 0
  }));
  return bson.Binary(chance.string({length: options.length}), options.subtype);
};
