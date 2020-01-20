const postman = require('postman-collection');
const postmanHelper = require('./postman');
const queryString = require('querystring');

module.exports = {
  generate: function(data, collectionPath, filter = null, headers = null) {
    var collectionOld = new postman.Collection(this.convert(data, collectionPath));

    return postmanHelper.generate(collectionOld, collectionPath, filter, headers)
  },

  convert: function(data, collectionPath) {
    var rawCollection = postmanHelper.getRawCollection(collectionPath);

    for (var i in data) {
      var method = data[i]['method'];
      var path = data[i]['path'];
      var query = data[i]['query'];
      var body = data[i]['request']['body'] !== undefined ? queryString(data[i]['request']['body']['text']) : {};

      var rawItem = postmanHelper.getRawItem(path);
      rawItem.request['method'] = method;
      rawItem.request['url'] = query ? path + '?' + query : path;

      if (rawItem.request['url'].match(/\/\d+/)) {
        rawItem.request['url'] = rawItem.request['url'].replace(/\/\d+/, '/:id');
      }

      if (method == 'POST' && Object.keys(body).length > 0) {
        rawItem.request['body']= {
          mode: 'formdata',
          // formdata: [],
          // raw: '',
          urlencoded: []
        };
        
        for (var i in body) {
          rawItem.request['body']['urlencoded'].push({key: i, value: body[i]});
        }
      }

      rawCollection.item.push(rawItem);
    }

    return rawCollection;
  },
};