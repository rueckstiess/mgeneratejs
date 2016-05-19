// var debug = require('debug')('mgenerate:inc');

/**
 * $inc operator, returns incrementally increasing numbers from a given `start`
 * value and skipping the `step` value.
 *
 * @example Create documents with unique, increasing, odd `id` values
 * starting from 101, i.e. 101, 103, 105, 107...
 *
 * {"id": {"$inc": {"start": 101, "step": 2}}}
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                array of `number` elements
 */

var counter = null;

module.exports = function(evaluator, options) {
  if (counter === null) {
    counter = options.start !== undefined ? evaluator(options.start, true) : 0;
  } else {
    var step = options.step !== undefined ? evaluator(options.step, true) : 1;
    counter += step;
  }
  return counter;
};

module.exports.reset = function() {
  counter = null;
};
