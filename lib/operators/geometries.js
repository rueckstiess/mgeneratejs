/* eslint new-cap: 0 */
var chance = require('chance').Chance();
var _ = require('lodash');

// var debug = require('debug')('mgenerate:polygon');

/**
 * $geometries operator, returns a GeoJSON formatted GeometryCollection,
 * made out of `number` geometries of types `types`.
 *
 * @example Creates a GeometryCollection of 5 polygons or points.
 *
 * {"geometries": {"$geometries": {"types": ["Polygon", "Point"], "number": 5}}}
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                array of `number` elements
 */

module.exports = function(evaluator, options) {
  // default options
  options = _.defaults(options, {
    types: ['Polygon', 'LineString', 'Point'],
    number: 3
  });

  var nameToOperator = {
    Polygon: '$polygon',
    LineString: '$linestring',
    Point: '$point'
  };

  // evaluate options first
  options = evaluator(options);

  // remove corners from options and produce `corners` coordinate pairs
  var geometries = _.map(_.range(options.number), function() {
    var op = nameToOperator[chance.pickone(options.types)];
    var geometry = {};
    geometry[op] = _.omit(options, ['types', 'number']);
    return evaluator(geometry, true);
  });

  var result = {
    type: 'GeometryCollection',
    geometries: geometries
  };
  return result;
};
