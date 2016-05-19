// var debug = require('debug')('mgenerate:point');

/**
 * $point operator, returns a GeoJSON formatted Point, interally
 * using `$coordinates`.
 *
 * @example Creates random GeoJSON point of format:
 *
 * {
 *   "type": "Point",
 *   "coordinates": [<long>, <lat>]
 * }
 *
 * {"location": "$point"}
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                array of `number` elements
 */

module.exports = function(evaluator, options) {
  var result = {
    type: 'Point',
    coordinates: {'$coordinates': options}
  };
  return evaluator(result, true);
};
