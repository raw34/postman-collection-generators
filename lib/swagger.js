const postman = require('postman-collection');
const postmanHelper = require('./postman');
const converterApi = require('api-spec-converter');
const converterOpenapi = require('openapi-to-postmanv2');

module.exports = {
  generate: function(data, collectionPath, filter = null, headers = null) {
    converterApi.convert({from: 'swagger_2', to: 'openapi_3', source: data,}, function(err, converted) {
      // console.log(converted.spec);
      converterOpenapi.convert({ type: 'json', data: converted.spec}, {}, function (err, conversionResult) {
        if (!conversionResult.result) {
          return console.log('Could not convert', conversionResult.reason);
        }

        var collectionOld = new postman.Collection(conversionResult.output[0].data);

        return postmanHelper.generate(collectionOld, collectionPath, filter, headers);
      });
    });
  },
};