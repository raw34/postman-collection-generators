const fs = require('fs');
const moment = require('moment');
const postman = require('postman-collection');
const csvParse = require('csv-parse/lib/sync');
const converterPostman = require('./lib/postman');
const converterOpenapi = require('./lib/openapi');
const converterSwagger = require('./lib/swagger');
const converterCharles = require('./lib/charles');

module.exports = {
  generate: function(input, options = {filter: null, headers: null, output: null}, cb = null) {
    var input = typeof input === 'string' && fs.statSync(input).isFile() ? JSON.parse(fs.readFileSync(input)) : JSON.parse(input);
    var filter = typeof options['filter'] === 'string' && fs.statSync(options['filter']).isFile() ? csvParse(fs.readFileSync(options['filter'])) : csvParse(options['filter']);
    var headers = typeof headers === 'string' && fs.statSync(options['headers']).isFile() ? JSON.parse(fs.readFileSync(options['filter'])) : JSON.parse(options['headers']); 

    var type = this.identifyInputType(input);
    var output = 'output' in options && options['output'] ? options['output'] : './' + type + '_' + moment().format('YYYYMMDDHHmmss') + '.json';

    if (type == 'openapi') {
      converterOpenapi.generate(input, output, filter, headers);
    } else if (type == 'swagger') {
      converterSwagger.generate(input, output, filter, headers);
    } else if (type == 'charles') {
      converterCharles.generate(input, output, filter, headers);
    } else if (type == 'postman') {
      input = new postman.Collection(input);
      converterPostman.generate(input, output, filter, headers);
    } else {
      throw new Error('Unknown source type!');
    }
  },

  identifyInputType: function(input) {
    if (typeof input == 'object' && input.openapi !== undefined) {
      return 'openapi';
    } else if (typeof input == 'object' && input.swagger !== undefined) {
      return 'swagger';
    } else if (typeof input == 'object' && input.info!== undefined && input.info._postman_id !== undefined) {
      return 'postman';
    } else if (typeof input == 'object' && Array.isArray(input) && input[0].host !== undefined && input[0].path !== undefined && input[0].request !== undefined) {
      return 'charles';
    } else {
      return 'unknown';
    }
  },
};