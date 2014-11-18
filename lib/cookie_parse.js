(function() {
  var genUID, getCookie;

  getCookie = function(cookies) {
    var list;
    list = {};
    if (cookies.length) {
      cookies = cookies.split(';');
      cookies.forEach(function(cookie) {
        var parts;
        parts = cookie.split('=');
        return list[parts.shift().trim()] = unescape(parts.join('='));
      });
    }
    return list;
  };

  genUID = function() {
    var i, ids, str, time, _i;
    str = 'abcdefghigklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNXYZ-';
    time = Number(+new Date()).toString(36);
    ids = '';
    for (i = _i = 0; _i <= 16; i = ++_i) {
      ids += str[Math.floor(Math.random() * str.length)];
    }
    return ids + time;
  };

  exports.getCookie = getCookie;

  exports.genUID = genUID;

}).call(this);
