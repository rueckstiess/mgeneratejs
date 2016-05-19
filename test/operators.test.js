var mgenerate = require('../');
var operators = require('../lib/operators');
var assert = require('assert');
var _ = require('lodash');

context('Operators', function() {
  describe('$inc', function() {
    beforeEach(function() {
      // reset the inc operator to start from scratch
      operators.inc.reset();
    });
    it('should work with default parameters', function() {
      var template = {id: '$inc'};
      var res = _.map(_.range(5), function() {
        return mgenerate(template);
      });
      assert.deepEqual(_.map(res, 'id'), [0, 1, 2, 3, 4]);
    });
    it('should work with non-default start parameter', function() {
      var template = {id: {$inc: {start: 42}}};
      var res = _.map(_.range(5), function() {
        return mgenerate(template);
      });
      assert.deepEqual(_.map(res, 'id'), [42, 43, 44, 45, 46]);
    });
    it('should work with non-default step parameter', function() {
      var template = {id: {$inc: {start: 13, step: 2}}};
      var res = _.map(_.range(3), function() {
        return mgenerate(template);
      });
      assert.deepEqual(_.map(res, 'id'), [13, 15, 17]);
    });
    it('should work with step parameter expression', function() {
      var template = {id: {$inc: {start: 13, step: {$number: {min: 1, max: 2}}}}};
      var res = _.map(_.range(3), function() {
        return mgenerate(template);
      });
      assert.ok(_.every(_.map(res, 'id'), function(id) {
        return id >= 13 && id <= 17;
      }));
    });
  });

  describe('$missing', function() {
    it('should discard a $missing value', function() {
      var res = mgenerate({
        a: '$integer',
        b: '$missing',
        c: '$ip'
      });
      assert.ok(!_.has(res, 'b'));
    });

    it('should discard missing values in arrays', function() {
      var res = mgenerate({a: [1, '$missing', 3]});
      assert.equal(res.a.length, 2);
      assert.deepEqual(res.a, [1, 3]);
    });
  });

  describe('$choose', function() {
    it('should chose from the given choices without weights', function() {
      var res = mgenerate({foo: {$choose: {from: ['a', 'b', 'c']}}});
      assert.equal(typeof res.foo, 'string');
      assert.ok(_.includes(['a', 'b', 'c'], res.foo));
    });
    it('should choose from the given choices with weights', function() {
      var res = mgenerate({foo: {$choose: {
        from: ['a', 'b', 'c'],
        weights: [1, 0, 0]
      }}});
      assert.equal(typeof res.foo, 'string');
      assert.equal(res.foo, 'a');
    });
  });

  describe('$pick', function() {
    it('should pick the correct element from an array', function() {
      var res = mgenerate({color: {$pick: {array: ['green', 'red', 'blue'], element: 1}}});
      assert.equal(res.color, 'red');
    });
    it('should return $missing if element is out of array bounds', function() {
      var res = mgenerate({color: {$pick: {array: ['green', 'red', 'blue'], element: 3}}});
      assert.ok(!_.has(res, 'color'));
      res = mgenerate({color: {$pick: {array: ['green', 'red', 'blue'], element: -1}}});
      assert.ok(!_.has(res, 'color'));
    });
    it('should return $missing if `array` is not an array', function() {
      var res = mgenerate({color: {$pick: {array: 'red', element: 3}}});
      assert.ok(!_.has(res, 'color'));
    });
  });


  describe('$array', function() {
    it('should create a fixed-length array', function() {
      var res = mgenerate({
        person: {
          first: {'$first': {gender: 'female'}},
          last: '$last',
          emails: {$array: {of: '$email', 'number': 5}}
        }
      });
      assert.equal(res.person.emails.length, 5);
      assert.ok(_.every(res.person.emails, function(email) {
        return _.isString(email) && _.includes(email, '@');
      }));
    });

    it('should evaluate the `number` option before creating the array', function() {
      var res = mgenerate({
        myarr: {$array: {of: '$integer', number: {$number: {min: 6, max: 6}}}}
      });
      assert.equal(res.myarr.length, 6);
    });

    it('should evaluate the `of` option after creating the array', function() {
      var res = mgenerate({
        myarr: {$array: {of: {'$integer': {min: 0, max: 0}}, number: 3}}
      });
      assert.deepEqual(res.myarr, [0, 0, 0]);
    });
  });

  describe('$join', function() {
    it('should join elements without explicit separator', function() {
      var res = mgenerate({code: {$join: {array: ['foo', 'bar', 'baz']}}});
      assert.equal(res.code, 'foobarbaz');
    });
    it('should join elements with explicit separator', function() {
      var res = mgenerate({code: {$join: {array: ['foo', 'bar', 'baz'], sep: '-'}}});
      assert.equal(res.code, 'foo-bar-baz');
    });
    it('should join elements with multi-character separator', function() {
      var res = mgenerate({code: {$join: {array: ['foo', 'bar', 'baz'], sep: ' ==> '}}});
      assert.equal(res.code, 'foo ==> bar ==> baz');
    });
    it('should join elements with multi-character separator', function() {
      var res = mgenerate({code: {$join: {array: 'foo', sep: ','}}});
      assert.ok(!_.has(res, 'code'));
    });
  });

  describe('$coordinates', function() {
    it('should work with default bounds', function() {
      var res = mgenerate({loc: '$coordinates'});
      assert.ok(_.isArray(res.loc));
      assert.ok(res.loc[0] >= -180);
      assert.ok(res.loc[0] <= 180);
      assert.ok(res.loc[1] >= -90);
      assert.ok(res.loc[1] <= 90);
    });
    it('should work for with custom bounds', function() {
      var res = mgenerate({loc: {'$coordinates': {long_lim: [-2, 2], lat_lim: [-5, 5]}}});
      assert.ok(_.isArray(res.loc));
      assert.ok(res.loc[0] >= -2);
      assert.ok(res.loc[0] <= 2);
      assert.ok(res.loc[1] >= -5);
      assert.ok(res.loc[1] <= 5);
    });
  });

  describe('$point', function() {
    it('should create a GeoJSON point', function() {
      var res = mgenerate({loc: '$point'});
      assert.ok(_.isObject(res.loc));
      assert.ok(_.has(res.loc, 'type'));
      assert.equal(res.loc.type, 'Point');
      assert.ok(_.has(res.loc, 'coordinates'));
      assert.ok(_.isArray(res.loc.coordinates));
      assert.equal(res.loc.coordinates.length, 2);
    });
  });

  describe('$polygon', function() {
    it('should create a GeoJSON polygon with default number of corners', function() {
      var res = mgenerate({polygon: '$polygon'});
      assert.ok(_.isObject(res.polygon));
      assert.ok(_.has(res.polygon, 'type'));
      assert.equal(res.polygon.type, 'Polygon');
      assert.ok(_.has(res.polygon, 'coordinates'));
      assert.ok(_.isArray(res.polygon.coordinates));
      assert.ok(_.isArray(res.polygon.coordinates[0]));
      assert.ok(_.isArray(res.polygon.coordinates[0][0]));
      assert.equal(res.polygon.coordinates[0].length, 4);
      assert.equal(res.polygon.coordinates[0][0].length, 2);
      assert.deepEqual(res.polygon.coordinates[0][0],
        res.polygon.coordinates[0][res.polygon.coordinates[0].length - 1]);
    });
    it('should create a GeoJSON polygon with custom number of corners', function() {
      var res = mgenerate({polygon: {'$polygon': {corners: 5}}});
      assert.ok(_.isObject(res.polygon));
      assert.ok(_.has(res.polygon, 'type'));
      assert.equal(res.polygon.type, 'Polygon');
      assert.ok(_.has(res.polygon, 'coordinates'));
      assert.ok(_.isArray(res.polygon.coordinates));
      assert.ok(_.isArray(res.polygon.coordinates[0]));
      assert.ok(_.isArray(res.polygon.coordinates[0][0]));
      assert.equal(res.polygon.coordinates[0].length, 6);
      assert.equal(res.polygon.coordinates[0][0].length, 2);
      assert.deepEqual(res.polygon.coordinates[0][0],
        res.polygon.coordinates[0][res.polygon.coordinates[0].length - 1]);
    });
  });

  describe('$objectid', function() {
    it('not implemented yet');
  });

  describe('$regex', function() {
    it('not implemented yet');
  });

  describe('$timestamp', function() {
    it('not implemented yet');
  });

  describe('$linestring', function() {
    it('not implemented yet');
  });

  describe('$geometries', function() {
    it('not implemented yet');
  });

  describe('$minkey', function() {
    it('not implemented yet');
  });

  describe('$maxkey', function() {
    it('not implemented yet');
  });

  describe('$string', function() {
    it('should work for string format operator', function() {
      var res = mgenerate({foo: '$string'});
      assert.equal(typeof res.foo, 'string');
    });
    it('should work for object format operator', function() {
      var res = mgenerate({foo: {$string: {length: 3}}});
      assert.equal(typeof res.foo, 'string');
    });
    it('should support length and pool parameters', function() {
      var res = mgenerate({foo: {$string: {length: 1, pool: 'a'}}});
      assert.equal(res.foo, 'a');
    });
  });

  describe('$integer / $number', function() {
    it('should work for string format operator', function() {
      var res = mgenerate({foo: '$integer'});
      assert.equal(typeof res.foo, 'number');
    });
    it('should support min and max parameters', function() {
      var res = mgenerate({foo: {'$integer': {min: -10, max: 10}}});
      assert.ok(res.foo >= -10);
      assert.ok(res.foo <= 10);
    });
    it('should have a $number alias for $integer', function() {
      var res = mgenerate({foo: {'$number': {min: -10, max: 10}}});
      assert.ok(_.isNumber(res.foo));
    });
  });
});
