const converterOpenapi = require('openapi-to-postmanv2');

module.exports = {
  convert: async function(data) {
    return new Promise(function (resolve, reject){
      converterOpenapi.convert({ type: 'json', data: data}, {}, function (err, conversionResult) {
        if (!conversionResult.result) {
          // return console.log('Could not convert', conversionResult.reason);
          reject(conversionResult.reason);
        }

        resolve(conversionResult.output[0].data);
      });
    });
  },
};