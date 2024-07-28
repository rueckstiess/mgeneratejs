var mgenerate = require('../');
var assert = require('assert');
var _ = require('lodash');

// var debug = require('debug')('mgenerate:test:templates');

context('Templates', function() {
  it('should have `chance` available inside a template', async function() {
    var template = { twitter_user: '{{ chance.twitter() }}' };
    var res = await mgenerate(template);
    assert.ok(_.isString(res.twitter_user));
    assert.ok(_.startsWith(res.twitter_user, '@'));
  });
  it('should have `faker` available inside a template', async function() {
    var template = { slogan: '{{ faker.company.catchPhrase() }}' };
    var res = await mgenerate(template);
    assert.ok(_.isString(res.slogan));
  });
  it('should evaluate javascript', async function() {
    var template = { result: '{{ 1+1+1 }}' };
    var res = await mgenerate(template);
    assert.ok(_.isString(res.result));
    assert.equal(res.result, '3');
  });
});
