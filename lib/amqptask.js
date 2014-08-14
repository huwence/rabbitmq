(function() {
  var amqp, configenv;

  amqp = require('amqplib');

  configenv = require('../config/environment');

  exports.send = function(message, callback) {
    if (typeof callback !== 'function') {
      return false;
    }
    return amqp.connect(configenv.amqp.address).then(function(conn) {
      return conn.createChannel().then(function(ch) {
        var ok, q;
        q = 'mugeda_task';
        ok = ch.assertQueue(q, {
          durable: true
        });
        return ok.then(function() {
          var error;
          try {
            ch.sendToQueue(q, new Buffer(message), {
              deliveryMode: true
            });
            callback({
              status: 0,
              error: 'OK'
            });
          } catch (_error) {
            error = _error;
            callback({
              status: 1,
              error: error
            });
          }
          return ch.close();
        });
      });
    });
  };

}).call(this);
