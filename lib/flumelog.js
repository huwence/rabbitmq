(function() {
  var base64_util, configenv, content_type, date_parse, handleData, http, query_parse;

  http = require('http');

  configenv = require('../config/environment');

  base64_util = require('./base64_util');

  query_parse = require('./query_parse');

  date_parse = require('./date_parse');

  content_type = 'application/json; charset=UTF-8';

  handleData = function(data) {
    var custom, key, paths, val;
    data.time = date_parse.getdate();
    if (data.msp) {
      paths = query_parse(decodeURIComponent(data.msp));
      if (paths) {
        for (key in paths) {
          val = paths[key];
          data[key] = val;
        }
      }
      delete data.msp;
    }
    if (data.custom) {
      custom = query_parse(base64_util.decode(data.custom));
      for (key in custom) {
        val = custom[key];
        data[key] = val;
      }
      return delete data.custom;
    }
  };

  module.exports = function(data, callback) {
    var log_data, post_request;
    handleData(data);
    log_data = [
      {
        "headers": data,
        "body": "log-" + timestamp
      }
    ];
    return post_request = http.request({
      host: configenv.flume.address,
      port: configenv.flume.port,
      method: 'POST',
      headers: {
        'Content-Type': content_type
      }
    }, function(response) {
      return callback(response(typeof callback === 'function' ? (post_request.write(JSON.stringify(log_data)), post_request.end()) : void 0));
    });
  };

}).call(this);
