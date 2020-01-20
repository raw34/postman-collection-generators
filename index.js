const fs = require('fs');
const moment = require('moment');
const argv = require('yargs').argv;
const postman = require('postman-collection');
const csvParse = require('csv-parse/lib/sync');
const converterPostman = require('./lib/postman');
const converterOpenapi = require('./lib/openapi');
const converterSwagger = require('./lib/swagger');
const converterCharles = require('./lib/charles');
const converterRaml = require('./lib/raml');

// 校验参数
if (!argv['source']) {
  throw new Error('option source required');
}

var data = fs.readFileSync(argv['source']);
var filter = 'filter' in argv ? csvParse(fs.readFileSync(argv['filter'])) : null;
var headers = 'headers' in argv ? fs.readFileSync(argv['headers']) : null;

var body = JSON.parse(data);
var type = converterPostman.identifyInputType(body);
var output = 'ouput' in argv ? argv['output'] : './' + type + '_' + moment().format('YYYYMMDDHHmmss') + '.json';

if (type == 'openapi') {
  converterOpenapi.generate(body, output, filter, headers);
} else if (type == 'swagger') {
  converterSwagger.generate(body, output, filter, headers);
} else if (type == 'charles') {
  converterCharles.generate(body, output, filter, headers);
} else if (type == 'postman') {
  body = new postman.Collection(body);
  converterPostman.generate(body, output, filter, headers);
} else if (type == 'raml') {
  converterRaml.generate(body, output, filter, headers);
} else {
  throw new Error('Unknown source type!');
}