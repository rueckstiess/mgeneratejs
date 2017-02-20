/* eslint new-cap: 0 */
// var debug = require('debug')('mgenerate:now');

/**
 * $now returns a the current date of the system in ISO-8601 format.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                current `now` date time object
 */
module.exports = function() {
  // default options
  return new Date(Date.now());
};
