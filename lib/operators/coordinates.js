/* eslint new-cap: 0 */
var chance = require('chance').Chance();
var _ = require('lodash');

// var debug = require('debug')('mgenerate:inc');

/**
 * $coordinates operator, returns a 2-element array of [longitude, latitude]
 * coordinates.
 *
 * Note: this operator overwrites the chance.coordinates() operator, as it
 * returns a string in "latitude, longitude" format, which is not compatible
 * to MongoDBs geolocation indexes.
 *
 * @example Creates random coordinate pairs
 *
 * {"location": "$coordinates"}
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the array operator
 * @return {Array}                array of `number` elements
 */

module.exports = function(evaluator, options) {
  options = evaluator(_.defaults(options, {
    long_lim: [-180, 180],
    lat_lim: [-90, 90]
  }));

  var lng = chance.longitude({min: options.long_lim[0], max: options.long_lim[1]});
  var lat = chance.latitude({min: options.lat_lim[0], max: options.lat_lim[1]});

  return [lng, lat];
};
