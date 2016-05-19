/* eslint new-cap: 0 */
var bson = require('bson');

// var debug = require('debug')('mgenerate:objectid');

/**
 * $minkey returns a BSON MinKey.
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                array of `number` elements
 */
module.exports = function() {
  // default options
  return bson.MinKey();
};
