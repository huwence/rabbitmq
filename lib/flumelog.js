(function() {
  var content_type, host, http, port;

  http = require('http');

  host = '172.16.0.12';

  port = '8087';

  content_type = 'application/json; charset=utf-8';

  module.exports = function(data) {
    var log_data, post_request, timestamp;
    timestamp = +new Date();
    log_data = [
      {
        "headers": data,
        "body": "log-" + timestamp
      }
    ];
    post_request = http.request({
      host: host,
      port: port,
      headers: {
        'Content-Type': content_type
      }
    }, function(response) {
      return response.on('data', function(result) {});
    });
    post_request.write(JSON.stringify(log_data));
    return post_request.end();
  };

}).call(this);
