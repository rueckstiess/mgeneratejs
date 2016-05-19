var _ = require('lodash');
// var debug = require('debug')('mgenerate:objectid');

/**
 * $regex returns a regular expression based on the `string` and `flags`
 * parameters.
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                array of `number` elements
 */
module.exports = function(evaluator, options) {
  // default options
  options = evaluator(_.defaults(options, {
    string: '.*',
    flags: ''
  }));
  return new RegExp(options.string, options.flags);
};
