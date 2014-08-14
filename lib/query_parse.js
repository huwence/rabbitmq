(function() {
  var url;

  url = require('url');

  module.exports = function(query) {
    var url_parts;
    query = '?' === query[0] ? query : '?' + query;
    url_parts = url.parse(query, true);
    return url_parts.query;
  };

}).call(this);
