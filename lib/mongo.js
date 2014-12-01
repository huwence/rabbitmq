(function() {
  var client;

  client = require('mongodb').MongoClient;

  exports.insert = function(data, callback) {
    return client.connect('mongodb://10.171.237.164:27017/test', function(error, db) {
      var collection;
      collection = db.collection('flume');
      return collection.insert(data, function(error, result) {
        if (typeof callback === 'function') {
          return callback(result);
        }
      });
    });
  };

}).call(this);
