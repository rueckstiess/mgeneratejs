var _ = require('lodash');

// var debug = require('debug')('mgenerate:array');

/**
 * $join operator takes an array and an `sep` separator string and concats
 * the elements of the array (cast to string) separated by `sep`.
 * The default `sep` is the empty string ''.
 *
 * @example Returns the string "foo-bar-baz".
 *
 * {"code": {"$join": {"array": ["foo", "bar", "baz"], "sep": "-"}}}
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                array of `number` elements
 */
module.exports = function(evaluator, options) {
  var replacement;
  // evaluate options object first before picking
  options = evaluator(_.defaults(options, {
    sep: ''
  }));
  if (_.isArray(options.array) && _.isString(options.sep)) {
    replacement = _.join(options.array, options.sep);
  } else {
    replacement = '$missing';
  }
  return evaluator(replacement, true);
};
