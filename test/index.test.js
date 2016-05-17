var mgenerate = require('../');
var assert = require('assert');
var _ = require('lodash');

var debug = require('debug')('mgenerate:test');

describe('mgenerate.js', function() {
  it('should throw an error if additional key is present after operator', function() {
    assert.throws(function() {
      var template = {foo: {$string: {length: 3}, something: 'else'}};
      mgenerate(template);
    });
  });

  it('should work with arrays', function() {
    var res = mgenerate({foo: [{$string: {length: 3}}, 'foo', '$integer']});
    debug('res', res);
    assert.equal(typeof res.foo[0], 'string');
    assert.equal(res.foo[0].length, 3);
    assert.equal(res.foo[1], 'foo');
    assert.equal(typeof res.foo[2], 'number');
  });
  it('should work with nested objects', function() {
    var res = mgenerate({foo: {bar: '$age'}});
    debug('res', res);
    assert.equal(typeof res.foo, 'object');
    assert.equal(typeof res.foo.bar, 'number');
  });

  it('should resolve object parameters first', function() {
    var res = mgenerate({
      foo: {'$string': {'length': {'$integer': {min: 4, max: 4}}}}
    });
    assert.equal(res.foo.length, 4);
  });

  describe('Missing values', function() {
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

  describe('Choose', function() {
    it('should chose from the given choices without weights', function() {
      var res = mgenerate({foo: {$choose: {from: ['a', 'b', 'c']}}});
      assert.equal(typeof res.foo, 'string');
      assert.ok(_.includes(['a', 'b', 'c'], res.foo));
    });
    it('should chose from the given choices with weights', function() {
      var res = mgenerate({foo: {$choose: {
        from: ['a', 'b', 'c'],
        weights: [1, 0, 0]
      }}});
      assert.equal(typeof res.foo, 'string');
      assert.equal(res.foo, 'a');
    });
  });

  describe('Arrays', function() {
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

  describe('Strings', function() {
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

  describe('Numbers', function() {
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
