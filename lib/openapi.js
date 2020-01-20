const postman = require('postman-collection');
const postmanHelper = require('./postman');
const converterOpenapi = require('openapi-to-postmanv2');

module.exports = {
  generate: function(data, collectionPath, filter = null, headers = null) {
    converterOpenapi.convert({ type: 'json', data: data}, {}, function (err, conversionResult) {
      if (!conversionResult.result) {
        return console.log('Could not convert', conversionResult.reason);
      }

      var collectionOld = new postman.Collection(conversionResult.output[0].data);

      return postmanHelper.generate(collectionOld, collectionPath, filter, headers)
    });
  }
};
