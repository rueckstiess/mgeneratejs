/* eslint new-cap: 0 */
var _ = require('lodash');
var chance = require('chance').Chance();
var faker = require('faker');
var assert = require('assert');
var operators = require('./operators');
var aliases = require('./aliases');

// var debug = require('debug')('mgenerate:index');

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

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
};

/**
 * calls an operator, either built-in or a chance.js operator.
 *
 * @param  {string} op    the operator name without `$` prefix
 * @param  {object} opts  options passed to the operator
 * @return {any}          return value after operator is resolved
 */
var callOperator = function(op, opts) {
  opts = opts || {};
  // exception for $missing values, handled in evalObject()
  if (op === 'missing') {
    return '$missing';
  }
  // handle aliases
  if (_.has(aliases, op)) {
    op = aliases[op];
  }
  // known built-in operator, call with `evalTemplate` function and options
  if (_.includes(opNames, op)) {
    return operators[op](evalTemplate, opts);
  }
  // not a known operator, try chance.js
  try {
    return chance[op](evalObject(opts));
  } catch (e) {
    throw new Error('unknown operator: $' + op + '\nMessage: ' + e);
  }
};

/**
 * evaluates an object by mapping over the values and evaluating each value
 * with the `evalValue` function. Also removes any key whose value is
 * `$missing`.
 *
 * @param  {object} template    template to evaluate
 * @return {any}                return value after template is evaluated
 */
evalObject = function(template) {
  var result = _.mapValues(template, evalValue);
  result = _.omitBy(result, function(val) {
    return val === '$missing';
  });
  return result;
};

/**
 * evaluates a single right-hand side value. Distinguishes between the
 * string and object version of an operator invocation. String versions use
 * the default options.
 *
 * @param  {object} template    template to evaluate
 * @return {any}                return value after template is evaluated
 */
evalValue = function(template) {
  if (_.isString(template)) {
    if (_.startsWith(template, '$')) {
      return callOperator(template.slice(1));
    }
    // check if the string can be interpreted as mustache template
    if (_.includes(template, '{{')) {
      var compiled = _.template(template, {imports: {
        chance: chance,
        faker: faker
      }});
      return compiled();
    }
    // string constant
    return template;
  }
  if (_.isPlainObject(template)) {
    // check if this is an object-style operator
    var objKeys = _.keys(template);
    var op = objKeys[0];
    if (_.startsWith(op, '$')) {
      op = op.slice(1);
      assert.equal(objKeys.length, 1, 'operator object cannot have more than one key.');
      var options = _.values(template)[0];
      return callOperator(op, options);
    }
    return evalObject(template);
  }
  // handle arrays recursively, skip $missing values
  if (_.isArray(template)) {
    return _.filter(_.map(template, evalValue), function(v) {
      return v !== '$missing';
    });
  }
  // don't know how to evalute, leave alone
  return template;
};

module.exports = evalObject;
