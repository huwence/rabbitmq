(function() {
  var base64_util, configenv, content_type, date_parse, handleData, http, query_parse;

  http = require('http');

  configenv = require('../config/environment');

  base64_util = require('./base64_util');

  query_parse = require('./query_parse');

  date_parse = require('./date_parse');

  content_type = 'application/json; charset=UTF-8';

  http.globalAgent.maxSockets = 10000;

  handleData = function(data) {
    var custom, error, key, paths, pathurl, query, val;
    data.time = date_parse.getdate('Y-m-dTH:i:s');
    if (data.msts) {
      data.msts = parseInt(data.msts, 10);
    }
    if (data.msetd) {
      data.msetd = parseInt(data.msetd, 10);
    }
    if (data.msp) {
      try {
        pathurl = decodeURIComponent(data.msp);
      } catch (_error) {
        error = _error;
        pathurl = unescape(data.msp);
      }
      if (pathurl) {
        query = pathurl.substring(pathurl.indexOf('?'));
        paths = query_parse(query);
        if (paths) {
          for (key in paths) {
            val = paths[key];
            data[key] = val;
          }
        }
        delete data.msp;
      }
    }
    if (data.custom) {
      custom = query_parse(base64_util.decode(data.custom));
      if (custom) {
        for (key in custom) {
          val = custom[key];
          data[key] = val;
        }
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
        "body": "log-" + data.time
      }
    ];
    post_request = http.request({
      host: configenv.flume.address,
      port: configenv.flume.port,
      method: 'POST',
      headers: {
        'Content-Type': content_type
      }
    }, function(response) {
      if (typeof callback === 'function') {
        return callback(response);
      }
    });
    post_request.on('error', function(response) {
      return post_request.abort();
    });
    post_request.write(JSON.stringify(log_data));
    return post_request.end();
  };

}).call(this);
