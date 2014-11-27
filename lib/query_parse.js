(function() {
  var url;

  url = require('url');

  module.exports = function(query) {
    var error, url_parts;
    try {
      query = '?' === query[0] ? query : '?' + query;
      url_parts = url.parse(query, true);
      query = url_parts.query;
    } catch (_error) {
      error = _error;
      query = {};
    }
    return query;
  };

}).call(this);
