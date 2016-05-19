var mgenerate = require('../');
var assert = require('assert');

// var debug = require('debug')('mgenerate:test');

context('General', function() {
  it('should throw an error if additional key is present after operator', function() {
    assert.throws(function() {
      var template = {foo: {$string: {length: 3}, something: 'else'}};
      mgenerate(template);
    });
  });

  it('should work with arrays', function() {
    var res = mgenerate({foo: [{$string: {length: 3}}, 'foo', '$integer']});
    assert.equal(typeof res.foo[0], 'string');
    assert.equal(res.foo[0].length, 3);
    assert.equal(res.foo[1], 'foo');
    assert.equal(typeof res.foo[2], 'number');
  });

  it('should work with nested objects', function() {
    var res = mgenerate({foo: {bar: '$age'}});
    assert.equal(typeof res.foo, 'object');
    assert.equal(typeof res.foo.bar, 'number');
  });

  it('should resolve object parameters first', function() {
    var res = mgenerate({
      foo: {'$string': {'length': {'$integer': {min: 4, max: 4}}}}
    });
    assert.equal(res.foo.length, 4);
  });
});
