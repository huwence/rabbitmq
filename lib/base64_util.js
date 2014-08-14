(function() {
  exports.decode = function(message, is_uri_encode) {
    message = is_uri_encode ? decodeURIComponent(message) : message;
    return message = new Buffer(message, 'base64').toString('utf8');
  };

  exports.encode = function(message) {
    return new Buffer(message).toString('base64');
  };

}).call(this);
