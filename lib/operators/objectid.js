/* eslint new-cap: 0 */
var bson = require('bson');
var _ = require('lodash');
// var debug = require('debug')('mgenerate:objectid');

/**
 * $objectid returns a BSON ObjectId.
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                array of `number` elements
 */
module.exports = function(evaluator, options) {
  // default options
  options = evaluator(
    _.defaults(options, {
      value: bson.ObjectID()
    })
  );
  return options.value;
};
