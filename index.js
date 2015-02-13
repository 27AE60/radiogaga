'use strict';

var app = require('./app'),
  cfg = require('./radiogaga.json'),
  version = require('./package.json').version,
  program = require('commander');

/* cli */
program
  .version(version)
  .option('-p, --port <n>', 'port number', parseInt)
  .parse(process.argv);

var port = program.port ? program.port : cfg.api.port;

/* server running */
var server = app.listen(port, function()  {
  console.log('Listening on %d', port);
});
