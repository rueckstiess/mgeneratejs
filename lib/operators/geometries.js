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

async function asyncMap(array, asyncFn) {
  // Map over the array to create an array of promises
  const promises = array.map(asyncFn);
  // Wait for all the promises to resolve and return the results
  return Promise.all(promises);
}

module.exports = async function(evaluator, options) {
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
  options = await evaluator(options);

  // remove corners from options and produce `corners` coordinate pairs
  var geometries = await asyncMap(_.range(options.number), async function() {
    var op = nameToOperator[chance.pickone(options.types)];
    var geometry = {};
    geometry[op] = _.omit(options, ['types', 'number']);
    return await evaluator(geometry, true);
  });

  var result = {
    type: 'GeometryCollection',
    geometries: geometries
  };
  return result;
};
