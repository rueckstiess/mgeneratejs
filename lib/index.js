var _ = require('lodash');
var Chance = require('chance');
var assert = require('assert');
var operators = require('./operators');

var debug = require('debug')('mgenerate:index');

var chance = new Chance();
var opNames = _.keys(operators);

var evalObject;
var evalValue;

/**
 * main template evaluation function. Gets passed to operators so they can
 * evaluate their children in the order they require. If template is a full
 * object, map over all values and evaluate those. If template is a right-hand
 * side value, only evaluate the value without mapping.
 *
 * @param  {object|string}  template    The template definition to be turned
 *                                      into a value.
 * @param  {Boolean} isValue            True if template is a right-hand side
 *                                      value, false otherwise.
 * @return {Any}                        return the value after evaluation
 */
var evalTemplate = function(template, isValue) {
  return isValue ? evalValue(template) : evalObject(template);
}

evalObject = function(template) {
  var result = _.mapValues(template, evalValue);
  result = _.omitBy(result, function(val) {
    return val === '$missing';
  });
  return result;
};

function callOperator(op, opts) {
  debug('callOp', op, opts);
  opts = opts || {};
  // exception for $missing values, handled in evalObject.
  if (op === 'missing') {
    return '$missing';
  }
  if (_.includes(opNames, op)) {
    return operators[op](evalTemplate, opts);
  }
  // not a known operator, try chance
  try {
    return chance[op](evalObject(opts));
  } catch (e) {
    throw new Error('unknown operator: $' + op);
  }
}

evalValue = function(val) {
  var op;
  if (_.isString(val)) {
    if (_.startsWith(val, '$')) {
      return callOperator(val.slice(1));
    }
    // string constant
    return val;
  }
  if (_.isPlainObject(val)) {
    // check if this is an object-style operator
    var objKeys = _.keys(val);
    op = objKeys[0];
    if (_.startsWith(op, '$')) {
      op = op.slice(1);
      assert.equal(objKeys.length, 1, 'operator object cannot have more than one key.');
      var options = _.values(val)[0];
      return callOperator(op, options);
    }
    return evalObject(val);
  }
  // handle arrays recursively, skip $missing values
  if (_.isArray(val)) {
    return _.filter(_.map(val, evalValue), function(v) {
      return v !== '$missing';
    });
  }
  return val;
};

module.exports = evalObject;
