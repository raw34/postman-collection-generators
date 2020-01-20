const argv = require('yargs').argv;
const generator = require('./index');

if (!argv['source']) {
  throw new Error('Source option required!');
}

var source = argv['source'];
var filter = 'filter' in argv ? argv['filter'] : null;
var headers = 'headers' in argv ? argv['headers'] : null;
var output = 'output' in argv ? argv['output'] : null;

generator.generate(source, {filter: filter, headers: headers, output: output});