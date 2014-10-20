(function() {
  var addZero, getdate;

  addZero = function(num, total) {
    var str;
    total = total || 2;
    str = '' + num;
    return new Array(total - str.length + 1).join('0') + str;
  };

  getdate = function(format, d) {
    var date, hour, min, month, sec, year;
    format = format || 'Y-m-d H:i:s';
    d = d || new Date();
    year = d.getFullYear();
    month = addZero(d.getMonth() + 1, 2);
    date = addZero(d.getDate(), 2);
    hour = addZero(d.getHours(), 2);
    min = addZero(d.getMinutes(), 2);
    sec = addZero(d.getSeconds(), 2);
    return format.replace('Y', year).replace('m', month).replace('d', date).replace('H', hour).replace('i', min).replace('s', sec);
  };

  exports.addZero = addZero;

  exports.getdate = getdate;

}).call(this);
