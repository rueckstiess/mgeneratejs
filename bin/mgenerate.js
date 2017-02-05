#!/usr/bin/env node

var es = require('event-stream');
var mgenerate = require('../');
var _ = require('lodash');

/* eslint no-sync: 0 */
var read = require('fs').readFileSync;
var eJSONStringifyStream = require('mongodb-extended-json').createStringifyStream;

// var debug = require('debug')('mgenerate:bin');

/**
 * applies a regex to quote all unquoted keys, then uses JSON.parse to
 * convert template to a regular javascript object.
 *
 * @param  {String} template   JSON (or JS-style) template
 * @return {Object}            template object
 */
function parseTemplate(template) {
  // quote all unquoted keys first to make it valid JSON
  template = template.replace(/([{,])\s*([^,{\s\'"]+)\s*:(?=([^"\\]*(\\.|"([^"\\]*\\.)*[^"\\]*"))*[^"]*$)/g, '$1"$2":');
  return JSON.parse(template);
}

var yargs = require('yargs')
  .option('number', {
    alias: 'n',
    describe: 'number of documents to return',
    type: 'number',
    default: 1
  })
  .option('jsonArray', {
    describe: 'return a JSON array with comma-separated documents',
    type: 'boolean',
    default: false
  })
  .example('mgeneratejs -n 5 template.json', 'generates 5 documents based on the'
           + ' given template file.\n')
  .example('mgeneratejs \'{"name": "$name", "emails": {"$array": {"of": "$email", '
           + '"number": 3}}}\'', 'generates 1 document based on the given'
           + ' JSON template.\n')
  .example('cat template.json | mgeneratejs --number 20', 'pipe template file to mgenerate'
           + ' and generate 20 documents.\n')
  .example('mgeneratejs -n3 --jsonArray < template.json', 'pipe template file to mgenerate'
          + ' and generate 3 documents as a JSON array.')
  .help()
  .epilogue('Most operators from https://chancejs.com are available. For information'
    + ' on the template format, check the documentation at'
    + ' https://github.com/rueckstiess/mgenerate.js')
  .version()
  .strict()
  .wrap(100);


if (process.stdin.isTTY) {
  // running in TTY mode, get template from non-positional argument
  yargs.usage('Usage: mgeneratejs <options> [template]')
    .demand(1, 'must provide a template file or string');
} else {
  yargs.usage('Usage: mgeneratejs <options> < [template]');
}

var argv = yargs.argv;
var template;
var stringifyStream = argv.jsonArray ?
  eJSONStringifyStream('[\n  ', ',\n  ', '\n]\n') : eJSONStringifyStream('', '\n', '\n');

function generate() {
  es.readable(function(count, callback) {
    if (count >= argv.number) {
      return this.emit('end');
    }
    this.emit('data', mgenerate(template));
    callback();
  }).pipe(stringifyStream)
    .pipe(process.stdout);
}

if (process.stdin.isTTY) {
  var str = argv._[0];
  template = _.startsWith(str, '{') ? parseTemplate(str) : parseTemplate(read(str, 'utf8'));
  generate();
} else {
  template = '';
  process.stdin.setEncoding('utf-8');
  process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      template += chunk;
    }
  });
  process.stdin.on('end', function() {
    template = JSON.parse(template);
    generate();
  });
}
