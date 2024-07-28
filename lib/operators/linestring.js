var coordinates = require('./coordinates');
var _ = require('lodash');

// var debug = require('debug')('mgenerate:linestring');

/**
 * $linestring operator, returns a GeoJSON formatted LineString with
 * `locs` locations
 *
 * @example Creates random GeoJSON polygon of format with 4 locations:
 *
 * {
 *   "type": "LineString",
 *   "coordinates": [ [<long>, <lat>], [<long>, <lat>], ... ]
 * }
 *
 * {"path": {"$linestring": {"locs": 4}}}
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                array of `number` elements
 */

// TODO: Move asyncMap into its own module
async function asyncMap(array, asyncFn) {
  // Map over the array to create an array of promises
  const promises = array.map(asyncFn);
  // Wait for all the promises to resolve and return the results
  return Promise.all(promises);
}

module.exports = async function(evaluator, options) {
  // default options
  options = _.defaults(options, {
    locs: 2
  });

  // evaluate corners option first
  var locs = await evaluator(options.locs, true);

  // remove corners from options and produce `corners` coordinate pairs
  options = _.omit(options, 'locs');
  var coords = await asyncMap(_.range(locs), async function() {
    return await coordinates(evaluator, options);
  });

  var result = {
    type: 'LineString',
    coordinates: coords
  };
  return result;
};
