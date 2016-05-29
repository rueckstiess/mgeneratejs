/* eslint new-cap: 0 */
var _ = require('lodash');
var chance = require('chance').Chance();
// var debug = require('debug')('mgenerate:date');

/**
 * $date returns a date object, optionally between specified min and max values.
 * If `min` and/or `max` are provided, they need to be in a Date.parse()'able
 * format, e.g. ISO-8601.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the date operator
 * @return {Array}                random date between `min` and `max`
 */
module.exports = function(evaluator, options) {
  // default options
  options = evaluator(_.defaults(options, {
    min: '1900-01-01T00:00:00.000Z',
    max: '2099-12-31T23:59:59.999Z'
  }));
  var minDate = new Date(Date.parse(options.min));
  var maxDate = new Date(Date.parse(options.max));
  return chance.date({min: minDate, max: maxDate});
};
