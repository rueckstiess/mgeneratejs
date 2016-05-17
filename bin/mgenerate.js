#!/usr/bin/env node

var es = require('event-stream');
var mgenerate = require('../');
var _ = require('lodash');
var read = require('fs').readFileSync;

var argv = require('yargs')
  .usage('Usage: $0 <options> [template]')
  .option('number', {
    alias: 'n',
    describe: 'number of documents to return',
    type: 'number',
    default: 1
  })
  .demand(1, 'must provide a template file or string')
  .example('$0 -n 5 template.json', 'generates 5 documents based on the'
           + ' given template file.')
  .example('$0 \'{"name": "$name", "emails": {"$array": {"of": "$email", '
           + '"number": 3}}}\'', 'generates 1 document based on the given'
           + ' JSON template.')
  .help()
  .version()
  .wrap(100)
  .argv;

var str = argv._[0];
var template = _.startsWith(str, '{') ? JSON.parse(str) : JSON.parse(read(str));

es.readable(function(count, callback) {
  if (count >= argv.number) {
    return this.emit('end');
  }
  this.emit('data', mgenerate(template));
  callback();
}).pipe(es.stringify())
  .pipe(process.stdout);
