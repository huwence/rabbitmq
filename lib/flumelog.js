(function() {
  var configenv, content_type, http;

  http = require('http');

  configenv = require('../config/environment');

  content_type = 'application/json; charset=utf-8';

  module.exports = function(data, callback) {
    var log_data, post_request, timestamp;
    if (typeof data !== 'string') {
      return false;
    }
    timestamp = +new Date();
    log_data = {
      "headers": data,
      "body": "log-" + timestamp
    };
    post_request = http.request({
      host: configenv.flume.address,
      port: configenv.flume.port,
      headers: {
        'Content-Type': content_type
      }
    }, function(response) {
      if (typeof callback === 'function') {
        return callback(response);
      }
    });
    post_request.write(JSON.stringify(log_data));
    return post_request.end();
  };

}).call(this);
