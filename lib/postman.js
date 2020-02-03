const fs = require('fs');
const uuid = require('uuid');
const postman = require('postman-collection');

module.exports = {
  generate: function(collectionOld, collectionPath, filter = null, headers = null) {
    if (filter && filter.length > 0) {
      var collection = new postman.Collection(this.getRawCollection(collectionPath));

      collection = this.setItems(collectionOld, collection, filter, headers);
    } else {
      collection = collectionOld;
    }

    var collectionJson = JSON.stringify(collection, null, 2);

    fs.writeFile(collectionPath, collectionJson, function(err){
      return console.log(collectionPath);
    });
  },

  getRawCollection: function(collectionPath) {
    var collectionName = collectionPath.slice(collectionPath.lastIndexOf('/') + 1).replace(/\.json/, '');

    var rawCollection = {
      info: {
        id: uuid.v4(),
        name: collectionName,
        description: { content: collectionName, type: 'markdown' },
        version: '2.1.0'
      },
      auth: {},
      event: [],
      item: [],
      variable: [],
    };

    return rawCollection;
  },

  getRawItem: function(path) {
    var rawItem = {
      id: uuid.v4(),
      name: path,
      description: {},
      request: {
        description: {},
        auth: {},
      },
      event: [],
    };

    return rawItem;
  },

  getRawItems: function(filter, parameters = null, scripts = null) {
    var rawItems = [];
    var keys = filter.shift();
    var indexHost = keys.indexOf('host');
    var indexMethod = keys.indexOf('method');
    var indexGroupName = keys.indexOf('group');
    var indexName = keys.indexOf('name');

    for (var i in filter) {
      var item = {
        host: filter[i][indexHost],
        method: filter[i][indexMethod],
        name: filter[i][indexName],
        parameters: [],
        preRequestScript: [],
        testScript: {},
      };

      if (indexGroupName >= 0) {
        item['groupName'] = filter[i][indexGroupName];
      }

      if (indexName >= 0) {
        item['name'] = filter[i][indexName];
      }

      rawItems.push(item);
    }

    return rawItems;
  },

  setItems: function(collectionOld, collection, filter = null, headers = null, parameters = null, scripts = null) {
    var rawItems = this.getRawItems(filter, parameters, scripts);

    for (var i in rawItems) {
      // find item
      var item = this.getItemByNameAndGroupName(collectionOld, rawItems[i].name, rawItems[i].groupName);

      if (!item || !postman.Item.isItem(item)) {
        console.warn(rawItems[i].groupName + ' - ' + rawItems[i].name + ' not exists');
        continue;
      }

      // set item request headers
      item = this.setItemRequestHeaders(item, headers);

      // set item request params
      // for (var j in rawItems[i].parameters) {
      //   item = this.setItemRequestParams(item, rawItems[i].parameters[j]);
      // }

      // set item scripts
      // item = this.setItemPreRequestScript(item, rawItems[i].preRequestScript);
      // item = this.setItemTestScript(item, rawItems[i].testScript);

      // add item
      collection.items.add(item);
    }

    return collection;
  },

  getItemByNameAndGroupName: function (collection, name, groupName) {
    var item = null;
    var itemGroup = collection.items.find({ name: groupName });

    if (postman.ItemGroup.isItemGroup(itemGroup)) {
      item = itemGroup.oneDeep(name);
    } else {
      item = collection.items.find({ name: name });
    }

    return item;
  },

  setItemRequestHeaders: function (item, headers) {
    for (var key in headers) {
      item.request.addHeader(postman.Header.create(headers[key], key));
    }

    return item;
  },

  setItemRequestParams: function (item, rawParam) {
    var type = rawParam.type;
    var k = rawParam.key;
    var v = rawParam.value;
    var param = { key: k, value: v };

    if (type == 'path') {
      item.request.url.variables.upsert(new postman.Variable(param));
    } else if (type == 'query') {
      item.request.url.query.upsert(new postman.QueryParam(param));
    } else if (type == 'formdata') {
      if (item.request.body) {
        item.request.body.urlencoded.upsert(new postman.QueryParam(param));
      } else {
        item.request.body = new postman.RequestBody({
          mode: 'urlencoded',
          urlencoded: [param],
        });
      }
    }

    return item;
  },

  setItemPreRequestScript: function (item, preRequestScript) {
    if (preRequestScript.length == 0) {
      return item;
    }

    preRequestScript[0] = '(' + preRequestScript[0].toString() + ')();';

    item.events.add({
      listen: 'prerequest',
      script: preRequestScript,
    });

    return item;
  },

  setItemTestScript: function (item, testScript) {
    if (testScript.length == 0) {
      return item;
    }

    testScript.exec[0] = '(' + testScript.exec[0].toString() + ')();';

    item.events.add({
      listen: 'test',
      script: testScript,
    });

    return item;
  },
};