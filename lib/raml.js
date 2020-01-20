const postman = require('postman-collection');
const postmanHelper = require('./postman');

module.exports = {
  generate: function(data, collectionPath, filter = null, headers = null) {
    var collectionOld = new postman.Collection(this.convert(data, collectionPath));

    return postmanHelper.generate(collectionOld, collectionPath, filter, headers)
  },
};