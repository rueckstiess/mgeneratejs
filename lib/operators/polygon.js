var coordinates = require('./coordinates');
var _ = require('lodash');

// var debug = require('debug')('mgenerate:polygon');

/**
 * $polygon operator, returns a GeoJSON formatted Polygon with `corners` corners
 *
 * @example Creates random GeoJSON polygon of format with 4 corners:
 *
 * {
 *   "type": "Polygon",
 *   "coordinates": [ [ [<long>, <lat>], [<long>, <lat>], ... ] ]
 * }
 *
 * {"polygon": {"$polygon": {"corners": 4}}}
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                array of `number` elements
 */

module.exports = function(evaluator, options) {
  // default options
  options = _.defaults(options, {
    corners: 3
  });

  // evaluate corners option first
  var corners = evaluator(options.corners, true);

  // remove corners from options and produce `corners` coordinate pairs
  options = _.omit(options, 'corners');
  var coords = _.map(_.range(corners), function() {
    return coordinates(evaluator, options);
  });

  // close polygon
  coords.push(coords[0]);

  var result = {
    type: 'Polygon',
    coordinates: [coords]
  };
  return result;
};
