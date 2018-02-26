/* eslint new-cap: 0 */
var mongodb = require('mongodb');
var uuidv4 = require('uuid/v4');

// var debug = require('debug')('mgenerate:objectid');

/**
 * $uuid returns a BSON UUID.
 *
 * @return {core.BSON.Binary}              A random UUIDv4 object
 */
module.exports = function() {
  return mongodb.Binary(uuidv4(), mongodb.Binary.SUBTYPE_UUID);
};
