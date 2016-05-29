/* eslint new-cap: 0 */
var chance = require('chance').Chance();
// var debug = require('debug')('mgenerate:choose');

/**
 * $choose operator, picks one of the given choices, optionally weighed by
 * provided weight values. First evaluates the `weights` array if present.
 * Then picks one of the `from` choices (with uniform distribution if no
 * weights given). Then evaluates that choice.
 *
 * @example Choose a flavour with a preference for vanilla.
 *
 * {
 *   "flavor": {
 *     "$choose": {
 *       "from": ["vanilla", "chocolate", "lemon"],
 *       "weights": [3, 1, 1]
 *     }
 *   }
 * }
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the choose operator
 * @return {Any}                  chosen value, evaluated
 */
module.exports = function(evaluator, options) {
  var replacement;
  if (options.weights) {
    replacement = chance.weighted(options.from, options.weights);
  } else {
    replacement = chance.pickone(options.from);
  }
  var result = evaluator(replacement, true);
  return result;
};
