const converterApi = require('api-spec-converter');
const converterOpenapi = require('openapi-to-postmanv2');

module.exports = {
  convert: async function(data) {
    return new Promise(function (resolve, reject){
      converterApi.convert({from: 'swagger_2', to: 'openapi_3', source: data}, function(err, converted) {
        // console.log(converted.spec);
        if (err) {
            reject(err);
        }

        converterOpenapi.convert({ type: 'json', data: converted.spec}, {}, function (err, conversionResult) {
          if (!conversionResult.result) {
            // return console.log('Could not convert', conversionResult.reason);
            reject(conversionResult.reason);
          }

          resolve(conversionResult.output[0].data);
        });
      });
    });
  },
};